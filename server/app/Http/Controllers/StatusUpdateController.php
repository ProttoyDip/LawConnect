<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusUpdateRequest;
use App\Models\CrimeReport;
use App\Services\StatusService;
use Illuminate\Http\JsonResponse;

class StatusUpdateController extends Controller
{
    public function __construct(private StatusService $statusService) {}

    /**
     * PUT /crime-report/{id}/status  – police/admin update case status
     */
    public function update(StatusUpdateRequest $request, int $id): JsonResponse
    {
        $report = CrimeReport::findOrFail($id);
        $this->authorize('updateStatus', $report);

        $statusUpdate = $this->statusService->updateStatus(
            $report->id,
            $request->status,
            $request->user(),
            $request->remark,
        );

        return response()->json([
            'message' => 'Status updated.',
            'update'  => $statusUpdate,
        ]);
    }

    /**
     * GET /crime-report/{id}/timeline  – case status history
     */
    public function timeline(int $id): JsonResponse
    {
        return response()->json($this->statusService->timeline($id));
    }
}
