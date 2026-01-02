<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // ✅ Step 1: Validate input
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',

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

            'facility_name.required'    => 'Facility Name ist erforderlich.',
            'phone.required'            => 'Telefonnummer ist erforderlich.',
            'address_street.required'   => 'Straße ist erforderlich.',
            'address_postcode.required' => 'Postleitzahl ist erforderlich.',
            'address_city.required'     => 'Stadt ist erforderlich.',
            'country.required'          => 'Land ist erforderlich.',
            'password.confirmed' => 'Passwort und Bestätigung stimmen nicht überein!',
        ],
    );

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // ✅ Step 2: Create user
        $user = User::create([
            'name'             => $request->name,
            'email'            => strtolower($request->email),
            'password'         => Hash::make($request->password),

            // role (force facility = 1)
            'user_type'        => 1,

            // facility info
            'facility_name'    => $request->facility_name,
            'phone'            => $request->phone,   

            // address
            'address_street'   => $request->address_street,
            'address_postcode' => $request->address_postcode,
            'address_city'     => $request->address_city,
            'country'          => $request->country,
        ]);

        // ✅ Step 3: Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Step 4: Response
        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully!',
            'token'   => $token,
            'user'    => [
                'id'              => $user->id,
                'name'            => $user->name,
                'email'           => $user->email,
                'user_type'       => $user->user_type,
                'facility_name'   => $user->facility_name,
                'phone'           => $user->phone,
                'address_city'    => $user->address_city,
                'country'         => $user->country,
            ],
        ], 201);
    }
}
