<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * POST /auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Public signup is citizen-only.
        $roleName = Role::CITIZEN;
        $role = Role::firstOrCreate(['name' => $roleName]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'national_id' => $request->national_id,
            'badge_number' => null,
            'police_station' => null,
            'password' => Hash::make($request->password),
            'role_id'  => $role->id,
            'phone'    => $request->phone,
            'address'  => $request->address,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // Notify admin about new user registration
        $this->notifyAdmins(
            'New User Registration',
            "A new {$roleName} user '{$user->name}' has registered.",
            'new_user',
            $user->id
        );

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => new UserResource($user->load('role')),
            'token'   => $token,
        ], 201);
    }

    /**
     * Notify all admins about an event
     */
    private function notifyAdmins(string $title, string $message, string $type, ?int $relatedId = null): void
    {
        $admins = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            $this->notificationService->create(
                $admin->id,
                $title,
                $message,
                $type,
                $relatedId
            );
        }
    }

    /**
     * POST /auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user = Auth::user()->load('role');

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => new UserResource($user),
            'token'   => $token,
        ]);
    }

    /**
     * POST /auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()?->tokens()->delete(); // Revoke all tokens
            // Default guard for API requests may be Sanctum's RequestGuard (no logout method).
            // Use the session-capable web guard explicitly when ending browser sessions.
            Auth::guard('web')->logout();
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
            return response()->json([
                'message' => 'Logged out successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()->load('role')));
    }

    /**
     * PUT /auth/me
     */
    public function updateMe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:1000',
            'national_id' => 'sometimes|nullable|string|max:20|unique:users,national_id,' . $request->user()->id,
            'badge_number' => 'sometimes|nullable|string|max:50|unique:users,badge_number,' . $request->user()->id,
            'police_station' => 'sometimes|nullable|string|max:255',
        ]);

        $user = $request->user();
        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => new UserResource($user->load('role')),
        ]);
    }
}
