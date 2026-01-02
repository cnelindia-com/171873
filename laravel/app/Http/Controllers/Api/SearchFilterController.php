<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class SearchFilterController extends Controller
{
    public function filter(Request $request)
    {
        $query = Spot::query();

        // Direct filters (ready)
        $directFilters = [
            'care_level',
            'room_type',
            'availability',
            'postal_code',
            'city',
        ];

        foreach ($directFilters as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->$field);
            }
        }

        // ⭐ STEP 1: Check if distance + lat + lng is sent
        if ($request->filled('lat') && $request->filled('lng') && $request->filled('distance')) {

            $lat = $request->lat;
            $lng = $request->lng;
            $distance = $request->distance; // in km

            // ⭐ STEP 2: Apply Haversine formula
            $query->selectRaw("
                *, (
                    6371 * acos(
                        cos(radians(?)) *
                        cos(radians(latitude)) *
                        cos(radians(longitude) - radians(?)) +
                        sin(radians(?)) *
                        sin(radians(latitude))
                    )
                ) AS distance
            ", [$lat, $lng, $lat])
            ->having("distance", "<=", $distance)
            ->orderBy("distance");
        }

        // ⭐ STEP 3: Pagination response
        return response()->json([
            "status" => true,
            "data" => $query->paginate(10)
        ]);
    }
    public function details($id)
    {
        $spot = Spot::find($id);

        if (!$spot) {
            return response()->json([
                "status" => false,
                "message" => "Facility not found"
            ], 404);
        }

        return response()->json([
            "status" => true,
            "data" => $spot
        ]);
    }

}
