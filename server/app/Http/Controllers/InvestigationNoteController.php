<?php

namespace App\Http\Controllers;

use App\Services\InvestigationNoteService;
use App\Models\CrimeReport;
use App\Models\InvestigationNote;
use Illuminate\Http\Request;

class InvestigationNoteController extends Controller
{
    public function __construct(
        private InvestigationNoteService $noteService
    ) {}

    /**
     * POST /api/cases/{id}/notes - Add note to case (investigator only).
     */
    public function store(Request $request, CrimeReport $case)
    {
        $request->validate([
            'note' => 'required|string|max:10000'
        ]);

        $note = $this->noteService->addNote($case, $request->user(), $request->note);

        return response()->json($note, 201);
    }

    /**
     * GET /api/cases/{id}/notes - List notes for case.
     */
    public function index(CrimeReport $case)
    {
        $notes = $this->noteService->getNotesForReport($case);

        return response()->json($notes);
    }

    /**
     * PUT /api/notes/{id} - Update own note.
     */
    public function update(Request $request, InvestigationNote $note)
    {
        if ($note->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'note' => 'required|string|max:10000'
        ]);

        $note = $this->noteService->updateNote($note, $request->note);

        return response()->json($note);
    }

    /**
     * DELETE /api/notes/{id} - Delete own note.
     */
    public function destroy(InvestigationNote $note, Request $request)
    {
        if ($note->user_id !== $request->user()->id) {
            abort(403);
        }

        $deleted = $this->noteService->deleteNote($note, $request->user());

        if ($deleted) {
            return response()->json(['message' => 'Note deleted']);
        }

        abort(403, 'Cannot delete this note');
    }
}

