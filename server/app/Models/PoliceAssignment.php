<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoliceAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'crime_report_id',
        'officer_id',
        'assigned_by',
        'notes',
        'assigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    /* ---- Relationships ---- */

    public function crimeReport()
    {
        return $this->belongsTo(CrimeReport::class);
    }

    public function officer()
    {
        return $this->belongsTo(User::class, 'officer_id');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
