<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CrimeReportController;

/*
|--------------------------------------------------------------------------
| Web Routes – LawConnect
|--------------------------------------------------------------------------
*/

// Landing page
Route::get('/', function () {
    return view('welcome');
});

// Authenticated web routes (Blade SSR dashboards)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Auth scaffolding (login/register pages)
require __DIR__ . '/auth.php';

// Catch-all for SPA (if React client is used alongside Blade)
// Route::get('{any}', function () {
//     return file_get_contents(public_path('index.html'));
// })->where('any', '.*');
