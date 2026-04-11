<?php

namespace App\Http\Controllers;

use App\Http\Resources\EvidenceFileResource;
use App\Models\CrimeReport;
use App\Models\EvidenceFile;
use App\Services\EvidenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EvidenceController extends Controller
{
	public function __construct(private EvidenceService $evidenceService) {}

	/**
	 * POST /crime-report/{id}/evidence - upload evidence to an existing report
	 */
	public function store(Request $request, int $id): JsonResponse
	{
		$request->validate([
			'files' => ['required', 'array', 'max:5'],
			'files.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi'],
		]);

		$report = CrimeReport::findOrFail($id);

		$files = $this->evidenceService->storeFiles($report, $request->file('files'), $request->user());

		return response()->json([
			'message' => count($files) . ' file(s) uploaded.',
			'evidence' => EvidenceFileResource::collection($files),
		], 201);
	}

	/**
	 * GET /evidence/{id}/download - authenticated evidence download
	 */
	public function download(Request $request, int $id)
	{
		$evidence = EvidenceFile::with('crimeReport')->findOrFail($id);
		$user = $request->user();

		if (!$user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$report = $evidence->crimeReport;
		$canAccess = false;

		if ($user->isAdmin()) {
			$canAccess = true;
		} elseif ($user->isPolice()) {
			$isAssigned = $report->policeAssignments()
				->where('officer_id', $user->id)
				->exists();
			$canAccess = $isAssigned || $report->status === 'investigating';
		} elseif ($user->isCitizen()) {
			$canAccess = (int) $report->user_id === (int) $user->id;
		}

		if (!$canAccess) {
			return response()->json(['message' => 'Forbidden.'], 403);
		}

		if (!Storage::disk('public')->exists($evidence->file_path)) {
			return response()->json(['message' => 'Evidence file not found.'], 404);
		}

		return Storage::disk('public')->download(
			$evidence->file_path,
			$evidence->original_name ?? basename($evidence->file_path)
		);
	}

	/**
	 * DELETE /evidence/{id} - admin removes evidence
	 */
	public function destroy(int $id): JsonResponse
	{
		$evidence = EvidenceFile::findOrFail($id);
		$this->authorize('delete', $evidence);

		$this->evidenceService->delete($evidence);

		return response()->json(['message' => 'Evidence deleted.']);
	}
}
