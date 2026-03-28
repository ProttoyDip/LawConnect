<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * POST /auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Get the role - default to citizen if not specified
        $roleName = $request->input('role', Role::CITIZEN);
        $role = Role::firstOrCreate(['name' => $roleName]);

$user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'national_id' => $request->national_id,
            'badge_number' => $request->badge_number,
            'police_station' => $request->police_station,
            'password' => Hash::make($request->password),
            'role_id'  => $role->id,
            'phone'    => $request->phone,
            'address'  => $request->address,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => new UserResource($user->load('role')),
            'token'   => $token,
        ], 201);
    }

    /**
     * POST /auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $roleType = $request->input('role_type');

        // Map frontend role_type to backend role names
        $roleMap = [
            'general' => 'citizen',
            'investigator' => 'police',
            'admin' => 'admin',
        ];

        $expectedRole = $roleMap[$roleType] ?? null;

        // Role-specific field requirements
        if ($roleType && $expectedRole) {
            if ($expectedRole === 'admin') {
                if (!$request->filled('admin_id') || !$request->filled('security_code')) {
                    return response()->json([
                        'message' => 'Admin credentials required'
                    ], 401);
                }
            } elseif ($expectedRole === 'police') {
                if (!$request->filled('badge_number') || !$request->filled('police_station')) {
                    return response()->json([
                        'message' => 'Badge number and police station are required'
                    ], 401);
                }
            }
        } elseif ($roleType && !$expectedRole) {
            return response()->json(['message' => 'Invalid role type'], 400);
        }

        // Standard email/password auth
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user = Auth::user()->load('role');

        // Validate role match
        if ($expectedRole && $user->role->name !== $expectedRole) {
            Auth::logout();
            return response()->json([
                'message' => 'Role credentials do not match'
            ], 401);
        }

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
