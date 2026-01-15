<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use App\Models\AuditLog;

class PlanMaintenanceController extends Controller
{
    /**
     * Manually expire trial users after 14 days
     */
    public function expireTrialPlans(Request $request)
    {
        $now = Carbon::now();

        $users = User::where('plan_status', 'trialing')
            ->whereNotNull('current_period_end')
            ->where('current_period_end', '<', $now)
            ->get();

        $expiredUsers = [];

        foreach ($users as $user) {

            // Safety check: agar paid plan le liya ho to skip
            if (in_array($user->current_plan, ['pro', 'enterprise'])) {
                continue;
            }

            $user->update([
                'plan_status' => 'expired',
                'current_plan' => 'free',
                'current_period_end' => null
            ]);

            // ------------------------------
            // 🔍 AUDIT LOG: PLAN EXPIRED
            // ------------------------------
            AuditLog::create([
                'user_id'      => null, // system action, no logged-in user
                'action_type'  => 'EXPIRE_TRIAL_PLAN',
                'reference_id' => $user->id, // user ID whose plan expired
                'meta'         => [
                    'name'           => $user->name,
                    'email'          => $user->email,
                    'previous_plan'  => $user->current_plan,
                    'new_plan'       => 'free',
                    'plan_status'    => 'expired',
                    'expired_at'     => now()->toDateTimeString()
                ]
            ]);

            $expiredUsers[] = [
                'user_id' => $user->id,
                'name'    => $user->name ?? null,
                'email'   => $user->email ?? null
            ];
        }
        $message = count($expiredUsers) > 0
        ? 'Trial plans expired successfully'
        : 'No trial plans found for expiration';
        return response()->json([
            'status'         => true,
            'message'        => $message,
            'expired_count'  => count($expiredUsers),
            'expired_users'  => $expiredUsers
        ]);
    }
}
