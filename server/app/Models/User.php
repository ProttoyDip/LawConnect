<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'national_id',
        'badge_number',
        'police_station',
        'password',
        'role_id',
        'phone',
        'address',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /* ---- Relationships ---- */

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function crimeReports()
    {
        return $this->hasMany(CrimeReport::class);
    }

    public function policeAssignments()
    {
        return $this->hasMany(PoliceAssignment::class, 'officer_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    /* ---- Role helpers ---- */

    public function isCitizen(): bool
    {
        return $this->role?->name === Role::CITIZEN;
    }

    public function isPolice(): bool
    {
        return $this->role?->name === Role::POLICE;
    }

    public function isAdmin(): bool
    {
        return $this->role?->name === Role::ADMIN;
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role?->name, $roles, true);
    }
}
