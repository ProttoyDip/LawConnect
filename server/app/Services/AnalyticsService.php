<?php

namespace App\Services;

use App\Models\CrimeReport;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Aggregate statistics for the admin dashboard.
     */
    public function dashboard(): array
    {
        return [
            'total_reports'     => CrimeReport::count(),
            'pending_reports'   => CrimeReport::where('status', CrimeReport::STATUS_PENDING)->count(),
            'investigating'     => CrimeReport::where('status', CrimeReport::STATUS_INVESTIGATING)->count(),
            'resolved_reports'  => CrimeReport::where('status', CrimeReport::STATUS_RESOLVED)->count(),
            'closed_reports'    => CrimeReport::where('status', CrimeReport::STATUS_CLOSED)->count(),
            'total_users'       => User::count(),
            'total_officers'    => User::whereHas('role', fn ($q) => $q->where('name', Role::POLICE))->count(),
            'by_category'       => $this->countByCategory(),
            'by_priority'       => $this->countByPriority(),
            'recent_reports'    => CrimeReport::with('user')->latest()->take(10)->get(),
        ];
    }

    private function countByCategory(): array
    {
        return CrimeReport::select('category', DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();
    }

    private function countByPriority(): array
    {
        return CrimeReport::select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();
    }
}
