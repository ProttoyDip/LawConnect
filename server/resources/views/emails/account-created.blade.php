<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LawConnect Account Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto; padding: 24px;">
    <h2 style="margin: 0 0 16px;">Your LawConnect Account Is Ready</h2>

    <p>Hello {{ $user->name }},</p>

    <p>An administrator has created your account for LawConnect.</p>

    <p><strong>Email:</strong> {{ $user->email }}</p>
    <p><strong>Role:</strong> {{ strtoupper($user->role?->name ?? 'USER') }}</p>

    <p>To set your password, use the "Forgot password" option on the login page.</p>

    <p style="margin: 20px 0;">
        <a href="{{ rtrim(config('app.frontend_url'), '/') }}/forgot-password" style="display: inline-block; background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 6px;">Set Password</a>
    </p>

    <p>If you were not expecting this account, please contact support.</p>

    <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">{{ config('app.name') }}</p>
</body>
</html>
