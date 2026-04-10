<?php

namespace App\Http\Controllers;

use App\Services\CrimeReportService;
use App\Services\InvestigationNoteService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class InvestigatorController extends Controller
{
    public function __construct(
        private CrimeReportService $crimeReportService,
        private InvestigationNoteService $noteService,
        private NotificationService $notificationService
    ) {}

    /**
     * GET /api/investigator/cases - Investigator's assigned cases with filters/pagination.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $cases = $this->crimeReportService->getInvestigatorCases(
            $userId,
            $request->only(['status', 'priority', 'search']),
            $request->input('per_page', 15)
        );

        return response()->json($cases);
    }

    /**
     * GET /api/investigator/stats - Quick stats for dashboard.
     */
    public function stats(Request $request)
    {
        $userId = $request->user()->id;
        $stats = $this->crimeReportService->getInvestigatorStats($userId);

        return response()->json($stats);
    }

    /**
     * GET /api/investigator/cases/{id} - Full case details for investigator.
     */
    public function show(int $id, Request $request)
    {
        $case = $this->crimeReportService->findOrFail($id);

        // Ensure investigator has access
        $assignedOfficer = $case->assignedOfficer();
        if ($assignedOfficer && $assignedOfficer->id !== $request->user()->id && $case->status !== 'investigating') {
            abort(403, 'Unauthorized access to case');
        }

        $notes = $this->noteService->getNotesForReport($case);

        return response()->json([
            'case' => $case,
            'notes' => $notes,
        ]);
    }
}

