<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\CrimeReport;
use App\Models\EvidenceFile;
use App\Models\PoliceAssignment;
use App\Policies\CrimeReportPolicy;
use App\Policies\EvidencePolicy;
use App\Policies\AssignmentPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        CrimeReport::class      => CrimeReportPolicy::class,
        EvidenceFile::class     => EvidencePolicy::class,
        PoliceAssignment::class => AssignmentPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        //
    }
}
