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
     * Get a single report by ID with all relations.
     */
    public function findOrFail(int $id): CrimeReport
    {
        return CrimeReport::with([
            'user',
            'evidenceFiles',
            'policeAssignments.officer',
            'statusUpdates.creator',
        ])->findOrFail($id);
    }
}
