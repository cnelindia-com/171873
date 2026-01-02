<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Spot;
use App\Models\User;
use App\Models\Lead;

class ContactInquiryController extends Controller
{
    public function sendInquiry(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|integer',
            'name'        => 'required|string',
            'email'       => 'nullable|email',
            'phone'       => 'nullable|string',
            'message'     => 'required|string',
        ]);

        // 1. Find Spot
        $spot = Spot::find($validated['facility_id']);
        if (!$spot) {
            return response()->json([
                'status' => false,
                'message' => 'Spot not found'
            ], 404);
        }

        // 2. Spot Owner
        $spotOwner = User::find($spot->user_id);

        // 3. Admin
        $admin = User::where('user_type', 2)->first();

        // -------------------------------
        // 4. SAVE DATA INTO LEADS TABLE
        // -------------------------------
        $lead = Lead::create([
            'facility_id'       => $spot->user_id,
            'place_id'          => $spot->id ?? null,
            'visitor_name'      => $validated['name'],
            'visitor_email'     => $validated['email'] ?? null,
            'visitor_phone'     => $validated['phone'] ?? null,
            'requested_care_type' =>$spot->care_level ?? null,
            'message'           => $validated['message']
        ]);
        // dd($spot->care_level);

        // -------------------------------
        // 5. EMAIL TO PFLEGEHEIM (OWNER)
        // -------------------------------
        if ($spotOwner && $spotOwner->email) {

            $ownerEmailBody =
                "New inquiry received via PflegeFinder\n\n" .
                "Place name:\n" .
                ($spot->name_of_the_place ?? 'N/A') . "\n\n" .

                "Visitor details:\n" .
                "Name: " . $validated['name'] . "\n" .
                "Email: " . ($validated['email'] ?? '-') . "\n" .
                "Phone: " . ($validated['phone'] ?? '-') . "\n\n" .

                "Requested care type:\n" .
                ($spot->care_level ?? '-') . "\n\n" .

                "Message:\n" .
                $validated['message'] . "\n\n" .

                "Date & Time:\n" .
                now() . "\n\n" .

                "----------------------\n" .
                "This inquiry was generated via PflegeFinder.";

            Mail::raw($ownerEmailBody, function ($mail) use ($spotOwner, $spot) {
                $mail->to($spotOwner->email)
                    ->subject("[PflegeFinder] New inquiry for your place: " . ($spot->name_of_the_place ?? ''));
            });
        }


        // -------------------------------
        // 6. EMAIL TO ADMIN (COPY)
        // -------------------------------
        if ($admin && $admin->email) {

            $adminEmailBody =
                "New inquiry received via PflegeFinder\n\n" .
                "Facility / Place:\n" .
                ($spot->name_of_the_place ?? 'N/A') . "\n\n" .

                "Visitor details:\n" .
                "Name: " . $validated['name'] . "\n" .
                "Email: " . ($validated['email'] ?? '-') . "\n" .
                "Phone: " . ($validated['phone'] ?? '-') . "\n\n" .

                "Requested care type:\n" .
                ($spot->care_level ?? '-') . "\n\n" .

                "Message:\n" .
                $validated['message'] . "\n\n" .

                "Date & Time:\n" .
                now() . "\n\n" .

                "----------------------\n" .
                "This inquiry was generated via PflegeFinder.";

            Mail::raw($adminEmailBody, function ($mail) use ($admin, $spot) {
                $mail->to($admin->email)
                    ->subject("[PflegeFinder] New inquiry for " . ($spot->name_of_the_place ?? ''));
            });
        }


        // -------------------------------
        // 7. RESPONSE
        // -------------------------------
        return response()->json([
            'status' => true,
            'message' => 'Inquiry saved and email sent successfully.',
            'lead_id' => $lead->id
        ]);
    }

    
}
