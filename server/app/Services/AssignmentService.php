<?php

namespace App\Services;

use App\Models\CrimeReport;
use App\Models\PoliceAssignment;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AssignmentService
{
    /**
     * Assign a police officer to a crime report.
     */
    public function assign(int $crimeReportId, int $officerId, User $assigner, ?string $notes = null): PoliceAssignment
    {
        // Validate that the officer is indeed a police user
        $officer = User::findOrFail($officerId);
        if (!$officer->isPolice()) {
            throw new \InvalidArgumentException('The selected user is not a police officer.');
        }

        $assignment = DB::transaction(function () use ($crimeReportId, $officerId, $assigner, $notes) {
            // Keep a single current assignment row per case.
            PoliceAssignment::where('crime_report_id', $crimeReportId)->delete();

            return PoliceAssignment::create([
                'crime_report_id' => $crimeReportId,
                'officer_id'      => $officerId,
                'assigned_by'     => $assigner->id,
                'notes'           => $notes,
                'assigned_at'     => now(),
            ]);
        });

        // Move report status to under_review if still pending
        $report = CrimeReport::findOrFail($crimeReportId);
        if ($report->status === CrimeReport::STATUS_PENDING) {
            $report->update(['status' => CrimeReport::STATUS_UNDER_REVIEW]);
        }

        return $assignment;
    }

    /**
     * Get all police officers available for assignment.
     */
    public function getAvailableOfficers()
    {
        return User::whereHas('role', function ($query) {
            $query->whereIn('name', [
                Role::POLICE,
                Role::OFFICER,
                Role::INVESTIGATOR,
            ]);
        })->get();
    }
}
