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
    public function addNote(CrimeReport $report, User $user, string $note): InvestigationNote
    {
        return InvestigationNote::create([
            'crime_report_id' => $report->id,
            'user_id' => $user->id,
            'note' => $note
        ]);
    }

    /**
     * Get notes for a report.
     */
    public function getNotesForReport(CrimeReport $report): \Illuminate\Database\Eloquent\Collection
    {
        return $report->investigationNotes()->with('user')->latest()->get();
    }

    /**
     * Update a note.
     */
    public function updateNote(InvestigationNote $note, string $newNote): InvestigationNote
    {
        $note->update(['note' => $newNote]);
        return $note->fresh();
    }

    /**
     * Delete a note (only own notes).
     */
    public function deleteNote(InvestigationNote $note, User $user): bool
    {
        if ($note->user_id === $user->id) {
            return $note->delete();
        }
        return false;
    }
}
