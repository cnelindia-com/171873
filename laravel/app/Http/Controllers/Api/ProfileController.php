<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        // ✅ Step 1: Auth user
        $user = $request->user();

        // ✅ Step 2: Validation rules
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'user_type' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Step 3: Update fields if provided
        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        if ($request->filled('email')) {
            $user->email = $request->email;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->filled('user_type')) {
            $user->user_type = $request->user_type;
        }

        $user->save();

        // ✅ Step 4: Return updated user info
        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully!',
            'data' => $user
        ], 200);
    }
}
