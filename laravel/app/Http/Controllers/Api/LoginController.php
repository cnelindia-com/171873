<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // ✅ Step 1: Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Step 2: Check user exists
        $user = User::where('email', $request->email)->first();
            if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Diese E-Mail-Adresse existiert nicht.'
            ], 404);
        }

        // ✅ Step 3: Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Das Passwort ist falsch.'
            ], 401);
        }

        // ✅ Step 3: Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Step 4: Response
        return response()->json([
            'status' => true,
            'message' => 'Login erfolgreich!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type
            ]
        ], 200);
    }

    // Optional: Logout API
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout erfolgreich!'
        ]);
    }
}
