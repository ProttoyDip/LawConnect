<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes – LawConnect
|--------------------------------------------------------------------------
|
| These routes are for backend-related web pages (e.g., email verification,
| password reset links that might open in email clients). The frontend is
| now handled by React.
|
*/

// Landing page
Route::get('/', function () {
    return view('welcome');
});

// Authenticated web routes (Blade SSR dashboards)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Crime Report – create form (citizen)
    Route::get('/crime-reports/create', function () {
        return view('crime-reports.create');
    })->name('crime-reports.create');

    // Crime Report – store via web (citizen)
    Route::post('/crime-reports/store', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category'    => ['required', 'string', 'in:' . implode(',', \App\Models\CrimeReport::CATEGORIES)],
            'location'    => ['nullable', 'string', 'max:255'],
            'occurred_at' => ['nullable', 'date', 'before_or_equal:now'],
            'priority'    => ['nullable', 'string', 'in:' . implode(',', \App\Models\CrimeReport::PRIORITIES)],
            'evidence'    => ['nullable', 'array', 'max:5'],
            'evidence.*'  => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi'],
        ]);

        $reportService   = app(\App\Services\CrimeReportService::class);
        $evidenceService = app(\App\Services\EvidenceService::class);

        $report = $reportService->create($request->user(), $validated);

        if ($request->hasFile('evidence')) {
            $evidenceService->storeFiles($report, $request->file('evidence'), $request->user());
        }

        return redirect('/dashboard')->with('success', 'Crime report submitted successfully.');
    })->name('crime-reports.store');

    // Crime Report – view single report
    Route::get('/crime-report/{id}', function ($id) {
        $report = \App\Models\CrimeReport::with(['user', 'evidenceFiles', 'statusUpdates.creator'])->findOrFail($id);
        return view('crime-reports.show', compact('report'));
    })->name('crime-report.show');

    // Crime Reports – list all (police/admin)
    Route::get('/crime-reports', function (\Illuminate\Http\Request $request) {
        $query = \App\Models\CrimeReport::with('user')->latest();
        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('search'))   $query->where(function ($q) use ($request) {
            $q->where('title', 'like', "%{$request->search}%")
              ->orWhere('case_id', 'like', "%{$request->search}%");
        });
        $reports = $query->paginate(15)->withQueryString();
        return view('crime-reports.list', compact('reports'));
    })->name('crime-reports.index');
});

// Auth scaffolding (login/register pages)
require __DIR__ . '/auth.php';

// SPA fallback - serves React build from public/build/index.html for client routes
Route::get('/{any}', function () {
    return file_get_contents(public_path('build/index.html'));
})->where('any', '.*')->middleware('auth', 'verified');

// Note: Auth routes (login, register, password reset) have been moved to API-only
// The React frontend handles all authentication via /api/auth/* endpoints
