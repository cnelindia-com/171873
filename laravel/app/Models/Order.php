<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_subscription_id',
        'stripe_customer_id',
        'plan_name',
        'amount',
        'currency',
        'status',
        'event_type',
        'invoice_id',
        'billing_cycle_start',
        'billing_cycle_end',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'billing_cycle_start' => 'datetime',
        'billing_cycle_end' => 'datetime',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}