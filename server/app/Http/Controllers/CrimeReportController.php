<?php

namespace App\Http\Controllers;

use App\Http\Requests\CrimeReportStoreRequest;
use App\Http\Requests\CrimeReportUpdateRequest;
use App\Http\Resources\CrimeReportResource;
use App\Models\CrimeReport;
use App\Models\User;
use App\Services\CrimeReportService;
use App\Services\EvidenceService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrimeReportController extends Controller
{
	public function __construct(
		private CrimeReportService $reportService,
		private EvidenceService $evidenceService,
		private NotificationService $notificationService,
	) {}

	/**
	 * POST /crime-report - citizen creates a report
	 */
	public function store(CrimeReportStoreRequest $request): JsonResponse
	{
		$report = $this->reportService->create($request->user(), $request->validated());

		// Handle evidence uploads if provided
		if ($request->hasFile('evidence')) {
			$this->evidenceService->storeFiles($report, $request->file('evidence'), $request->user());
		}

		// Notify admins about new crime report
		$this->notifyAdmins(
			'New Crime Report',
			"A new {$report->priority} priority report '{$report->title}' has been submitted.",
			'new_report',
			$report->id
		);

		return response()->json([
			'message' => 'Crime report submitted successfully.',
			'report' => new CrimeReportResource($report->load('evidenceFiles')),
		], 201);
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

	/**
	 * GET /crime-report/{id} - view a single report
	 */
	public function show(int $id): JsonResponse
	{
		$report = $this->reportService->findOrFail($id);

		return response()->json(new CrimeReportResource($report));
	}

		/**
	 * GET /my-reports - citizen's own reports (guest → empty)
	 */
	public function myReports(Request $request): JsonResponse
	{
		$user = $request->user();
		if (!$user) {
			return response()->json([], 200);
		}

		$reports = $this->reportService->getForCitizen($user);

		return response()->json(CrimeReportResource::collection($reports));
	}

	/**
	 * GET /crime-reports - all reports (police/admin)
	 */
	public function index(Request $request): JsonResponse
	{
		$filters = $request->only(['status', 'category', 'priority', 'search']);
		$reports = $this->reportService->getAll($filters);

		return response()->json(CrimeReportResource::collection($reports));
	}

	/**
	 * PUT /crime-report/{id} - citizen updates own pending report
	 */
	public function update(CrimeReportUpdateRequest $request, int $id): JsonResponse
	{
		$report = CrimeReport::findOrFail($id);
		$this->authorize('update', $report);

		$updated = $this->reportService->update($report, $request->validated());

		return response()->json([
			'message' => 'Report updated.',
			'report' => new CrimeReportResource($updated),
		]);
	}

	/**
	 * DELETE /crime-report/{id} - admin only
	 */
	public function destroy(int $id): JsonResponse
	{
		$report = CrimeReport::findOrFail($id);
		$this->authorize('delete', $report);

		$report->delete();

		return response()->json(['message' => 'Report deleted.']);
	}
}
