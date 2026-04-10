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

    /**
     * Override Notifiable trait's notifications() to use custom Notification model.
     * This uses user_id instead of notifiable_type/notifiable_id.
     */
    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class, 'user_id');
    }

    /**
     * Eager load role whenever user is retrieved.
     * This ensures role is loaded for API authenticated users.
     */
    protected $with = ['role'];

    /* ---- Role helpers ---- */

    public function isCitizen(): bool
    {
        return $this->role?->name === Role::CITIZEN;
    }

    public function isPolice(): bool
    {
        return $this->hasRole(Role::POLICE, Role::OFFICER, Role::INVESTIGATOR);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(Role::ADMIN, Role::SUPER_ADMIN);
    }

    public function hasRole(string ...$roles): bool
    {
        $currentRole = $this->role?->name;

        if (!$currentRole) {
            return false;
        }

        $aliases = [
            Role::ADMIN => [Role::ADMIN, Role::SUPER_ADMIN],
            Role::SUPER_ADMIN => [Role::SUPER_ADMIN, Role::ADMIN],
            Role::POLICE => [Role::POLICE, Role::OFFICER, Role::INVESTIGATOR],
            Role::OFFICER => [Role::OFFICER, Role::POLICE, Role::INVESTIGATOR],
            Role::INVESTIGATOR => [Role::INVESTIGATOR, Role::POLICE, Role::OFFICER],
        ];

        foreach ($roles as $role) {
            $acceptedRoles = $aliases[$role] ?? [$role];

            if (in_array($currentRole, $acceptedRoles, true)) {
                return true;
            }
        }

        return false;
    }
}
