<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        foreach ([Role::CITIZEN, Role::POLICE, Role::ADMIN, Role::SUPER_ADMIN] as $name) {
            Role::firstOrCreate(['name' => $name]);
        }
    }
}
