<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Return authenticated user info
     */
    public function getCurrentUser(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => true,
            'data' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'current_plan' => $user->current_plan ?? 'free', // basic | pro | enterprise | free
                'plan_status'  => $user->plan_status ?? 'expired', // active | trialing | expired | cancelled
            ]
        ]);
    }
}
