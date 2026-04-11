<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\CrimeReportController;
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\StatusUpdateController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\InvestigatorController;
use App\Http\Controllers\InvestigationNoteController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes – LawConnect
|--------------------------------------------------------------------------
*/

// ── Stateless API checks ───────────────────────────────────
Route::get('/health', function () {
    return response()->json(['ok' => true]);
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => bin2hex(random_bytes(16))]);
});

// ── Public (guest) ─────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);
    Route::get('/invitations/{token}', [AuthController::class, 'showInvitation']);
    Route::post('/register-invited', [AuthController::class, 'registerInvited']);
});

// ── Authenticated ──────────────────────────────────────────
Route::middleware(['auth:sanctum', 'log.api'])->group(function () {

    // Auth helpers
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::put('/auth/me',      [AuthController::class, 'updateMe']);

    // Investigator Routes (police role)
    Route::middleware('role:police')->prefix('investigator')->group(function () {
        Route::get('/cases', [InvestigatorController::class, 'index']);
        Route::get('/cases/{id}', [InvestigatorController::class, 'show']);
        Route::get('/stats', [InvestigatorController::class, 'stats']);
    });

    // Notes Routes
    Route::middleware('role:police')->prefix('cases/{case}')->group(function () {
        Route::get('/notes', [InvestigationNoteController::class, 'index']);
        Route::post('/notes', [InvestigationNoteController::class, 'store']);
    });
    Route::middleware('role:police')->group(function () {
        Route::put('/notes/{note}', [InvestigationNoteController::class, 'update']);
        Route::delete('/notes/{note}', [InvestigationNoteController::class, 'destroy']);
    });

    // Notifications (police + admin)
    Route::middleware('role:police,admin')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Crime Reports – citizen creates, views own
    Route::post('/crime-report',    [CrimeReportController::class, 'store'])->middleware('role:citizen');
    Route::get('/my-reports',       [CrimeReportController::class, 'myReports']); // TEMP: removed role middleware for testing

    // Crime Reports – single report (ownership enforced by policy)
    Route::get('/crime-report/{id}',  [CrimeReportController::class, 'show'])->middleware('case.owner');
    Route::put('/crime-report/{id}',  [CrimeReportController::class, 'update'])->middleware('role:citizen');
    Route::delete('/crime-report/{id}', [CrimeReportController::class, 'destroy'])->middleware('role:admin');

    // Crime Reports – list all (police + admin)
    Route::get('/crime-reports', [CrimeReportController::class, 'index'])->middleware('role:police,admin');

    // Evidence
    Route::post('/crime-report/{id}/evidence', [EvidenceController::class, 'store'])->middleware('role:citizen,police');
    Route::get('/evidence/{id}/download',      [EvidenceController::class, 'download']);
    Route::delete('/evidence/{id}',            [EvidenceController::class, 'destroy'])->middleware('role:admin');

    // Status Updates
    Route::put('/crime-report/{id}/status',    [StatusUpdateController::class, 'update'])->middleware('role:police,admin');
    Route::get('/crime-report/{id}/timeline',  [StatusUpdateController::class, 'timeline'])->middleware('case.owner');

    // Police Assignment (admin only)
    Route::post('/assign-police', [AssignmentController::class, 'store'])->middleware('role:admin');
    Route::get('/officers',       [AssignmentController::class, 'officers'])->middleware('role:admin');

    // Admin Analytics
    Route::get('/admin/analytics', [AnalyticsController::class, 'index'])->middleware('role:admin');
    Route::get('/admin/users', [AnalyticsController::class, 'users'])->middleware('role:admin');
    Route::post('/admin/users', [AdminUserController::class, 'store'])->middleware('role:admin');
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])->middleware('role:admin');
});

