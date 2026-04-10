<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestigationNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'crime_report_id',
        'user_id',
        'note',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function crimeReport()
    {
        return $this->belongsTo(CrimeReport::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

