<?php

namespace Database\Seeders;

use App\Models\CrimeReport;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class CrimeReportSeeder extends Seeder
{
    public function run()
    {
        $citizen = User::whereHas('role', fn ($q) => $q->where('name', Role::CITIZEN))->first();

        if (!$citizen) return;

        $samples = [
            [
                'title'       => 'Stolen bicycle from front yard',
                'description' => 'My bicycle was stolen sometime between 10 PM and 6 AM from my front yard.',
                'category'    => 'theft',
                'location'    => '123 Maple Street',
                'occurred_at' => now()->subDays(2),
                'priority'    => 'medium',
            ],
            [
                'title'       => 'Vandalism at local park',
                'description' => 'Graffiti and broken benches found at Central Park playground area.',
                'category'    => 'vandalism',
                'location'    => 'Central Park, East Entrance',
                'occurred_at' => now()->subDay(),
                'priority'    => 'low',
            ],
            [
                'title'       => 'Online fraud – phishing email',
                'description' => 'Received a phishing email impersonating my bank. Clicked the link and personal data may be compromised.',
                'category'    => 'cyber',
                'location'    => 'N/A (online)',
                'occurred_at' => now()->subHours(6),
                'priority'    => 'high',
            ],
        ];

        foreach ($samples as $data) {
            CrimeReport::firstOrCreate(
                ['title' => $data['title']],
                array_merge($data, [
                    'user_id' => $citizen->id,
                    'status'  => CrimeReport::STATUS_PENDING,
                ])
            );
        }
    }
}
