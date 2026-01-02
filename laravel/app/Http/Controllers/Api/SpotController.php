<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class SpotController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Step 1: Query base
        $query = Spot::query();

        // ✅ Step 2: अगर user_id भेजा गया है तो filter करें
        // if ($request->filled('user_id')) {
        //     $query->where('user_id', $request->user_id);
        // }
        // Only filter by user_id if usertype != 2
    if ($request->filled('user_id') && $request->get('usertype') != 2) {
        $query->where('user_id', $request->user_id);
    }

        // ✅ Step 3: Optional search filter (q param)
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('name_of_the_place', 'like', "%{$q}%")
                    ->orWhere('room_type', 'like', "%{$q}%")
                    ->orWhere('care_level', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%");
            });
        }

        // ✅ Step 4: Sorting (optional)
        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');

        if (!in_array($sort, ['id', 'name_of_the_place', 'price_per_month', 'created_at'])) {
            $sort = 'id';
        }

        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'desc';
        }

        $spots = $query->orderBy($sort, $order)->get();

        // ✅ Step 5: Response
        return response()->json([
            'status' => true,
            'message' => $request->filled('user_id')
                ? 'Spots fetched successfully for user ID: ' . $request->user_id
                : 'All spots fetched successfully',
            'count' => $spots->count(),
            'data' => $spots
        ], 200);
    }
}
