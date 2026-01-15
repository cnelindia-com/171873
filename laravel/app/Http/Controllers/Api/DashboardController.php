<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;
use App\Models\User;

class DashboardController extends Controller
{
    public function overview(Request $request)
    {
        $userId   = $request->user()->id;
        $userType = $request->user()->user_type; // 1 = user, 2 = admin

        // ===== Admin =====
        if ($userType == 2) {
            $totalSpots = DB::table('spots')
                ->where('status', 'active')
                ->count();

            $totalInquiries = DB::table('leads')->count();

            $monthlyInquiries = DB::table('leads')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();
        }

        // ===== Normal User =====
        else {
            $totalSpots = DB::table('spots')
                ->where('user_id', $userId)
                ->where('status', 'active')
                ->count();

            $totalInquiries = DB::table('leads')
                ->where('facility_id', $userId)
                ->count();

            $monthlyInquiries = DB::table('leads')
                ->where('facility_id', $userId)
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();
        }

        return response()->json([
            'total_spots'       => $totalSpots,
            'total_inquiries'   => $totalInquiries,
            'monthly_inquiries' => $monthlyInquiries,
        ]);
    }
    public function count(Request $request)
    {
            $totalSpots = DB::table('spots')
                ->where('status', 'active')
                ->count();

            $totalInquiries = DB::table('leads')->count();

            $monthlyInquiries = DB::table('leads')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();
            // ===== TOTAL REGISTERED USERS (NON-ADMIN) =====
            $totalUsers = User::where('user_type', '!=', 2)->count();
        return response()->json([
            'total_spots'       => $totalSpots,
            'total_inquiries'   => $totalInquiries,
            'monthly_inquiries' => $monthlyInquiries,
            'total_users'       => $totalUsers, // ✅ New field
        ]);
    }
}
