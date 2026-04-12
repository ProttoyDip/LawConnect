<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        $isDebug = config('app.debug');

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($exception instanceof TokenMismatchException) {
            return response()->json([
                'success' => false,
                'message' => 'CSRF token mismatch.',
            ], 419);
        }

        // Let validation errors return their own 422 with field-level messages
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $exception->errors(),
            ], $exception->status);
        }

        // Model not found → 404
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found.',
            ], 404);
        }

        // Respect HTTP status codes from HttpExceptions (401, 403, 404, etc.)
        if ($exception instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage() ?: 'HTTP error.',
            ], $exception->getStatusCode());
        }

        // Everything else.
        $status = method_exists($exception, 'getStatusCode')
            ? $exception->getStatusCode()
            : 500;

        $payload = [
            'success' => false,
            'message' => $isDebug
                ? ($exception->getMessage() ?: 'An unexpected error occurred.')
                : 'Internal server error.',
        ];

        if ($isDebug) {
            $payload['exception'] = get_class($exception);
            $payload['file'] = $exception->getFile();
            $payload['line'] = $exception->getLine();
            $payload['trace'] = collect($exception->getTrace())->take(5)->toArray();
        }

        return response()->json($payload, $status);
    }
}
