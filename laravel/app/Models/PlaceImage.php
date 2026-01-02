<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceImage extends Model
{
    use HasFactory;

    protected $table = 'place_images';

    protected $fillable = [
        'place_id',
        'file_url',
        'storage_path',
        'alt_text',
        'order_index',
    ];

    // Relationships
    public function place()
    {
        return $this->belongsTo(Place::class, 'place_id');
    }
}
