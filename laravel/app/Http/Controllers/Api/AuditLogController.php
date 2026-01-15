<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        $logs = AuditLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($logs);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function destroy($id)
    {
        $log = AuditLog::findOrFail($id);
        $log->delete();

        return response()->json([
            'message' => 'Audit log deleted successfully'
        ]);
    }
}
