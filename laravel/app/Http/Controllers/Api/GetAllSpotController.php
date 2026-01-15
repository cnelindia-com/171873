<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class GetAllSpotController extends Controller
{
    
 public function index(Request $request)
{
    $query = Spot::query();

    // Join users table to check plan_status
    $query->join('users', 'users.id', '=', 'spots.user_id')
          ->select('spots.*') // select only spots columns

          // Only active spots
          ->where('spots.status', 'active')

          // Only users whose plan is NOT expired or cancelled
          ->whereNotIn('users.plan_status', ['expired', 'cancelled']);

    // Filter by user_id
    if ($request->filled('user_id')) {
        $query->where('spots.user_id', $request->user_id);
    }

    // Search filter
    if ($request->filled('q')) {
        $q = $request->q;
        $query->where(function ($sub) use ($q) {
            $sub->where('name_of_the_place', 'like', "%{$q}%")
                ->orWhere('room_type', 'like', "%{$q}%")
                ->orWhere('care_level', 'like', "%{$q}%")
                ->orWhere('location', 'like', "%{$q}%");
        });
    }

    // Sorting
    $sort = $request->get('sort', 'id');
    $order = $request->get('order', 'desc');

    if (!in_array($sort, ['id', 'name_of_the_place', 'price_per_month', 'created_at'])) {
        $sort = 'id';
    }

    if (!in_array($order, ['asc', 'desc'])) {
        $order = 'desc';
    }

    // Pagination
    $perPage = $request->get('per_page', 10);
    $spots = $query
        ->orderByRaw('priority_score IS NULL')
        ->orderBy('priority_score', 'asc')
        ->orderBy("spots.$sort", $order)
        ->paginate($perPage);

    return response()->json([
        'status' => true,
        'message' => $request->filled('user_id')
            ? 'Active spots fetched for user ID: ' . $request->user_id
            : 'All active spots fetched',
        'data' => $spots
    ], 200);
}



public function cities()
{
    $cities = \DB::table('spots')
        ->whereNotNull('city')
        ->where('city', '!=', '')
        ->select('city')
        ->distinct()
        ->orderBy('city', 'asc')
        ->get();

    return response()->json([
        'status' => true,
        'data' => $cities
    ]);
}


}
