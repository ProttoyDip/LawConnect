<?php

namespace App\Services;

use App\Models\CrimeReport;
use App\Models\EvidenceFile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EvidenceService
{
    /**
     * Store one or more evidence files for a crime report.
     *
     * @param  CrimeReport               $report
     * @param  array<UploadedFile>        $files
     * @param  User                       $uploader
     * @return array<EvidenceFile>
     */
    public function storeFiles(CrimeReport $report, array $files, User $uploader): array
    {
        $records = [];

        foreach ($files as $file) {
            $path = $file->store("evidence/{$report->id}", 'public');

            $records[] = EvidenceFile::create([
                'crime_report_id' => $report->id,
                'file_path'       => $path,
                'file_type'       => $this->resolveFileType($file),
                'original_name'   => $file->getClientOriginalName(),
                'file_size'       => $file->getSize(),
                'uploaded_by'     => $uploader->id,
            ]);
        }

        return $records;
    }

    /**
     * Delete an evidence file from storage and database.
     */
    public function delete(EvidenceFile $evidence): void
    {
        Storage::disk('public')->delete($evidence->file_path);
        $evidence->delete();
    }

    /**
     * Map MIME type to a simpler category.
     */
    private function resolveFileType(UploadedFile $file): string
    {
        $mime = $file->getMimeType();

        if (str_starts_with($mime, 'image/'))       return 'image';
        if (str_starts_with($mime, 'video/'))       return 'video';
        if (str_contains($mime, 'pdf') || str_contains($mime, 'document') || str_contains($mime, 'msword')) {
            return 'document';
        }
        return 'other';
    }
}
