<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        $subscriptions = User::select(
                'id',
                'name',
                'facility_name',
                'current_plan',
                'plan_status',
                'created_at',
                'current_period_end'
            )
            ->where('user_type', '!=', 2)        // ✅ ADMIN EXCLUDED
            ->whereNotNull('current_plan')       
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $subscriptions
        ]);
    }
}
