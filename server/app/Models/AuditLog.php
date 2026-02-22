<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    const UPDATED_AT = null; // audit logs are immutable

    protected $fillable = [
        'actor_id',
        'action',
        'target_type',
        'target_id',
        'meta',
        'ip_address',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ---- Relationships ---- */

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
