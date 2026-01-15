<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use App\Models\AuditLog;


class DeleteSpotController extends Controller
{
    public function deleteSpot(Request $request, $id)
    {
        
        $spot = Spot::find($id);

        if (!$spot) {
            return response()->json([
                'status' => false,
                'message' => 'Spot not found!'
            ], 404);
        }

        // ------------------------------
        // 🔍 AUDIT LOG: SPOT DELETE
        // ------------------------------
        AuditLog::create([
            'user_id'      => $request->user()->id,  // who performed the deletion
            'action_type'  => 'DELETE_SPOT',         // action type
            'reference_id' => $spot->id,             // spot id being deleted
            'meta'         => [
                'name_of_the_place' => $spot->name_of_the_place,
                'user_id'           => $spot->user_id,
                'status'            => $spot->status,
                'priority_score'    => $spot->priority_score,
                'plan_level_cached' => $spot->plan_level_cached,
                'is_featured'       => $spot->is_featured,
            ]
        ]);


        // ✅ Step 3: Delete the record
        $spot->delete();

        // ✅ Step 4: Response return करें
        return response()->json([
            'status' => true,
            'message' => 'Spot deleted successfully!'
        ], 200);
    }
}
