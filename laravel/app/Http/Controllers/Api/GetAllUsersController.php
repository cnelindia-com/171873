<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class GetAllUsersController extends Controller
{
      public function index(Request $request)
    {
        // Step 1: Query base
        $query = User::query();

    
        // Step 4: Sorting
        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');


        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'desc';
        }

        // Step 5: Pagination
        $perPage = $request->get('per_page', 10); // default = 10
        $users = $query->orderBy($sort, $order)->paginate($perPage);

        // Step 6: Response
        return response()->json([
            'status' => true,
            'message' => 'All users fetched successfully',
            'data' => $users
        ], 200);
    }
}
