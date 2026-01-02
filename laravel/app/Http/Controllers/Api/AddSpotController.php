<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use Illuminate\Support\Facades\Validator;

class AddSpotController extends Controller
{
    public function addSpot(Request $request)
    {
        $user = $request->user();

        // Normalize plan & status
        $plan = strtolower($user->current_plan);      // basic | pro | enterprise
        $planStatus = strtolower($user->plan_status); // active | cancelled | expired

        // ❗ If subscription not active → downgrade to BASIC
        // if ($planStatus !== 'active') {
        //     $plan = 'basic';
        // }

        $validator = Validator::make($request->all(), [
            'name_of_the_place' => 'required|string|max:255',
            'room_type'         => 'nullable|string|max:255',
            'care_level'        => 'nullable|string|max:255',
            'availability'      => 'nullable|string|max:255',
            'available_from'    => 'nullable|date',
            'available_spots'   => 'nullable|integer|min:0',
            'address_street'    => 'nullable|string|max:255',
            'postal_code'       => 'nullable|string|max:20',
            'city'              => 'nullable|string|max:255',
            'price_per_month'   => 'nullable|numeric|min:0',
            'latitude'          => 'nullable|numeric|between:-90,90',
            'longitude'         => 'nullable|numeric|between:-180,180',
            'description'       => 'nullable|string',
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
            $activeCount = Spot::where('user_id', $user->id)
                ->where('status', 'active')
                ->count();

            if ($activeCount >= 3) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Der BASIC-Plan ermöglicht bis zu 3 aktive Standorte. Bitte führen Sie ein Upgrade auf PRO durch, um weitere hinzuzufügen.'
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
            'available_from'    => $request->available_from,
            'available_spots'   => $request->available_spots,
            'address_street'    => $request->address_street,
            'postal_code'       => $request->postal_code,
            'city'              => $request->city,
            'price_per_month'   => $request->price_per_month,
            'latitude'          => $request->latitude,
            'longitude'         => $request->longitude,
            'description'       => $request->description,
            'status'            => $request->status ?? 'draft',
            'priority_score'    => $priorityScore,
            'plan_level_cached' => $plan,
            'is_featured'       => $isFeatured,
            'user_id'           => $user->id,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Spot added successfully!',
            'data'    => $spot
        ], 201);
    }
}
