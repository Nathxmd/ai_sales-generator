<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesPage extends Model
{
    protected $fillable = [
        'user_id',
        'product_name',
        'description',
        'features',
        'target_audience',
        'price',
        'usp',
        'generated_content',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
        'generated_content' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
