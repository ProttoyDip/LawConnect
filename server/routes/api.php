<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CrimeReportController;
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\StatusUpdateController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes – LawConnect
|--------------------------------------------------------------------------
*/

// ── Public (guest) ─────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Authenticated ──────────────────────────────────────────
Route::middleware(['auth:sanctum', 'log.api'])->group(function () {

    // Auth helpers
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Crime Reports – citizen creates, views own
    Route::post('/crime-report',    [CrimeReportController::class, 'store'])->middleware('role:citizen');
    Route::get('/my-reports',       [CrimeReportController::class, 'myReports'])->middleware('role:citizen');

    // Crime Reports – single report (ownership enforced by policy)
    Route::get('/crime-report/{id}',  [CrimeReportController::class, 'show'])->middleware('case.owner');
    Route::put('/crime-report/{id}',  [CrimeReportController::class, 'update'])->middleware('role:citizen');
    Route::delete('/crime-report/{id}', [CrimeReportController::class, 'destroy'])->middleware('role:admin');

    // Crime Reports – list all (police + admin)
    Route::get('/crime-reports', [CrimeReportController::class, 'index'])->middleware('role:police|admin');

    // Evidence
    Route::post('/crime-report/{id}/evidence', [EvidenceController::class, 'store'])->middleware('role:citizen|police');
    Route::delete('/evidence/{id}',            [EvidenceController::class, 'destroy'])->middleware('role:admin');

    // Status Updates
    Route::put('/crime-report/{id}/status',    [StatusUpdateController::class, 'update'])->middleware('role:police|admin');
    Route::get('/crime-report/{id}/timeline',  [StatusUpdateController::class, 'timeline'])->middleware('case.owner');

    // Police Assignment (admin only)
    Route::post('/assign-police', [AssignmentController::class, 'store'])->middleware('role:admin');
    Route::get('/officers',       [AssignmentController::class, 'officers'])->middleware('role:admin');

    // Admin Analytics
    Route::get('/admin/analytics', [AnalyticsController::class, 'index'])->middleware('role:admin');
});