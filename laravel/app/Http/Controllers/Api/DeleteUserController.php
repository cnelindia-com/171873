<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DeleteUserController extends Controller
{
    public function deleteSpot(Request $request, $id)
    {
        
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'user not found!'
            ], 404);
        }

        
        // if ($request->user()->user_type != 2) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Access denied! Only admin can delete spots.'
        //     ], 403);
        // }

        // ✅ Step 3: Delete the record
        $user->delete();

        // ✅ Step 4: Response return करें
        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully!'
        ], 200);
    }
}
