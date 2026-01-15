<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;
use App\Models\AuditLog;

class StripeController extends Controller
{
    public function getPlans()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        // Get all prices
        $prices = Price::all([
            'active' => true,
            'limit'  => 10,
        ]);

        $plans = [];
        foreach ($prices->data as $price) {
            // Get product info
            $product = Product::retrieve($price->product);

            $plans[] = [
                'id'       => $price->id,
                'name'     => $product->name,
                'price'    => $price->unit_amount / 100, // Stripe amounts are in cents
                'currency' => strtoupper($price->currency),
                'interval' => $price->recurring->interval ?? 'one-time',
                'features' => explode(',', $product->description ?? ''), // optional
            ];
        }

        return response()->json($plans);
    }


    public function createSubscriptionSession(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $user = $request->user();
        $priceId = $request->price_id;

        // 🚫 BLOCK if already subscribed (VERY IMPORTANT)
        if ($user->stripe_subscription_id) {
            return response()->json([
                'error' => 'Already subscribed',
                'message' => 'Please use upgrade option'
            ], 400);
        }

        // ✅ Get or create customer
        $stripeCustomer = $this->getOrCreateCustomer($user);

        $price   = \Stripe\Price::retrieve($priceId);
        $product = \Stripe\Product::retrieve($price->product);
        
        // 🔹 Audit log for plan selection
        AuditLog::create([
            'user_id'      => $user->id,
            'action_type'  => 'SELECT_PLAN',
            'reference_id' => $user->id,
            'meta' => [
                'plan_id'   => $priceId,
                'plan_name' => $product->name,
                'selected_at' => now(),
            ],
        ]);

        $session = Session::create([
            'mode'     => 'subscription',
            'customer' => $stripeCustomer->id,
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'success_url' => env('FRONTEND_URL') . '/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => env('FRONTEND_URL') . '/subscription-cancel',
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        return response()->json([
            'url' => $session->url
        ]);
    }


    /**
     * Helper method to create new Stripe customer
     */
    private function createNewCustomer($user)
    {
        return \Stripe\Customer::create([
            'email'    => $user->email,
            'name'     => $user->name,
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);
    }

    /**
     * Helper method to retrieve or create customer
     * (Alternative approach)
     */
    private function getOrCreateCustomer($user)
    {
        if ($user->stripe_customer_id) {
            try {
                return \Stripe\Customer::retrieve($user->stripe_customer_id);
            } catch (\Exception $e) {
                // Customer not found, fall through to create new
            }
        }

        $stripeCustomer = \Stripe\Customer::create([
            'email'    => $user->email,
            'name'     => $user->name,
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        $user->stripe_customer_id = $stripeCustomer->id;
        $user->save();

        return $stripeCustomer;
    }

    public function customerPortal(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $user = $request->user();

        if (! $user->stripe_customer_id) {
            return response()->json([
                'error' => 'No Stripe customer found'
            ], 400);
        }

        $portalSession = \Stripe\BillingPortal\Session::create([
            'customer' => $user->stripe_customer_id,
            'return_url' => env('FRONTEND_URL') . '/dashboard/subscription',
        ]);

        return response()->json([
            'url' => $portalSession->url
        ]);
    }


        public function currentSubscription(Request $request)
    {
        $user = $request->user();

        $currentStatusInDb = $user->plan_status; // ✅ Get current DB status

        // Default response if nothing active/trialing
        $response = [
            'has_subscription' => false,
            'planName'         => $user->current_plan,
            'status'           => $currentStatusInDb, // respect DB value
            'message'          => 'No active subscription found',
        ];

        if ($user->stripe_customer_id) {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            try {
                $subscriptions = \Stripe\Subscription::all([
                    'customer' => $user->stripe_customer_id,
                    'status'   => 'active',
                    'limit'    => 1,
                ]);

                if (!empty($subscriptions->data)) {
                    $subscription = $subscriptions->data[0];
                    $price        = $subscription->items->data[0]->price;
                    $product      = \Stripe\Product::retrieve($price->product);

                    // Only update DB if status changed
                    if ($currentStatusInDb !== $subscription->status) {
                        $user->update([
                            'current_plan'           => $product->name,
                            'plan_status'            => $subscription->status,
                            'stripe_subscription_id' => $subscription->id,
                            'current_period_end'     => date('Y-m-d', $subscription->current_period_end),
                            'current_period_start'   => date('Y-m-d', $subscription->current_period_start),
                            'amount'                 => $price->unit_amount / 100,
                            'currency'               => strtoupper($price->currency),
                        ]);
                    }

                    $response = [
                        'has_subscription'     => true,
                        'planName'             => $product->name,
                        'customer_id'          => $user->stripe_customer_id,
                        'subscription_id'      => $subscription->id,
                        'status'               => $subscription->status,
                        'current_period_end'   => date('Y-m-d', $subscription->current_period_end),
                        'current_period_start' => date('Y-m-d', $subscription->current_period_start),
                        'amount'               => $price->unit_amount / 100,
                        'currency'             => strtoupper($price->currency),
                        'note'                 => 'From Stripe (active)',
                    ];
                }

            } catch (\Exception $e) {
                \Log::error('Stripe subscription check failed: ' . $e->getMessage());
            }
        }

        return response()->json($response);
    }
}
