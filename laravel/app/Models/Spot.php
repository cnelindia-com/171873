<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_of_the_place',
        'room_type',
        'care_level',
        'availability',
        // 'available_from',
        // 'available_spots',
        'address_street',
        'price_per_month',
        'user_id',
        'latitude',
        'longitude',
        'description',
        'desc',
        'postal_code',
        'city',
        'priority_score',
        'plan_level_cached',
        'is_featured',   // ✅ ADD THIS
        'status'
    ];
     // ✅ JSON cast (VERY IMPORTANT)
    protected $casts = [
        'desc' => 'array',
    ];

    // ❌ Disable timestamps (created_at & updated_at)
    public $timestamps = true;

    // ✅ Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
