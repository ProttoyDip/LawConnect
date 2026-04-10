<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * GET /api/notifications - User's notifications.
     */
    public function index(Request $request)
    {
        $notifications = $this->notificationService->getForUser($request->user());

        $unreadCount = $this->notificationService->getUnreadCount($request->user());

        // Return notifications array directly with unread count
        return response()->json([
            'data' => $notifications->items(), // Get the items array from paginator
            'unread_count' => $unreadCount,
            'total' => $notifications->total(),
            'current_page' => $notifications->currentPage(),
        ]);
    }

    /**
     * PUT /api/notifications/{id}/read - Mark as read.
     */
    public function markAsRead(Notification $notification, Request $request)
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->notificationService->markAsRead($notification);

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * PUT /api/notifications/read-all - Mark all as read.
     */
    public function markAllAsRead(Request $request)
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return response()->json(['marked' => $count]);
    }
}

