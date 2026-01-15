<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\AuditLog;


class AddSpotController extends Controller
{
    public function addSpot(Request $request)
    {
        $user = $request->user();
        $planUser   = $user;

        // Default: logged-in user
        $spotUserId = $user->id;

        // If ADMIN & user_id is sent from frontend
        if ($user->user_type == 2 && $request->filled('user_id')) {
          $spotUserId = $request->user_id;

            $planUser = User::find($spotUserId);
            if (!$planUser) {
                return response()->json([
                    'status' => false,
                    'message' => 'Selected user not found'
                ], 404);
            }
        }

        $plan       = strtolower($planUser->current_plan);
        $planStatus = strtolower($planUser->plan_status);

        // ❌ Block expired or inactive users from adding spots
        if ($planStatus === 'expired' || $planStatus === 'cancelled') {
            return response()->json([
                'status'  => false,
                'error_code' => 'PLAN_EXPIRED'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name_of_the_place' => 'required|string|max:255',
            'room_type'         => 'nullable|string|max:255',
            'care_level'        => 'nullable|string|max:255',
            'availability'      => 'nullable|string|max:255',
            // 'available_from'    => 'nullable|date',
            'available_spots'   => 'nullable|integer|min:0',
            'address_street'    => 'nullable|string|max:255',
            'postal_code'       => 'nullable|string|max:20',
            'city'              => 'nullable|string|max:255',
            'price_per_month'   => 'nullable|numeric|min:0',
            'latitude'          => 'nullable|numeric|between:-90,90',
            'longitude'         => 'nullable|numeric|between:-180,180',
            // 'description'       => 'nullable|string',
            'desc_en' => 'nullable|string',
            'desc_de' => 'nullable|string',
            'status'            => 'nullable|in:active,inactive,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /* ---------------------------------------------------
           🔒 BASIC RULE: MAX 3 ACTIVE SPOTS
        --------------------------------------------------- */
        if ($plan === 'basic' && $planStatus == "active") {
            $activeCount = Spot::where('user_id', $spotUserId)
            ->where('status', 'active')
            ->count();
            if ($activeCount >= 3) {
                return response()->json([
                    'status' => false,
                    'error_code' => 'BASIC_LIMIT_EXCEEDED'
                ], 403);
            }
        }

        /* ---------------------------------------------------
           ⭐ PRIORITY LOGIC
           BASIC      → 0
           PRO        → as provided
           ENTERPRISE → forced high
        --------------------------------------------------- */
        $priorityScore = (int) ($request->priority_score ?? 0);
        //  dd($plan,$planStatus);
        if ($plan === 'basic' && $planStatus == "active") {
            $priorityScore = 3;
        }
        if ($planStatus === 'trialing' && $plan == "free") {
            // die("tt");
            $priorityScore = 4;
        }
        // dd($priorityScore,"dfgdfgd");
        if ($plan === 'pro' && $planStatus == "active") {
            // PRO → allow whatever frontend sends
           $priorityScore = 2;
        }

        if ($plan === 'enterprise' && $planStatus == "active") {
            // dd("tesdd");
            $priorityScore = 1;
        }

        /* ---------------------------------------------------
           ⭐ FEATURED (ENTERPRISE only)
        --------------------------------------------------- */
        $isFeatured = ($plan === 'enterprise' && $planStatus == "active") ? 1 : 0;
        // dd($isFeatured);
        /* ---------------------------------------------------
           ✅ CREATE SPOT
        --------------------------------------------------- */
        $spot = Spot::create([
            'name_of_the_place' => $request->name_of_the_place,
            'room_type'         => $request->room_type,
            'care_level'        => $request->care_level,
            'availability'      => $request->availability,
            // 'available_from'    => $request->available_from,
            'available_spots'   => $request->available_spots,
            'address_street'    => $request->address_street,
            'postal_code'       => $request->postal_code,
            'city'              => $request->city,
            'price_per_month'   => $request->price_per_month,
            // 'latitude'          => $request->latitude,
            // 'longitude'         => $request->longitude,
            'latitude'  => $request->filled('latitude') ? $request->latitude : '',
            'longitude' => $request->filled('longitude') ? $request->longitude : '',
            // 'description'       => $request->description,
            'desc' => [
                'en' => $request->desc_en,
                'de' => $request->desc_de,
            ],

            'status'            => $request->status ?? 'draft',
            'priority_score'    => $priorityScore,
            'plan_level_cached' => $plan,
            'is_featured'       => $isFeatured,
            'user_id'           => $spotUserId, // 🔥 FIXED
        ]);
        // ------------------------------
        // 🔍 AUDIT LOG
        // ------------------------------
        AuditLog::create([
            'user_id'      => $spotUserId,          // who performed the action
            'action_type'  => 'CREATE_SPOT',      // type of action
            'reference_id' => $spot->id,          // ID of the spot created
            'meta'         => [
                'name_of_the_place' => $spot->name_of_the_place,
                'plan_level'       => $plan,
                'priority_score'   => $priorityScore,
                'is_featured'      => $isFeatured,
                'status'           => $spot->status
            ]
        ]);


        return response()->json([
            'status'  => true,
            'message' => 'Spot added successfully!',
            'data'    => $spot
        ], 201);
    }
}
