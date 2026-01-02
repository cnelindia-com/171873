<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

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

        
        // if ($request->user()->user_type != 2) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Access denied! Only admin can delete spots.'
        //     ], 403);
        // }

        // ✅ Step 3: Delete the record
        $spot->delete();

        // ✅ Step 4: Response return करें
        return response()->json([
            'status' => true,
            'message' => 'Spot deleted successfully!'
        ], 200);
    }
}
