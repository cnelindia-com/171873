<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class GetProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        // ✅ Step 1: Validate input
        $request->validate([
            'user_id' => 'required|integer'
        ]);

      

        // ✅ Step 2: Find user by ID
        $user = User::find($request->user_id);

        // ✅ Step 3: Handle if user not found
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        // ✅ Step 4: Return response
        return response()->json([
            'status' => true,
            'message' => 'User profile fetched successfully!',
            'data' => $user
        ], 200);
    }
}
