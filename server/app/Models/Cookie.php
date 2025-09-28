<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cookie extends Model
{
    protected $fillable = [
        'domain',
        'name',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];
}
