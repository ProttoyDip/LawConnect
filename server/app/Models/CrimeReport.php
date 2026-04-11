<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CrimeReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'user_id',
        'title',
        'description',
        'category',
        'location',
        'occurred_at',
        'status',
        'priority',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    /* ---- Status constants ---- */
    const STATUS_PENDING       = 'pending';
    const STATUS_UNDER_REVIEW  = 'under_review';
    const STATUS_INVESTIGATING = 'investigating';
    const STATUS_RESOLVED      = 'resolved';
    const STATUS_CLOSED        = 'closed';

    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_UNDER_REVIEW,
        self::STATUS_INVESTIGATING,
        self::STATUS_RESOLVED,
        self::STATUS_CLOSED,
    ];

    /* ---- Priority constants ---- */
    const PRIORITY_LOW      = 'low';
    const PRIORITY_MEDIUM   = 'medium';
    const PRIORITY_HIGH     = 'high';
    const PRIORITY_CRITICAL = 'critical';

    const PRIORITIES = [
        self::PRIORITY_LOW,
        self::PRIORITY_MEDIUM,
        self::PRIORITY_HIGH,
        self::PRIORITY_CRITICAL,
    ];

    /* ---- Category constants ---- */
    const CATEGORIES = ['theft', 'assault', 'fraud', 'vandalism', 'cyber', 'other'];

    /* ---- Boot: auto-generate case_id ---- */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($report) {
            if (empty($report->case_id)) {
                $report->case_id = (string) Str::uuid();
            }
        });
    }

    /* ---- Relationships ---- */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function evidenceFiles()
    {
        return $this->hasMany(EvidenceFile::class);
    }

    public function policeAssignments()
    {
        return $this->hasMany(PoliceAssignment::class);
    }

    public function statusUpdates()
    {
        return $this->hasMany(CaseStatusUpdate::class);
    }

    public function investigationNotes()
    {
        return $this->hasMany(InvestigationNote::class);
    }

    /* ---- Helpers ---- */

    public function assignedOfficer()
    {
        return $this->policeAssignments()->latest('assigned_at')->first()?->officer;
    }
}

