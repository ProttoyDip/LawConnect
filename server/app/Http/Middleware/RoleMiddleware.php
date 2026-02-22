<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Restrict access to users that hold one of the given roles.
 *
 * Usage in routes:  ->middleware('role:admin,police')
 */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user || !$user->hasRole(...$roles)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
