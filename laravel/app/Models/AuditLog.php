<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'user_id',
        'action_type',
        'reference_id',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array', // automatically cast JSON to array
    ];

    // Optional: relation to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
