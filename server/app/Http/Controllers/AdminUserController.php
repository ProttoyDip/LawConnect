<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Mail\AccountCreatedNotificationMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'role' => 'required|string|in:citizen,police,officer,investigator,admin',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'national_id' => 'nullable|string|max:20|unique:users,national_id',
            'badge_number' => 'nullable|string|max:50|unique:users,badge_number',
            'police_station' => 'nullable|string|max:255',
        ]);

        $role = Role::firstOrCreate(['name' => $validated['role']]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(32)),
            'role_id' => $role->id,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'national_id' => $validated['national_id'] ?? null,
            'badge_number' => $validated['badge_number'] ?? null,
            'police_station' => $validated['police_station'] ?? null,
        ]);

        $mailSent = true;

        try {
            Mail::to($user->email)->send(new AccountCreatedNotificationMail($user));
        } catch (\Throwable $exception) {
            $mailSent = false;
            Log::error('Failed to send account-created email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'message' => $mailSent
                ? 'User created successfully. Account notification email sent.'
                : 'User created successfully. Account notification email could not be sent.',
            'user' => new UserResource($user->load('role')),
            'mail_sent' => $mailSent,
        ], 201);
    }
}
