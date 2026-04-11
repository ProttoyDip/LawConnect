<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusUpdateRequest;
use App\Models\CrimeReport;
use App\Models\User;
use App\Services\NotificationService;
use App\Services\StatusService;
use Illuminate\Http\JsonResponse;

class StatusUpdateController extends Controller
{
    public function __construct(
        private StatusService $statusService,
        private NotificationService $notificationService
    ) {}

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

        // Notify admins about case status update
        $this->notifyAdmins(
            'Case Status Updated',
            "Case '{$report->title}' has been updated to '{$request->status}'.",
            'case_update',
            $report->id
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

    /**
     * Notify all admins about an event
     */
    private function notifyAdmins(string $title, string $message, string $type, ?int $relatedId = null): void
    {
        $admins = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            $this->notificationService->create(
                $admin->id,
                $title,
                $message,
                $type,
                $relatedId
            );
        }
    }
}
