<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Spot;
use Illuminate\Http\Request;

class SearchFilterController extends Controller
{
    public function filter(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDATION: city OR postal_code required
        |--------------------------------------------------------------------------
        */
        if (! $request->filled('city') && ! $request->filled('postal_code')) {
            return response()->json([
                'status'  => false,
                'message' => 'Please enter a city or postal code.'
            ], 422);
        }

        $query = Spot::query()
            ->select('spots.*')
            ->join('users', 'users.id', '=', 'spots.user_id')
            ->where('spots.status', 'active')
            ->whereIn('users.plan_status', ['active', 'trialing']);

        /*
        |--------------------------------------------------------------------------
        | BASIC FILTERS
        |--------------------------------------------------------------------------
        */
        if ($request->filled('postal_code')) {
            $query->where('spots.postal_code', 'LIKE', $request->postal_code . '%');
        } else {
            $query->whereRaw('LOWER(spots.city) LIKE ?', [
                '%' . strtolower($request->city) . '%'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | OPTIONAL FILTERS
        |--------------------------------------------------------------------------
        */
        if ($request->filled('care_level')) {
            $query->where('spots.care_level', $request->care_level);
        }

        if ($request->filled('availability')) {
            $query->where('spots.availability', $request->availability);
        }

        if ($request->filled('price_min') || $request->filled('price_max')) {
            $query->whereBetween('spots.price_per_month', [
                $request->price_min ?? 0,
                $request->price_max ?? 999999
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        */
        $sort = $request->get('sort', 'recommended');

        switch ($sort) {

            case 'price_asc':
                $query->orderBy('spots.price_per_month', 'asc');
                $this->applyPlanPriority($query);
                break;

            case 'price_desc':
                $query->orderBy('spots.price_per_month', 'desc');
                $this->applyPlanPriority($query);
                break;

            case 'availability':
                $this->applyPlanPriority($query);
                $query->orderByRaw("
                    CASE spots.availability
                        WHEN '1' THEN 1  -- Sofort
                        WHEN '2' THEN 2  -- Bald
                        WHEN '3' THEN 3  -- Auf Anfrage
                        ELSE 4
                    END
                ")->orderBy('spots.price_per_month', 'asc');
                break;

            case 'distance':
                if ($request->filled('lat') && $request->filled('lng')) {

                    $query->whereNotNull('spots.latitude')
                          ->whereNotNull('spots.longitude');

                    $query->selectRaw("
                        (
                            6371 * acos(
                                cos(radians(?)) *
                                cos(radians(spots.latitude)) *
                                cos(radians(spots.longitude) - radians(?)) +
                                sin(radians(?)) *
                                sin(radians(spots.latitude))
                            )
                        ) AS distance
                    ", [$request->lat, $request->lng, $request->lat]);

                    $this->applyPlanPriority($query);
                    $query->orderBy('distance', 'asc');
                } else {
                    $this->applyRecommendedSort($query);
                }
                break;

            default: // recommended
                $this->applyRecommendedSort($query);
                break;
        }

        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */
        $perPage   = $request->get('per_page', 10);
        $paginator = $query->paginate($perPage);

        return response()->json([
            'status'        => true,
            'results'       => $paginator->items(),
            'total_count'   => $paginator->total(),
            'current_page'  => $paginator->currentPage(),
            'total_pages'   => $paginator->lastPage(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Recommended sorting
    |--------------------------------------------------------------------------
    */
    private function applyRecommendedSort($query)
    {
        $this->applyPlanPriority($query);

        $query->orderByRaw("
            CASE spots.availability
                WHEN '1' THEN 1
                WHEN '2' THEN 2
                WHEN '3' THEN 3
                ELSE 4
            END
        ")->orderBy('spots.price_per_month', 'asc');
    }

    /*
    |--------------------------------------------------------------------------
    | Plan priority sorting
    |--------------------------------------------------------------------------
    */
    private function applyPlanPriority($query)
    {
        $query->orderByRaw("
            CASE spots.plan_level_cached
                WHEN 'enterprise' THEN 1
                WHEN 'pro' THEN 2
                WHEN 'basic' THEN 3
                WHEN 'free' THEN 4
                ELSE 5
            END
        ");
    }

    /*
    |--------------------------------------------------------------------------
    | Spot details
    |--------------------------------------------------------------------------
    */
    public function details($id)
    {
        $spot = Spot::find($id);

        if (! $spot) {
            return response()->json([
                "status"  => false,
                "message" => "Facility not found",
            ], 404);
        }

        return response()->json([
            "status" => true,
            "data"   => $spot,
        ]);
    }

    public function getCityByPostal(Request $request)
{
    if (! $request->filled('postal_code')) {
        return response()->json([
            'status' => false,
            'message' => 'Postal code required'
        ], 422);
    }

    $spot = Spot::where('postal_code', 'LIKE', $request->postal_code . '%')
        ->select('city')
        ->first();

    if (! $spot) {
        return response()->json([
            'status' => false,
            'city' => null
        ]);
    }

    return response()->json([
        'status' => true,
        'city' => $spot->city
    ]);
}

}
