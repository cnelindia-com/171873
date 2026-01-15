<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Spot;
use App\Models\User;
use App\Models\Lead;
use App\Models\AuditLog;

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

        $spot = Spot::find($validated['facility_id']);
        if (!$spot) {
            return response()->json([
                'status' => false,
                'message' => 'Spot not found'
            ], 404);
        }

        $spotOwner = User::find($spot->user_id);
        $admin = User::where('user_type', 2)->first();

        // Save lead first
        $lead = Lead::create([
            'facility_id'       => $spot->user_id,
            'place_id'          => $spot->id ?? null,
            'visitor_name'      => $validated['name'],
            'visitor_email'     => $validated['email'] ?? null,
            'visitor_phone'     => $validated['phone'] ?? null,
            'requested_care_type' =>$spot->care_level ?? null,
            'message'           => $validated['message']
        ]);

        $emailsSent = [];

        // Send email to owner
        if ($spotOwner && $spotOwner->email) {
            try {
                $ownerEmailBody =
                    "New inquiry received via PflegeFinder\n\n" .
                    "Place name: " . ($spot->name_of_the_place ?? 'N/A') . "\n" .
                    "Visitor: " . $validated['name'] . "\n" .
                    "Email: " . ($validated['email'] ?? '-') . "\n" .
                    "Phone: " . ($validated['phone'] ?? '-') . "\n" .
                    "Message: " . $validated['message'] . "\n" .
                    "Date & Time: " . now();

                Mail::raw($ownerEmailBody, function ($mail) use ($spotOwner, $spot) {
                    $mail->to($spotOwner->email)
                        ->subject("[PflegeFinder] New inquiry for your place: " . ($spot->name_of_the_place ?? ''));
                });

                $emailsSent[] = 'owner';
            } catch (\Exception $e) {
                // log or ignore
            }
        }

        // Send email to admin
        if ($admin && $admin->email) {
            try {
                $adminEmailBody =
                    "New inquiry received via PflegeFinder\n\n" .
                    "Facility / Place: " . ($spot->name_of_the_place ?? 'N/A') . "\n" .
                    "Visitor: " . $validated['name'] . "\n" .
                    "Email: " . ($validated['email'] ?? '-') . "\n" .
                    "Phone: " . ($validated['phone'] ?? '-') . "\n" .
                    "Message: " . $validated['message'] . "\n" .
                    "Date & Time: " . now();

                Mail::raw($adminEmailBody, function ($mail) use ($admin, $spot) {
                    $mail->to($admin->email)
                        ->subject("[PflegeFinder] New inquiry for " . ($spot->name_of_the_place ?? ''));
                });

                $emailsSent[] = 'admin';
            } catch (\Exception $e) {
                // log or ignore
            }
        }

        // ✅ Audit log AFTER emails sent
        if (!empty($emailsSent)) {
            AuditLog::create([
                'user_id'      => $spot->user_id, // visitor is not a logged-in user
                'action_type'  => 'CREATE_INQUIRY',
                'reference_id' => $lead->id,
                'meta'         => [
                    'facility_id' => $spot->id,
                    'facility_owner_id' => $spot->user_id,
                    'visitor_name' => $validated['name'],
                    'visitor_email' => $validated['email'] ?? null,
                    'visitor_phone' => $validated['phone'] ?? null,
                    'message' => $validated['message'],
                    'emails_sent_to' => $emailsSent, // track who got the email
                ]
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Inquiry saved and email sent successfully.',
            'lead_id' => $lead->id,
            'emails_sent_to' => $emailsSent
        ]);
    }


    
}
