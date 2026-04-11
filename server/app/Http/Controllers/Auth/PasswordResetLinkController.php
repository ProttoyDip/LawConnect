<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            // Send reset link and return a clear JSON response for SPA clients.
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status != Password::RESET_LINK_SENT) {
                throw ValidationException::withMessages([
                    'email' => [__($status)],
                ]);
            }

            return response()->json(['status' => __($status)]);
        } catch (Throwable $e) {
            Log::error('Failed to send password reset link.', [
                'email' => $request->input('email'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to send reset email right now. Please try again shortly.',
            ], 503);
        }
    }
}
