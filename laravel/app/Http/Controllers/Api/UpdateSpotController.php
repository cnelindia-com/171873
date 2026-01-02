<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use Illuminate\Support\Facades\Validator;

class UpdateSpotController extends Controller
{
    
    public function updateSpot(Request $request, $id)
    {
        \Log::info($request->all());
        // ✅ Step 1: Spot मौजूद है या नहीं
        $spot = Spot::find($id);

        if (!$spot) {
            return response()->json([
                'status' => false,
                'message' => 'Spot not found!'
            ], 404);
        }

        // ✅ Step 2: Validation rules
        $validator = Validator::make($request->all(), [
            'name_of_the_place' => 'nullable|string|max:255',
            'room_type' => 'nullable|string|max:255',
            'care_level' => 'nullable|string|max:255',
            'availability' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'price_per_month' => 'nullable|numeric',
            'user_id' => 'nullable|integer',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'description' => 'nullable|string',
            'priority_score' => 'nullable|integer',
            'plan_level_cached' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'address_street' => 'nullable|string|max:255',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Step 3: Data update करें (सिर्फ वही fields जो आए हैं)
        $spot->update($request->only([
            'name_of_the_place',
            'room_type',
            'care_level',
            'availability',
            'available_from',
            'available_spots',
            'postal_code',
            'city',
            'price_per_month',
            'user_id',
            'latitude',
            'longitude',
            'description',
            'priority_score',
            'plan_level_cached',
            'status',
            'address_street',
        ]));

        // ✅ Step 4: Response भेजें
        return response()->json([
            'status' => true,
            'message' => 'Spot updated successfully!',
            'data' => $spot
        ], 200);
    }
}
