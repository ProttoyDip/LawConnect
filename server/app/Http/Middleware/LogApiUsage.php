<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AuditLog;

/**
 * Logs every mutating API request (POST, PUT, PATCH, DELETE) to the audit_logs table.
 */
class LogApiUsage
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            try {
                AuditLog::create([
                    'actor_id'    => $request->user()?->id,
                    'action'      => strtolower($request->method()) . ':' . $request->path(),
                    'target_type' => $this->guessTargetType($request),
                    'target_id'   => $request->route('id') ?? $request->route('crime_report') ?? 0,
                    'meta'        => [
                        'status_code' => $response->getStatusCode(),
                        'user_agent'  => $request->userAgent(),
                    ],
                    'ip_address'  => $request->ip(),
                ]);
            } catch (\Throwable $e) {
                // Logging should never break the request
                report($e);
            }
        }

        return $response;
    }

    private function guessTargetType(Request $request): string
    {
        $path = $request->path();
        if (str_contains($path, 'crime-report'))  return 'crime_report';
        if (str_contains($path, 'evidence'))       return 'evidence_file';
        if (str_contains($path, 'assign'))         return 'police_assignment';
        if (str_contains($path, 'auth'))           return 'user';
        return 'unknown';
    }
}
