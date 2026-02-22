<?php

namespace App\Http\Controllers;

use App\Models\CrimeReport;
use App\Models\Role;
use App\Services\AnalyticsService;
use App\Services\CrimeReportService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private CrimeReportService $reportService,
        private AnalyticsService $analyticsService,
    ) {}

    /**
     * Route the user to the correct dashboard based on role.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return match ($user->role?->name) {
            Role::ADMIN   => $this->admin(),
            Role::POLICE  => $this->police($request),
            default       => $this->citizen($request),
        };
    }

    private function citizen(Request $request)
    {
        $reports = $this->reportService->getForCitizen($request->user());
        return view('dashboard.citizen', compact('reports'));
    }

    private function police(Request $request)
    {
        $user    = $request->user();
        $reports = CrimeReport::whereHas('policeAssignments', fn ($q) => $q->where('officer_id', $user->id))
            ->with('user', 'statusUpdates')
            ->latest()
            ->paginate(15);

        return view('dashboard.police', compact('reports'));
    }

    private function admin()
    {
        $analytics = $this->analyticsService->dashboard();
        return view('dashboard.admin', compact('analytics'));
    }
}
