<?php

namespace App\Policies;

use App\Models\CrimeReport;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CrimeReportPolicy
{
    use HandlesAuthorization;

    /**
     * Any authenticated user can view the list (scoped by role in controller).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Citizens can only see their own; police/admin can see all.
     */
    public function view(User $user, CrimeReport $report): bool
    {
        if ($user->isAdmin() || $user->isPolice()) {
            return true;
        }
        return $user->id === $report->user_id;
    }

    /**
     * Only citizens can create reports.
     */
    public function create(User $user): bool
    {
        return $user->isCitizen();
    }

    /**
     * Only the citizen who owns the report can update it (while pending).
     */
    public function update(User $user, CrimeReport $report): bool
    {
        return $user->id === $report->user_id && $report->status === CrimeReport::STATUS_PENDING;
    }

    /**
     * Only admins can delete.
     */
    public function delete(User $user, CrimeReport $report): bool
    {
        return $user->isAdmin();
    }

    /**
     * Police and admins can update the status.
     */
    public function updateStatus(User $user, CrimeReport $report): bool
    {
        return $user->isAdmin() || $user->isPolice();
    }
}
