<?php

namespace App\Policies;

use App\Models\EvidenceFile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EvidencePolicy
{
    use HandlesAuthorization;

    /**
     * The uploader, assigned police, or admin can view evidence.
     */
    public function view(User $user, EvidenceFile $evidence): bool
    {
        if ($user->isAdmin() || $user->isPolice()) {
            return true;
        }
        return $user->id === $evidence->uploaded_by;
    }

    /**
     * Citizen (report owner) or police can upload evidence.
     */
    public function create(User $user): bool
    {
        return $user->isCitizen() || $user->isPolice();
    }

    /**
     * Only admin can delete evidence.
     */
    public function delete(User $user, EvidenceFile $evidence): bool
    {
        return $user->isAdmin();
    }
}
