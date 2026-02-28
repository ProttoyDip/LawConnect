<?php

namespace App\Services;

use App\Models\CaseStatusUpdate;
use App\Models\CrimeReport;
use App\Models\User;

class StatusService
{
    /**
     * Add a status update to a crime report and sync the report's status.
     */
    public function updateStatus(int $crimeReportId, string $status, User $updater, ?string $remark = null): CaseStatusUpdate
    {
        $report = CrimeReport::findOrFail($crimeReportId);
        $report->update(['status' => $status]);

        return CaseStatusUpdate::create([
            'crime_report_id' => $report->id,
            'status'          => $status,
            'remark'          => $remark,
            'created_by'      => $updater->id,
        ]);
    }

    /**
     * Get the timeline of status updates for a report.
     */
    public function timeline(int $crimeReportId)
    {
        return CaseStatusUpdate::where('crime_report_id', $crimeReportId)
            ->with('creator')
            ->orderBy('created_at')
            ->get();
    }
}
