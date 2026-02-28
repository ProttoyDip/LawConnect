<?php

namespace App\Policies;

use App\Models\PoliceAssignment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssignmentPolicy
{
    use HandlesAuthorization;

    /**
     * Only admins can assign officers.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only admins can reassign or delete assignments.
     */
    public function delete(User $user, PoliceAssignment $assignment): bool
    {
        return $user->isAdmin();
    }
}
