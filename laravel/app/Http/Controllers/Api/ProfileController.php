<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\AuditLog;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'user_type' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $changes = [];

        if ($request->filled('name')) {
            $changes['name'] = ['old' => $user->name, 'new' => $request->name];
            $user->name = $request->name;
        }

        if ($request->filled('email')) {
            $changes['email'] = ['old' => $user->email, 'new' => $request->email];
            $user->email = $request->email;
        }

        if ($request->filled('user_type')) {
            $changes['user_type'] = ['old' => $user->user_type, 'new' => $request->user_type];
            $user->user_type = $request->user_type;
        }

        $user->save();

        if (!empty($changes)) {
            AuditLog::create([
                'user_id'      => $user->id,
                'action_type'  => 'UPDATE_PROFILE',
                'reference_id' => $user->id,
                'meta'         => $changes
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully!',
            'data' => $user
        ], 200);
    }

    public function changePassword(Request $request)
        {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'old_password' => 'required',
                'new_password' => 'required|min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Current password is incorrect'
                ], 403);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            // Audit log for password change
            AuditLog::create([
                'user_id'      => $user->id,
                'action_type'  => 'CHANGE_PASSWORD',
                'reference_id' => $user->id,
                'meta'         => ['changed_at' => now()]
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Password changed successfully'
            ]);
        }




}
