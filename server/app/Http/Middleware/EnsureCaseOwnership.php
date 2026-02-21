<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\CrimeReport;

/**
 * Ensures the authenticated user owns the crime report being accessed
 * (citizens only — police and admins are bypassed).
 */
class EnsureCaseOwnership
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Admins and police may access any case
        if ($user && ($user->isAdmin() || $user->isPolice())) {
            return $next($request);
        }

        $reportId = $request->route('id') ?? $request->route('crime_report');

        if ($reportId) {
            $report = CrimeReport::find($reportId);

            if (!$report || $report->user_id !== $user?->id) {
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Not found.'], 404);
                }
                abort(404);
            }
        }

        return $next($request);
    }
}
