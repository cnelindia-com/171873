<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

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

    // public function createSubscriptionSession(Request $request)
    // {
    //     Stripe::setApiKey(env('STRIPE_SECRET'));

    //     $user    = $request->user();
    //     $priceId = $request->price_id;

    //     // Check if user already has a Stripe customer ID
    //     if ($user->stripe_customer_id) {
    //         // Retrieve existing customer
    //         try {
    //             $stripeCustomer = \Stripe\Customer::retrieve($user->stripe_customer_id);

    //             // Check if customer exists in Stripe
    //             if ($stripeCustomer->deleted) {
    //                 // Customer was deleted, create new one
    //                 $stripeCustomer           = $this->createNewCustomer($user);
    //                 $user->stripe_customer_id = $stripeCustomer->id;
    //             }
    //         } catch (\Exception $e) {
    //             // Customer not found in Stripe, create new one
    //             $stripeCustomer           = $this->createNewCustomer($user);
    //             $user->stripe_customer_id = $stripeCustomer->id;
    //         }
    //     } else {
    //         // Create new Stripe customer
    //         $stripeCustomer           = $this->createNewCustomer($user);
    //         $user->stripe_customer_id = $stripeCustomer->id;
    //     }

    //     // Get price details to know which plan is being purchased
    //     $price   = \Stripe\Price::retrieve($priceId);
    //     $product = \Stripe\Product::retrieve($price->product);

    //     // Create checkout session with customer
    //     $session = Session::create([
    //         'payment_method_types' => ['card'],
    //         'mode'                 => 'subscription',
    //         'customer'             => $stripeCustomer->id,
    //         'line_items'           => [[
    //             'price'    => $priceId,
    //             'quantity' => 1,
    //         ]],
    //         'metadata'             => [
    //             'user_id'      => $user->id,
    //             'price_id'     => $priceId,
    //             'product_id'   => $product->id,
    //             'product_name' => $product->name,
    //         ],
    //         'success_url'          => env('FRONTEND_URL') . '/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}',
    //         'cancel_url'           => env('FRONTEND_URL') . '/subscription-cancel',
    //     ]);

    //     // Update user with stripe customer id and plan info
    //     $user->current_plan = $product->name;
    //     $user->save();

    //     // Return session URL and other details
    //     return response()->json([
    //         'url'          => $session->url,
    //         'session_id'   => $session->id,
    //         'customer_id'  => $stripeCustomer->id,
    //         'plan_details' => [
    //             'plan_name' => $product->name,
    //             'amount'    => $price->unit_amount / 100,
    //             'currency'  => $price->currency,
    //             'interval'  => $price->recurring->interval ?? 'one_time',
    //         ],
    //     ]);
    // }
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

    // public function customerPortal(Request $request)
    // {
    //     Stripe::setApiKey(env('STRIPE_SECRET'));

    //     $user = $request->user();

    //     // Check if user has a stripe customer ID
    //     if (! $user->stripe_customer_id) {
    //         return response()->json([
    //             'error'   => 'No customer account found',
    //             'message' => 'You need to create a customer account first',
    //         ], 400);
    //     }

    //     try {
    //         // Verify customer exists in Stripe
    //         $customer = \Stripe\Customer::retrieve($user->stripe_customer_id);

    //         if (isset($customer->deleted) && $customer->deleted) {
    //             return response()->json([
    //                 'error'   => 'Customer not found',
    //                 'message' => 'Your customer account was not found in Stripe',
    //             ], 404);
    //         }

    //         // Build portal session parameters
    //         $params = [
    //             'customer'   => $user->stripe_customer_id,
    //             'return_url' => env('FRONTEND_URL') . '/dashboard/subscription',
    //         ];

    //         // Add configuration if available
    //         if (env('STRIPE_PORTAL_CONFIGURATION_ID')) {
    //             $params['configuration'] = env('STRIPE_PORTAL_CONFIGURATION_ID');
    //         }

    //         // Optional: If user has subscription, pre-select it
    //         if ($user->current_subscription_id) {
    //             try {
    //                 $subscription = \Stripe\Subscription::retrieve($user->current_subscription_id);
    //                 if ($subscription && $subscription->status !== 'canceled') {
    //                     $params['flow_data'] = [
    //                         'type'                        => 'subscription_update_confirm',
    //                         'subscription_update_confirm' => [
    //                             'subscription' => $user->current_subscription_id,
    //                         ],
    //                     ];
    //                 }
    //             } catch (\Exception $e) {
    //                 // If subscription not found, continue without flow_data
    //                 \Log::warning('Subscription not found', [
    //                     'subscription_id' => $user->current_subscription_id,
    //                     'error'           => $e->getMessage(),
    //                 ]);
    //             }
    //         }

    //         // Create portal session
    //         $portalSession = \Stripe\BillingPortal\Session::create($params);

    //         return response()->json([
    //             'url'        => $portalSession->url,
    //             'expires_at' => $portalSession->expires_at,
    //         ]);

    //     } catch (\Stripe\Exception\InvalidRequestException $e) {
    //         \Log::error('Stripe error in customer portal', [
    //             'error'   => $e->getMessage(),
    //             'user_id' => $user->id,
    //         ]);

    //         // More specific error messages
    //         $errorMessage = $e->getMessage();
    //         if (strpos($errorMessage, 'No such customer') !== false) {
    //             return response()->json([
    //                 'error'   => 'Customer not found',
    //                 'message' => 'Your Stripe customer account was not found. Please contact support.',
    //             ], 404);
    //         }

    //         return response()->json([
    //             'error'   => 'Stripe error',
    //             'message' => $errorMessage,
    //         ], 400);
    //     } catch (\Exception $e) {
    //         \Log::error('Server error in customer portal', [
    //             'error' => $e->getMessage(),
    //         ]);
    //         return response()->json([
    //             'error'   => 'Server error',
    //             'message' => 'Something went wrong. Please try again later.',
    //         ], 500);
    //     }
    // }
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


    // public function currentSubscription(Request $request)
    // {
    //     $user = $request->user();

    //     // Check Stripe first if customer exists
    //     if ($user->stripe_customer_id) {
    //         Stripe::setApiKey(env('STRIPE_SECRET'));

    //         try {
    //             // Check for active subscription
    //             $subscriptions = \Stripe\Subscription::all([
    //                 'customer' => $user->stripe_customer_id,
    //                 'status'   => 'active',
    //                 'limit'    => 1,
    //             ]);

    //             if (! empty($subscriptions->data)) {
    //                 $subscription = $subscriptions->data[0];
    //                 $price        = $subscription->items->data[0]->price;
    //                 $product      = \Stripe\Product::retrieve($price->product);

    //                 // Update user record
    //                 $user->update([
    //                     'current_plan'           => $product->name,
    //                     'plan_status'            => $subscription->status,
    //                     'stripe_subscription_id' => $subscription->id,
    //                     'current_period_end'     => date('Y-m-d', $subscription->current_period_end),
    //                     'current_period_start'   => date('Y-m-d', $subscription->current_period_start),
    //                     'amount'                 => $price->unit_amount / 100,
    //                     'currency'               => strtoupper($price->currency),
    //                 ]);

    //                 return response()->json([
    //                     'has_subscription'     => true,
    //                     'planName'             => $product->name,
    //                     'customer_id'          => $user->stripe_customer_id,
    //                     'subscription_id'      => $subscription->id,
    //                     'status'               => $subscription->status,
    //                     'current_period_end'   => date('Y-m-d', $subscription->current_period_end),
    //                     'current_period_start' => date('Y-m-d', $subscription->current_period_start),
    //                     'amount'               => $price->unit_amount / 100,
    //                     'currency'             => strtoupper($price->currency),
    //                     'note'                 => 'From Stripe (active)',
    //                 ]);
    //             }

    //             // If no active subscription, check for trialing status
    //             $trialingSubscriptions = \Stripe\Subscription::all([
    //                 'customer' => $user->stripe_customer_id,
    //                 'status'   => 'trialing',
    //                 'limit'    => 1,
    //             ]);

    //             if (! empty($trialingSubscriptions->data)) {
    //                 $subscription = $trialingSubscriptions->data[0];
    //                 $price        = $subscription->items->data[0]->price;
    //                 $product      = \Stripe\Product::retrieve($price->product);

    //                 // Update user record with trialing status
    //                 $user->update([
    //                     'current_plan'           => $product->name,
    //                     'plan_status'            => $subscription->status,
    //                     'stripe_subscription_id' => $subscription->id,
    //                     'current_period_end'     => date('Y-m-d', $subscription->current_period_end),
    //                     'current_period_start'   => date('Y-m-d', $subscription->current_period_start),
    //                     'amount'                 => $price->unit_amount / 100,
    //                     'currency'               => strtoupper($price->currency),
    //                 ]);

    //                 return response()->json([
    //                     'has_subscription'     => true,
    //                     'planName'             => $product->name,
    //                     'customer_id'          => $user->stripe_customer_id,
    //                     'subscription_id'      => $subscription->id,
    //                     'status'               => $subscription->status,
    //                     'current_period_end'   => date('Y-m-d', $subscription->current_period_end),
    //                     'current_period_start' => date('Y-m-d', $subscription->current_period_start),
    //                     'amount'               => $price->unit_amount / 100,
    //                     'currency'             => strtoupper($price->currency),
    //                     'note'                 => 'From Stripe (trialing)',
    //                 ]);
    //             }

    //             // If no active/trialing subscription found, update status to inactive
    //             $user->update([
    //                 'plan_status'            => 'inactive',
    //                 'current_plan'           => null,
    //                 'stripe_subscription_id' => null,
    //                 'current_period_end'     => null,
    //                 'current_period_start'   => null,
    //             ]);

    //         } catch (\Exception $e) {
    //             // Log error if needed
    //             // Log::error('Stripe subscription check failed: ' . $e->getMessage());
    //         }
    //     }

    //     // Check user's current status after all checks
    //     if ($user->current_plan && $user->plan_status === 'active') {
    //         return response()->json([
    //             'has_subscription'     => true,
    //             'planName'             => $user->current_plan,
    //             'customer_id'          => $user->stripe_customer_id,
    //             'subscription_id'      => $user->stripe_subscription_id,
    //             'status'               => $user->plan_status,
    //             'current_period_end'   => $user->current_period_end,
    //             'current_period_start' => $user->current_period_start,
    //             'amount'               => $user->amount ?? 0,
    //             'currency'             => $user->currency ?? 'USD',
    //             'note'                 => 'From database',
    //         ]);
    //     }

    //     // After checking Stripe, if nothing is active/trialing
    //     if (! $subscriptions->data && ! $trialingSubscriptions->data) {
    //         // Don't overwrite plan_status blindly
    //         return response()->json([
    //             'has_subscription' => false,
    //             'planName'         => $user->current_plan,
    //             'status'           => $user->plan_status, // could be 'canceled', 'inactive', etc
    //             'message'          => 'No active subscription found',
    //         ]);
    //     }
    // }

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


    public function handleWebhook()
    {
        return "hello";
    }
}
