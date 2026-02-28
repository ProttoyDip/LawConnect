<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvidenceFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'crime_report_id',
        'file_path',
        'file_type',
        'original_name',
        'file_size',
        'uploaded_by',
    ];

    const TYPES = ['image', 'document', 'video', 'other'];

    /* ---- Relationships ---- */

    public function crimeReport()
    {
        return $this->belongsTo(CrimeReport::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
