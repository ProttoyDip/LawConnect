<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LawConnect Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto; padding: 24px;">
    <h2 style="margin: 0 0 16px;">You have been invited to LawConnect</h2>

    <p>Hello {{ $invitation->name }},</p>

    <p>An administrator invited you to join LawConnect.</p>

    <p><strong>Email:</strong> {{ $invitation->email }}</p>
    <p><strong>Role:</strong> {{ strtoupper($invitation->role?->name ?? 'USER') }}</p>
    <p><strong>Invitation expires:</strong> {{ $invitation->expires_at?->format('Y-m-d H:i') }}</p>

    <p style="margin: 20px 0;">
        <a href="{{ $registrationUrl }}" style="display: inline-block; background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 6px;">Complete Registration</a>
    </p>

    <p>If this invitation was not expected, you can ignore this email.</p>

    <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">{{ config('app.name') }}</p>
</body>
</html>
