<?php

namespace App\Services;

use App\Models\InvestigationNote;
use App\Models\CrimeReport;
use App\Models\User;

class InvestigationNoteService
{
    /**
     * Add investigation note to case.
     */
    public function addNote(CrimeReport $report, User $user, string $note)
    {
        return InvestigationNote::create([
            'crime_report_id' => $report->id,
            'user_id' => $user->id,
            'note' => $note
        ]);
    }
}