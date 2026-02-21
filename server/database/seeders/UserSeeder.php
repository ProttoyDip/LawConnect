<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $password = Hash::make('password');

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@lawconnect.com'],
            [
                'name'              => 'Admin User',
                'password'          => $password,
                'role_id'           => Role::where('name', Role::ADMIN)->first()->id,
                'email_verified_at' => now(),
            ]
        );

        // Police Officer
        User::firstOrCreate(
            ['email' => 'officer@lawconnect.com'],
            [
                'name'              => 'Officer Khan',
                'password'          => $password,
                'role_id'           => Role::where('name', Role::POLICE)->first()->id,
                'email_verified_at' => now(),
            ]
        );

        // Citizen
        User::firstOrCreate(
            ['email' => 'citizen@lawconnect.com'],
            [
                'name'              => 'Jane Citizen',
                'password'          => $password,
                'role_id'           => Role::where('name', Role::CITIZEN)->first()->id,
                'email_verified_at' => now(),
            ]
        );
    }
}
