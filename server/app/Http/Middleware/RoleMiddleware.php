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
        
        // DEBUG: Log role check failure
        if (!$user) {
            \Log::error('RoleMiddleware: No authenticated user');
        } else {
            \Log::info('RoleMiddleware DEBUG', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'role_name' => $user->role?->name,
                'required_roles' => $roles
            ]);
            if (!$user->hasRole(...$roles)) {
                \Log::warning('RoleMiddleware: User lacks required role', [
                    'user_id' => $user->id,
                    'has_role' => $user->role?->name
                ]);
            }
        }

        if (!$user || !$user->hasRole(...$roles)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
