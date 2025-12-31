<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;

    protected $table = 'notices';

    protected $fillable = [
        'notice_name',
        'days',
        'is_archived',
    ];

    protected $casts = [
        'days' => 'integer',
        'is_archived' => 'boolean',
    ];

    // Scope to get only non-archived notices
    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    // Scope to get only archived notices
    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }
}
