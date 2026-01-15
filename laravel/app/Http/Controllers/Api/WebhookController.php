<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Stripe\Product;
use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\Spot;
use App\Models\AuditLog;

class WebhookController extends Controller
{
    /**
     * Write debug logs to public file
     */
    private function writeDebug($message)
    {
        file_put_contents(
            public_path('stripe_webhook_debugtest.txt'),
            date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL,
            FILE_APPEND
        );
    }

    private function ts($timestamp)
    {
        if (! $timestamp) {
            return null;
        }

        return Carbon::createFromTimestamp($timestamp);
    }

    private function syncUserSpotsWithPlan($user)
{

    $oldSpots = Spot::where('user_id', $user->id)->get()->map(function($spot){
        return $spot->only(['priority_score', 'is_featured', 'plan_level_cached']);
    })->toArray();

    $plan = strtolower($user->current_plan);
    $planStatus = strtolower($user->plan_status);

    // if ($planStatus !== 'active') {
    //     // inactive subscription → downgrade behavior
    //     Spot::where('user_id', $user->id)->update([
    //         'priority_score'    => 3,
    //         'is_featured'       => 0,
    //         'plan_level_cached' => 'basic',
    //     ]);
    //     return;
    // }

    if ($plan === 'basic' && $planStatus == 'active') {
        // BASIC: priority = 3, no featured
        Spot::where('user_id', $user->id)->update([
            'priority_score'    => 3,
            'is_featured'       => 0,
            'plan_level_cached' => 'basic',
        ]);

        // // Optional: sirf 3 active allow
        // $activeSpots = Spot::where('user_id', $user->id)
        //     ->where('status', 'active')
        //     ->orderBy('created_at')
        //     ->get();

        // if ($activeSpots->count() > 3) {
        //     $activeSpots->slice(3)->each(function ($spot) {
        //         $spot->update(['status' => 'draft']);
        //     });
        // }
    }

    if ($plan === 'pro' && $planStatus == 'active') {
        // PRO: priority = 2, no featured
        Spot::where('user_id', $user->id)->update([
            'priority_score'    => 2,
            'is_featured'       => 0,
            'plan_level_cached' => 'pro',
        ]);
    }

    if ($plan === 'enterprise' && $planStatus == 'active') {
        // ENTERPRISE: highest priority + featured
        Spot::where('user_id', $user->id)->update([
            'priority_score'    => 1,
            'is_featured'       => 1,
            'plan_level_cached' => 'enterprise',
        ]);
    }

    $newSpots = Spot::where('user_id', $user->id)->get()->map(function($spot){
        return $spot->only(['priority_score', 'is_featured', 'plan_level_cached']);
    })->toArray();

    AuditLog::create([
        'user_id'      => $user->id,
        'action_type'  => 'SPOTS_UPDATED',
        'reference_id' => $user->id,
        'meta'         => [
            'before' => $oldSpots,
            'after'  => $newSpots,
            'timestamp' => now(),
        ],
    ]);

}

    /**
     * Handle Stripe Webhooks
     */
    public function handleWebhook(Request $request)
    {
        $this->writeDebug('---------------- WEBHOOK HIT ----------------');
        $this->writeDebug('Payload: ' . $request->getContent()); // Log the full request payload for debugging

        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (! app()->environment('production')) {
            // 🔓 LOCAL / POSTMAN testing
            $event = json_decode($payload);
            $this->writeDebug('⚠ Signature bypassed (NON-PRODUCTION)');
        } else {
            try {
                $event = Webhook::constructEvent(
                    $payload,
                    $sigHeader,
                    env('STRIPE_WEBHOOK_SECRET')
                );
                $this->writeDebug('✔ Signature verified');
            } catch (\Exception $e) {
                $this->writeDebug('❌ Signature FAILED: ' . $e->getMessage());
                return response()->json(['error' => 'Invalid webhook'], 400);
            }
        }

        $this->writeDebug('Event Type: ' . $event->type);

        switch ($event->type) {

            // 🟢 SUBSCRIPTION CREATED
            case 'customer.subscription.created':
                $s = $event->data->object;
                $this->writeDebug('Subscription created: ' . json_encode($s)); // Log subscription object

                // Get the user by Stripe customer ID
                $user = User::where('stripe_customer_id', $s->customer ?? '')->first();
                if (! $user) {
                    $this->writeDebug('No user found for customer ID: ' . $s->customer);
                    break;
                }

                // Prepare the data to be updated
                $data = [
                    'plan_status'  => $s->status ?? 'active',
                    'current_plan' => null, // Default current_plan to null
                ];

                Stripe::setApiKey(env('STRIPE_SECRET'));

                // If nickname is null, fetch the product name
                if (empty($s->items->data[0]->price->nickname)) {
                    $productId = $s->items->data[0]->price->product;
                    try {
                        $product              = \Stripe\Product::retrieve($productId);
                        $data['current_plan'] = $product->name; // Use product name if nickname is null
                    } catch (\Stripe\Exception\ApiErrorException $e) {
                        $this->writeDebug('Error retrieving product: ' . $e->getMessage());
                        break; // Stop if there is an error retrieving the product
                    }
                } else {
                    $data['current_plan'] = $s->items->data[0]->price->nickname;
                }

                // Update subscription period dates if present
                $data['stripe_subscription_id'] = $s->id;
                $data['current_period_start']   = $this->ts($s->current_period_start ?? null);
                $data['current_period_end']     = $this->ts($s->current_period_end ?? null);

                // Update user record
                $user->update($data);
                $this->writeDebug('User updated successfully for subscription created');
                break;

            case 'customer.subscription.updated':
                $s = $event->data->object;
                $this->writeDebug('Subscription updated: ' . json_encode($s)); // Log updated subscription object

                // Get the user by Stripe customer ID
                $user = User::where('stripe_customer_id', $s->customer ?? '')->first();
                if (! $user) {
                    $this->writeDebug('No user found for customer ID: ' . $s->customer);
                    break;
                }
                    $oldData = $user->only(['plan_status', 'current_plan', 'current_period_start', 'current_period_end']);
                // Prepare the data to be updated
                $data = [
                    'plan_status'  => $s->status ?? $user->plan_status,
                    'current_plan' => $user->current_plan, // Default current_plan to previous value
                ];
                Stripe::setApiKey(env('STRIPE_SECRET'));
                // If nickname is null, fetch the product name
                if (empty($s->items->data[0]->price->nickname)) {
                    $productId = $s->items->data[0]->price->product;
                    try {
                        $product              = \Stripe\Product::retrieve($productId);
                        $data['current_plan'] = $product->name; // Use product name if nickname is null
                    } catch (\Stripe\Exception\ApiErrorException $e) {
                        $this->writeDebug('Error retrieving product: ' . $e->getMessage());
                        break; // Stop if there is an error retrieving the product
                    }
                } else {
                    $data['current_plan'] = $s->items->data[0]->price->nickname;
                }

                // Update subscription period dates if present
                if (isset($s->current_period_start)) {
                    $data['current_period_start'] = Carbon::createFromTimestamp($s->current_period_start);
                }

                if (isset($s->current_period_end)) {
                    $data['current_period_end'] = Carbon::createFromTimestamp($s->current_period_end);
                }

                // If subscription is canceled at the end of the period
                if ($s->cancel_at_period_end ?? false) {
                    $data['plan_status'] = 'canceling';
                }

                // Update user record
                $user->update($data);
                AuditLog::create([
                'user_id'      => $user->id,
                'action_type'  => 'SUBSCRIPTION_UPDATED',
                'reference_id' => $user->id,
                'meta'         => [
                    'before' => $oldData,
                    'after'  => $data,
                    'event_id' => $event->id ?? null,
                    'timestamp' => now(),
                ],
            ]);
                 // 🔥 IMPORTANT
                $this->syncUserSpotsWithPlan($user);
                $this->writeDebug('User updated successfully for subscription updated');
                break;

            // 🔴 SUBSCRIPTION DELETED
            case 'customer.subscription.deleted':
                $s = $event->data->object;
                $this->writeDebug('Subscription deleted: ' . json_encode($s)); // Log deleted subscription object

                $user = User::where('stripe_customer_id', $s->customer ?? '')->first();
                if (! $user) {
                    $this->writeDebug('No user found for customer ID: ' . $s->customer);
                    break;
                }

                $user->update([
                    'plan_status'            => 'canceled',
                    'current_plan'           => null,
                    'stripe_subscription_id' => null,
                    'current_period_start'   => null,
                    'current_period_end'     => null,
                ]);
                $this->writeDebug('User updated successfully for subscription deleted');
                break;

            // ❌ PAYMENT FAILED
            case 'invoice.payment_failed':
                $i = $event->data->object;
                $this->writeDebug('Payment failed for invoice: ' . json_encode($i)); // Log payment failure

                $user = User::where('stripe_customer_id', $i->customer ?? '')->first();
                if ($user) {
                    $user->update(['plan_status' => 'payment_failed']);
                    $this->writeDebug('User plan status updated to payment_failed');
                }
                break;

            default:
                $this->writeDebug('Unhandled Event: ' . $event->type); // Log unhandled events
        }

        $this->writeDebug('---------------- WEBHOOK END ----------------');
        return response()->json(['status' => 'success']);
    }
}
