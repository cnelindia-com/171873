<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'facility_id',
        'place_id',
        'name',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'requested_care_type',
        'message',
        'status',
        'created_at', // ✅ add this
    ];

    public $timestamps = true;
}
