<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\AuditLog;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // ✅ Step 1: Validate input
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|min:6|confirmed',

            'facility_name'    => 'required|string|max:255',
            'phone'            => 'required|string|max:20',
            'address_street'   => 'required|string|max:255',
            'address_postcode' => 'required|string|max:20',
            'address_city'     => 'required|string|max:100',
            'country'          => 'required|string|max:100',
        ], [
            'name.required'             => 'Name ist erforderlich.',
            'email.required'            => 'E-Mail-Adresse ist erforderlich.',
            'email.email'               => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            'email.unique'              => 'Die E-Mail-Adresse ist bereits vergeben.',
            'password.required'         => 'Passwort ist erforderlich.',
            'password.min'              => 'Das Passwort muss mindestens 6 Zeichen lang sein.',
            'password.confirmed'        => 'Passwort und Bestätigung stimmen nicht überein!',

            'facility_name.required'    => 'Facility Name ist erforderlich.',
            'phone.required'            => 'Telefonnummer ist erforderlich.',
            'address_street.required'   => 'Straße ist erforderlich.',
            'address_postcode.required' => 'Postleitzahl ist erforderlich.',
            'address_city.required'     => 'Stadt ist erforderlich.',
            'country.required'          => 'Land ist erforderlich.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // ✅ Step 2: Set FREE TRIAL (14 days)
        $trialEndsAt = Carbon::now()->addDays(14);

        // ✅ Step 3: Create user with FREE TRIAL
        $user = User::create([
            'name'             => $request->name,
            'email'            => strtolower($request->email),
            'password'         => Hash::make($request->password),

            // role (facility)
            'user_type'        => 1,

            // facility info
            'facility_name'    => $request->facility_name,
            'phone'            => $request->phone,

            // address
            'address_street'   => $request->address_street,
            'address_postcode' => $request->address_postcode,
            'address_city'     => $request->address_city,
            'country'          => $request->country,

            // ✅ FREE TRIAL DETAILS
            'current_plan'        => 'Free',        // PRO access during trial
            'plan_status'         => 'trialing',   // trial active
            'current_period_end'  => $trialEndsAt, // trial expiry date
        ]);

        // ✅ Step 4: Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;
         // 🔹 Audit log for registration
        AuditLog::create([
            'user_id'      => $user->id,
            'action_type'  => 'USER_REGISTER',
            'reference_id' => $user->id,
            'meta' => [
                'name'          => $user->name,
                'email'         => $user->email,
                'facility_name' => $user->facility_name,
                'plan'          => $user->current_plan,
                'trial_ends_at' => $trialEndsAt,
                'created_at'    => now(),
            ],
        ]);
        // ✅ Step 5: Response
        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully with 14-day free trial!',
            'token'   => $token,
            'user'    => [
                'id'                 => $user->id,
                'name'               => $user->name,
                'email'              => $user->email,
                'user_type'          => $user->user_type,
                'facility_name'      => $user->facility_name,
                'phone'              => $user->phone,
                'address_city'       => $user->address_city,
                'country'            => $user->country,
                'current_plan'       => $user->current_plan,
                'plan_status'        => $user->plan_status,
                'trial_ends_at'      => $user->current_period_end,
            ],
        ], 201);
    }
}
