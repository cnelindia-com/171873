<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Carbon\Carbon;

class LeadController extends Controller
{
    // public function index(Request $request)
    // {
    //     $perPage  = $request->get('per_page', 10);
    //     $usertype = (int) $request->usertype;

    //     $query = Lead::query();

    //     // ✅ Non-admin → only own spots
    //     if ($usertype !== 2) {
    //         $query->whereIn('place_id', function ($q) use ($request) {
    //             $q->select('id')
    //               ->from('spots')
    //               ->where('user_id', $request->user_id);
    //         });
    //     }

    //     // KPIs
    //     $total = (clone $query)->count();

    //     $monthly = (clone $query)
    //         ->whereMonth('created_at', now()->month)
    //         ->whereYear('created_at', now()->year)
    //         ->count();

    //     $lastInquiry = (clone $query)->max('created_at');

    //     // ✅ Pagination (ONLY ONCE)
    //     $leads = $query
    //         ->orderBy('created_at', 'desc')
    //         ->paginate($perPage);

    //     $leads->getCollection()->transform(function ($lead) {
    //         return [
    //             'id' => $lead->id,
    //             'date' => optional($lead->created_at)->format('d-m-Y') ?? '-',
    //             'contact_name' => $lead->visitor_name,
    //             'contact_email' => $lead->visitor_email,
    //             'care_type' => $lead->requested_care_type,
    //             'message' => $lead->message,
    //             'status' => $lead->status ?? 'new',
    //         ];
    //     });

    //     return response()->json([
    //         'total' => $total,
    //         'monthly' => $monthly,
    //         'last_inquiry_date' => $lastInquiry
    //             ? Carbon::parse($lastInquiry)->format('d-m-Y')
    //             : '-',

    //         'data' => $leads->items(),
    //         'current_page' => $leads->currentPage(),
    //         'last_page' => $leads->lastPage(),
    //     ]);
    // }
    public function index(Request $request)
{
    $perPage  = $request->get('per_page', 10);
    $usertype = (int) $request->usertype;

    $query = Lead::query();

    // Non-admin → only own spots
    if ($usertype !== 2) {
        $query->whereIn('place_id', function ($q) use ($request) {
            $q->select('id')
              ->from('spots')
              ->where('user_id', $request->user_id);
        });
    }

    // KPIs
    $total = (clone $query)->count();

    $monthly = (clone $query)
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->count();

    // ✅ Fetch the last inquiry as full object
    $lastInquiry = (clone $query)->orderBy('created_at', 'desc')->first();

    // Pagination
    $leads = $query->orderBy('created_at', 'desc')->paginate($perPage);

    $leads->getCollection()->transform(function ($lead) {
        return [
            'id' => $lead->id,
            'date' => optional($lead->created_at)->format('d-m-Y') ?? '-',
            'contact_name' => $lead->visitor_name,
            'contact_email' => $lead->visitor_email,
            'care_type' => $lead->requested_care_type,
            'message' => $lead->message,
            'status' => $lead->status ?? 'new',
            'care_center_name' => optional($lead->place)->name ?? '-', // if you have relationship with Place
        ];
    });

    return response()->json([
        'total' => $total,
        'monthly' => $monthly,
        'last_inquiry' => $lastInquiry ? [
            'id' => $lastInquiry->id,
            'date' => optional($lastInquiry->created_at)->format('d-m-Y') ?? '-',
            'contact_name' => $lastInquiry->visitor_name,
            'contact_email' => $lastInquiry->visitor_email,
            'care_type' => $lastInquiry->requested_care_type,
            'message' => $lastInquiry->message,
            'status' => $lastInquiry->status ?? 'new',
            'care_center_name' => optional($lastInquiry->place)->name ?? '-',
        ] : null,
        'data' => $leads->items(),
        'current_page' => $leads->currentPage(),
        'last_page' => $leads->lastPage(),
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
