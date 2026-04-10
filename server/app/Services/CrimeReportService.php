<?php

namespace App\Services;

use App\Models\CrimeReport;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class CrimeReportService
{
    /**
     * Create a new crime report for the given citizen.
     */
    public function create(User $user, array $data): CrimeReport
    {
        return CrimeReport::create([
            'user_id'     => $user->id,
            'title'       => $data['title'],
            'description' => $data['description'],
            'category'    => $data['category'],
            'location'    => $data['location'] ?? null,
            'occurred_at' => $data['occurred_at'] ?? null,
            'priority'    => $data['priority'] ?? CrimeReport::PRIORITY_MEDIUM,
            'status'      => CrimeReport::STATUS_PENDING,
        ]);
    }

    /**
     * Update an existing crime report.
     */
    public function update(CrimeReport $report, array $data): CrimeReport
    {
        $report->update($data);
        return $report->fresh();
    }

    /**
     * Get paginated reports belonging to a citizen.
     */
    public function getForCitizen(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return CrimeReport::where('user_id', $user->id)
            ->with('statusUpdates')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get all reports (police/admin view) with optional filters.
     */
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CrimeReport::with(['user', 'policeAssignments.officer', 'statusUpdates']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('case_id', 'LIKE', "%{$filters['search']}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get investigator assigned cases with filters (investigator view).
     */
    public function getInvestigatorCases(int $investigatorId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CrimeReport::with(['user', 'policeAssignments.officer', 'statusUpdates', 'investigationNotes.user', 'evidenceFiles'])
            ->where(function ($q) use ($investigatorId) {
                $q->whereHas('policeAssignments', function ($pa) use ($investigatorId) {
                    $pa->where('officer_id', $investigatorId);
                })->orWhere('status', 'investigating');
            });

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('case_id', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('location', 'LIKE', "%{$filters['search']}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get investigator stats.
     */
    public function getInvestigatorStats(int $investigatorId): array
    {
        return [
            'total_assigned' => CrimeReport::whereHas('policeAssignments', function ($q) use ($investigatorId) {
                $q->where('officer_id', $investigatorId);
            })->count(),
            'investigating' => CrimeReport::where('status', 'investigating')
                ->whereHas('policeAssignments', function ($q) use ($investigatorId) {
                    $q->where('officer_id', $investigatorId);
                })
                ->count(),
            'pending_review' => CrimeReport::where('status', 'under_review')
                ->whereHas('policeAssignments', function ($q) use ($investigatorId) {
                    $q->where('officer_id', $investigatorId);
                })
                ->count(),
            'resolved' => CrimeReport::whereIn('status', ['resolved', 'closed'])
                ->whereHas('policeAssignments', function ($q) use ($investigatorId) {
                    $q->where('officer_id', $investigatorId);
                })
                ->count(),
        ];
    }

    /**
     * Get a single report by ID with all relations.
     */
    public function findOrFail(int $id): CrimeReport
    {
        return CrimeReport::with([
            'user',
            'evidenceFiles',
            'policeAssignments.officer',
            'statusUpdates.creator',
            'investigationNotes.user',
        ])->findOrFail($id);
    }
}

