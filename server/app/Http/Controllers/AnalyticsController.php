<?php

namespace App\Http\Controllers;

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
}
