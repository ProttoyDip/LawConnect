<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Creates the fixed admin user from environment variables.
     * Run with: php artisan db:seed --class=AdminSeeder
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@lawconnect.gov');
        $adminPassword = env('ADMIN_PASSWORD', 'admin123');

        // Ensure super admin role exists
        $adminRole = Role::firstOrCreate(
            ['name' => Role::SUPER_ADMIN],
            ['name' => Role::SUPER_ADMIN]
        );

        // Create or update fixed super admin user
        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make($adminPassword),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Super admin user created/updated successfully!');
        $this->command->info("Email: {$adminEmail}");
        $this->command->info("Password: {$adminPassword}");
        $this->command->warn('Please change these credentials in production!');
    }
}
