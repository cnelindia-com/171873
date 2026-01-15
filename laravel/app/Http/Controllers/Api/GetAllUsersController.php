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
        $query = User::query();
        $query->where('user_type', '!=', 2);

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');

        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'desc';
        }

        $perPage = $request->get('per_page', 10);
        $users = $query->orderBy($sort, $order)->paginate($perPage);

        return response()->json([
            'status' => true,
            'message' => 'Users fetched successfully',
            'data' => $users
        ], 200);
    }
}
