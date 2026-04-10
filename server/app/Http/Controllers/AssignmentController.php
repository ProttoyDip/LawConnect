<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignmentRequest;
use App\Services\AssignmentService;
use Illuminate\Http\JsonResponse;

class AssignmentController extends Controller
{
    public function __construct(private AssignmentService $assignmentService) {}

    /**
     * POST /assign-police  – admin assigns a police officer to a case
     */
    public function store(AssignmentRequest $request): JsonResponse
    {
        try {
            $assignment = $this->assignmentService->assign(
                $request->crime_report_id,
                $request->officer_id,
                $request->user(),
                $request->notes,
            );

            return response()->json([
                'message'    => 'Officer assigned successfully.',
                'assignment' => $assignment->load('officer', 'crimeReport'),
            ], $assignment->wasRecentlyCreated ? 201 : 200);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /officers  – list available police officers
     */
    public function officers(): JsonResponse
    {
        return response()->json($this->assignmentService->getAvailableOfficers());
    }
}
