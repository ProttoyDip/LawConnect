<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /* ---- Constants ---- */
    const CITIZEN = 'citizen';
    const POLICE  = 'police';
    const INVESTIGATOR = 'investigator';
    const OFFICER = 'officer';
    const ADMIN   = 'admin';
    const SUPER_ADMIN = 'super_admin';

    /* ---- Relationships ---- */

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
