<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class GetAllSpotController extends Controller
{
    
    public function index(Request $request)
{
    // Step 1: Query base
    $query = Spot::query();

    // Step 2: user_id filter
    if ($request->filled('user_id')) {
        $query->where('user_id', $request->user_id);
    }

    // Step 3: Search filter
    if ($request->filled('q')) {
        $q = $request->q;
        $query->where(function ($sub) use ($q) {
            $sub->where('name_of_the_place', 'like', "%{$q}%")
                ->orWhere('room_type', 'like', "%{$q}%")
                ->orWhere('care_level', 'like', "%{$q}%")
                ->orWhere('location', 'like', "%{$q}%");
        });
    }

    // Step 4: Sorting
    $sort = $request->get('sort', 'id');
    $order = $request->get('order', 'desc');

    if (!in_array($sort, ['id', 'name_of_the_place', 'price_per_month', 'created_at'])) {
        $sort = 'id';
    }

    if (!in_array($order, ['asc', 'desc'])) {
        $order = 'desc';
    }

    // Step 5: Pagination
    $perPage = $request->get('per_page', 10); // default = 10
   $spots = $query
    ->orderByRaw('priority_score IS NULL')
    ->orderBy('priority_score', 'asc')
    ->orderBy($sort, $order)
    ->paginate($perPage);
    // $spots = $query->orderBy($sort, $order)->paginate($perPage);

    // Step 6: Response
    return response()->json([
        'status' => true,
        'message' => $request->filled('user_id')
            ? 'Spots fetched successfully for user ID: ' . $request->user_id
            : 'All spots fetched successfully',
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
