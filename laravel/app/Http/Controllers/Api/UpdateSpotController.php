<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Validator;

class UpdateSpotController extends Controller
{
    public function updateSpot(Request $request, $id)
    {
        // ✅ Spot check
        $spot = Spot::find($id);
        if (!$spot) {
            return response()->json([
                'status' => false,
                'message' => 'Spot not found!'
            ], 404);
        }

        $authUser = $request->user();

        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'name_of_the_place' => 'nullable|string|max:255',
            'room_type'         => 'nullable|string|max:255',
            'care_level'        => 'nullable|string|max:255',
            'availability'      => 'nullable|string|max:255',
            // 'available_from'    => 'nullable|date',
            // 'available_spots'   => 'nullable|integer|min:0',
            'postal_code'       => 'nullable|string|max:255',
            'city'              => 'nullable|string|max:255',
            'price_per_month'   => 'nullable|numeric|min:0',
            // 'latitude'          => 'numeric|between:-90,90',
            // 'longitude'         => 'numeric|between:-180,180',
            // 'description'       => 'nullable|string',
            'desc_en' => 'nullable|string',
            'desc_de' => 'nullable|string',
            'status'            => 'nullable|in:active,inactive,draft',
            'address_street'    => 'nullable|string|max:255',
            'user_id'           => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /* ---------------------------------------------------
           🔒 Resolve REAL spot owner (plan user)
        --------------------------------------------------- */
        // default → existing spot owner
        $spotUserId = $spot->user_id;

        // admin ne user change kiya?
        if ($authUser->user_type == 2 && $request->filled('user_id')) {
            $spotUserId = $request->user_id;
        }

        $planUser = User::find($spotUserId);
        if (!$planUser) {
            return response()->json([
                'status' => false,
                'message' => 'Selected user not found!'
            ], 404);
        }

        $plan       = strtolower($planUser->current_plan);
        $planStatus = strtolower($planUser->plan_status);

        /* ---------------------------------------------------
           ❌ Block expired / cancelled plans
        --------------------------------------------------- */
        if (in_array($planStatus, ['expired', 'cancelled'])) {
            return response()->json([
                'status' => false,
                'message' => 'User plan is expired or cancelled. Cannot update spot.'
            ], 403);
        }

        /* ---------------------------------------------------
           🔒 BASIC PLAN LIMIT CHECK
        --------------------------------------------------- */
        if (
            $plan === 'basic' &&
            $planStatus === 'active' &&
            $request->status === 'active' &&
            $spot->status !== 'active'
        ) {
            $activeCount = Spot::where('user_id', $spotUserId)
                ->where('status', 'active')
                ->where('id', '!=', $spot->id)
                ->count();

            if ($activeCount >= 3) {
                return response()->json([
                    'status' => false,
                    'message' => 'BASIC plan allows only 3 active spots.'
                ], 403);
            }
        }

        /* ---------------------------------------------------
           ⭐ PRIORITY & FEATURED (FORCED)
        --------------------------------------------------- */
        $priorityScore = 0;

        if ($plan === 'basic' && $planStatus === 'active') {
            $priorityScore = 3;
        }

        if ($plan === 'free' && $planStatus === 'trialing') {
            $priorityScore = 2;
        }

        if ($plan === 'pro' && $planStatus === 'active') {
            $priorityScore = 2;
        }

        if ($plan === 'enterprise' && $planStatus === 'active') {
            $priorityScore = 1;
        }

        $isFeatured = ($plan === 'enterprise' && $planStatus === 'active') ? 1 : 0;

        /* ---------------------------------------------------
           ✅ UPDATE SPOT (SAFE FIELDS ONLY)
        --------------------------------------------------- */
        $spot->update([
            'name_of_the_place' => $request->name_of_the_place,
            'room_type'         => $request->room_type,
            'care_level'        => $request->care_level,
            'availability'      => $request->availability,
            // 'available_from'    => $request->available_from,
            // 'available_spots'   => $request->available_spots,
            'postal_code'       => $request->postal_code,
            'city'              => $request->city,
            'price_per_month'   => $request->price_per_month,
            'latitude'          => $request->latitude,
            'longitude'         => $request->longitude,
            // 'description'       => $request->description,
            'desc' => [
                'en' => $request->desc_en,
                'de' => $request->desc_de,
            ],
            'address_street'    => $request->address_street,
            'status'            => $request->status,

            // 🔥 Forced & secure
            'user_id'           => $spotUserId,
            'priority_score'    => $priorityScore,
            'plan_level_cached' => $plan,
            'is_featured'       => $isFeatured,
        ]);

        // ------------------------------
        // 🔍 AUDIT LOG: SPOT UPDATE
        // ------------------------------
        AuditLog::create([
            'user_id'      => $spotUserId,        // who performed the update
            'action_type'  => 'UPDATE_SPOT',        // action type
            'reference_id' => $spot->id,            // spot id
            'meta'         => [
                'name_of_the_place' => $spot->name_of_the_place,
                'priority_score'    => $priorityScore,
                'is_featured'       => $isFeatured,
                'status'            => $spot->status,
                'user_id'           => $spotUserId
            ]
        ]);


        return response()->json([
            'status'  => true,
            'message' => 'Spot updated successfully!',
            'data'    => $spot
        ], 200);
    }
}
