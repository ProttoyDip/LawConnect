<?php

$frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
$configuredOrigins = array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))));

$defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://law-connect-bd.vercel.app',
    $frontendUrl,
];

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        ...array_values(array_unique(array_merge($defaultOrigins, $configuredOrigins))),
    ],

    'allowed_origins_patterns' => [
        '#https://law-connect-.*\.vercel\.app#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
