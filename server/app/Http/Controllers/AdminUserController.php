<?php

namespace App\Http\Controllers;

use App\Mail\UserInvitationMail;
use App\Models\Role;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    /**
     * POST /api/admin/users
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|string|in:police,officer,investigator,admin',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'national_id' => 'nullable|string|max:20|unique:users,national_id',
            'badge_number' => 'nullable|string|max:50|unique:users,badge_number',
            'police_station' => 'nullable|string|max:255',
        ]);

        // Prevent duplicate active invitations for the same email.
        UserInvitation::query()
            ->where('email', $validated['email'])
            ->whereNotNull('accepted_at')
            ->delete();

        $pendingInvite = UserInvitation::query()
            ->where('email', $validated['email'])
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->first();

        if ($pendingInvite) {
            return response()->json([
                'message' => 'An active invitation already exists for this email.',
                'mail_sent' => false,
            ], 409);
        }

        UserInvitation::query()
            ->where('email', $validated['email'])
            ->whereNull('accepted_at')
            ->where('expires_at', '<=', now())
            ->delete();

        $role = Role::firstOrCreate(['name' => $validated['role']]);

        $invitation = UserInvitation::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'token' => hash('sha256', Str::random(64)),
            'role_id' => $role->id,
            'invited_by_id' => $request->user()?->id,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'national_id' => $validated['national_id'] ?? null,
            'badge_number' => $validated['badge_number'] ?? null,
            'police_station' => $validated['police_station'] ?? null,
            'expires_at' => now()->addHours(24),
        ]);

        $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
        $registrationUrl = $frontendUrl . '/register?invite=' . urlencode($invitation->token);
        $mailSent = true;

        try {
            Mail::to($invitation->email)->send(new UserInvitationMail($invitation->load('role'), $registrationUrl));
        } catch (\Throwable $exception) {
            $mailSent = false;
            Log::error('Failed to send invitation email', [
                'invitation_id' => $invitation->id,
                'email' => $invitation->email,
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'message' => $mailSent
                ? 'Invitation sent successfully. User account will be created after registration.'
                : 'Invitation created but email could not be sent. Please retry.',
            'invitation' => [
                'id' => $invitation->id,
                'email' => $invitation->email,
                'name' => $invitation->name,
                'role' => $invitation->role?->name,
                'expires_at' => $invitation->expires_at,
            ],
            'mail_sent' => $mailSent,
        ], 201);
    }

    /**
     * DELETE /api/admin/users/{user}
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        if ($user->role?->name === Role::SUPER_ADMIN) {
            return response()->json([
                'message' => 'Super admin account cannot be deleted.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
