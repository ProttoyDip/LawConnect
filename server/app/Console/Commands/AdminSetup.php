<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminSetup extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:setup 
                            {--email= : Admin email address}
                            {--password= : Admin password}
                            {--name= : Admin display name}';

    /**
     * The console command description.
     */
    protected $description = 'Setup the system administrator account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->displayBanner();

        // Get or prompt for credentials
        $email = $this->option('email') ?: $this->promptEmail();
        $password = $this->option('password') ?: $this->promptPassword();
        $name = $this->option('name') ?: $this->promptName();

        // Validate credentials
        $validator = Validator::make([
            'email' => $email,
            'password' => $password,
            'name' => $name,
        ], [
            'email' => 'required|email',
            'password' => 'required|min:8',
            'name' => 'required|min:2',
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return self::FAILURE;
        }

        // Create/update admin role
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['name' => 'admin']
        );

        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Update .env file with credentials
        $this->updateEnvFile($email, $password);

        $this->newLine();
        $this->info('✓ Admin account created successfully!');
        $this->newLine();
        
        $this->table(
            ['Setting', 'Value'],
            [
                ['Email', $email],
                ['Password', '********'],
                ['Name', $name],
            ]
        );

        $this->newLine();
        $this->warn('⚠️  Remember these credentials!');
        $this->warn('⚠️  Update .env file with secure credentials for production!');

        return self::SUCCESS;
    }

    /**
     * Display the banner.
     */
    private function displayBanner(): void
    {
        $this->newLine();
        $this->info('╔═══════════════════════════════════════════════════════╗');
        $this->info('║          LawConnect Admin Account Setup               ║');
        $this->info('╚═══════════════════════════════════════════════════════╝');
        $this->newLine();
    }

    /**
     * Prompt for email.
     */
    private function promptEmail(): string
    {
        return $this->ask(
            'Enter admin email',
            'admin@lawconnect.gov'
        );
    }

    /**
     * Prompt for password.
     */
    private function promptPassword(): string
    {
        do {
            $password = $this->secret('Enter admin password (min 8 characters)');
            
            if (strlen($password) < 8) {
                $this->error('Password must be at least 8 characters long!');
            }
        } while (strlen($password) < 8);

        return $password;
    }

    /**
     * Prompt for name.
     */
    private function promptName(): string
    {
        return $this->ask(
            'Enter admin display name',
            'System Administrator'
        );
    }

    /**
     * Update .env file with admin credentials.
     */
    private function updateEnvFile(string $email, string $password): void
    {
        $envPath = base_path('.env');
        
        if (!file_exists($envPath)) {
            $this->warn('Warning: .env file not found. Skipping auto-update.');
            return;
        }

        $envContent = file_get_contents($envPath);

        // Update or add ADMIN_EMAIL
        if (strpos($envContent, 'ADMIN_EMAIL=') !== false) {
            $envContent = preg_replace(
                '/ADMIN_EMAIL=.*/',
                "ADMIN_EMAIL={$email}",
                $envContent
            );
        } else {
            $envContent .= "\nADMIN_EMAIL={$email}";
        }

        // Update or add ADMIN_PASSWORD
        if (strpos($envContent, 'ADMIN_PASSWORD=') !== false) {
            $envContent = preg_replace(
                '/ADMIN_PASSWORD=.*/',
                "ADMIN_PASSWORD={$password}",
                $envContent
            );
        } else {
            $envContent .= "\nADMIN_PASSWORD={$password}";
        }

        file_put_contents($envPath, $envContent);
        $this->info('✓ .env file updated with admin credentials');
    }
}
