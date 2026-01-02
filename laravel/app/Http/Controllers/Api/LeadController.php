<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Carbon\Carbon;


class LeadController extends Controller
{
   

public function index(Request $request)
{

    $query = Lead::query();
    if ($request->usertype != 2) {
        $query->whereIn('place_id', function ($q) use ($request) {
            $q->select('id')
              ->from('spots')
              ->where('user_id', $request->user_id);
        });
    }

    $total = $query->count();

    $monthly = (clone $query)
        ->whereMonth('created_at', Carbon::now()->month)
        ->whereYear('created_at', Carbon::now()->year)
        ->count();

    $lastInquiry = (clone $query)->max('created_at');

    $recent = (clone $query)
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($lead) {
            return [
                'id' => $lead->id,
                'date' => optional($lead->created_at)->format('d-m-Y') ?? '-',
                'contact_name' => $lead->visitor_name,
                'care_type' => $lead->requested_care_type,
                'message' => $lead->message,
                'status' => $lead->status ?? 'new',
                'place_id' => $lead->place_id,
                'facility_id' => $lead->facility_id,
            ];
        });

    return response()->json([
        'total' => $total,
        'monthly' => $monthly,
        'last_inquiry_date' => $lastInquiry
            ? Carbon::parse($lastInquiry)->format('d-m-Y')
            : '-',
        'recent' => $recent
    ]);
}


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,draft,active'
        ]);

        $lead = Lead::findOrFail($id);
        $lead->status = $request->status;
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully'
        ]);
    }
}
