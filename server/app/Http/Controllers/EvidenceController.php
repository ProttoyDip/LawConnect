<?php

namespace App\Http\Controllers;

use App\Models\CrimeReport;
use App\Models\EvidenceFile;
use App\Services\EvidenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvidenceController extends Controller
{
    public function __construct(private EvidenceService $evidenceService) {}

    /**
     * POST /crime-report/{id}/evidence  – upload evidence to an existing report
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'files'   => ['required', 'array', 'max:5'],
            'files.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi'],
        ]);

        $report = CrimeReport::findOrFail($id);

        $files = $this->evidenceService->storeFiles($report, $request->file('files'), $request->user());

        return response()->json([
            'message'  => count($files) . ' file(s) uploaded.',
            'evidence' => $files,
        ], 201);
    }

    /**
     * DELETE /evidence/{id}  – admin removes evidence
     */
    public function destroy(int $id): JsonResponse
    {
        $evidence = EvidenceFile::findOrFail($id);
        $this->authorize('delete', $evidence);

        $this->evidenceService->delete($evidence);

        return response()->json(['message' => 'Evidence deleted.']);
    }
}
