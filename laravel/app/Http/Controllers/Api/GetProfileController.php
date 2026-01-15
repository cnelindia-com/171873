<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

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

    public function updateProfileImage(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        // old image delete (optional)
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        // upload new image
        $path = $request->file('image')->store('profile-images', 'public');

        // save in DB
        $user->image = $path;
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile image updated successfully',
            'image_url' => asset('storage/' . $path)
        ]);
    }
}
