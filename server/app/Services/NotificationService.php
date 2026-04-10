<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for user.
     */
    public function create(int $userId, string $title, string $message, string $type, ?int $relatedId = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'related_id' => $relatedId,
        ]);
    }

    /**
     * Get user's notifications, unread first.
     */
    public function getForUser(User $user, int $perPage = 20)
    {
        return $user->notifications()->latest()->paginate($perPage);
    }

    /**
     * Get unread count for user.
     */
    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->unread()->count();
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification): bool
    {
        $notification->update(['read' => true]);
        return true;
    }

    /**
     * Mark all as read for user.
     */
    public function markAllAsRead(User $user): int
    {
        return $user->notifications()->unread()->update(['read' => true]);
    }
}

