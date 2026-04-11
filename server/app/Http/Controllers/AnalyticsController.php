<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function __construct(private AnalyticsService $analyticsService) {}

    /**
     * GET /admin/analytics  – dashboard aggregates
     */
    public function index(): JsonResponse
    {
        return response()->json($this->analyticsService->dashboard());
    }

    /**
     * GET /admin/users  – all users for user management
     */
    public function users(): JsonResponse
    {
        $activeUserIds = AuditLog::query()
            ->whereNotNull('actor_id')
            ->where('created_at', '>=', now()->subMinutes(5))
            ->distinct()
            ->pluck('actor_id')
            ->map(fn ($id) => (int) $id)
            ->values();

        return response()->json([
            'users' => User::with('role')->get(),
            'active_user_ids' => $activeUserIds,
        ]);
    }
}
