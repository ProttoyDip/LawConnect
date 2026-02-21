<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStatusUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'crime_report_id',
        'status',
        'remark',
        'created_by',
    ];

    /* ---- Relationships ---- */

    public function crimeReport()
    {
        return $this->belongsTo(CrimeReport::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
