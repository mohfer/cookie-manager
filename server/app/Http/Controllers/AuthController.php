<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use App\Services\PasswordResetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

final class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AuthService $authService,
        private readonly PasswordResetService $passwordResetService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $this->authService->login($request->validated());

        return $this->sendResponse($data, 'Login successful');
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $this->authService->register($request->validated());

        return $this->sendResponse($data, 'Registration successful', 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return $this->sendResponse(null, 'Logout successful');
    }

    public function user(Request $request): JsonResponse
    {
        return $this->sendResponse($this->authService->getUser($request), 'User retrieved successfully');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $sent = $this->passwordResetService->sendResetLink($request->string('email')->toString());

        if (!$sent) {
            return $this->sendError('Unable to send reset link', 400);
        }

        return $this->sendResponse(null, 'Reset link sent to your email');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', Password::min(12)->letters()->mixedCase()->numbers(), 'confirmed'],
        ]);

        $reset = $this->passwordResetService->reset(
            $request->string('email')->toString(),
            $request->string('token')->toString(),
            $request->string('password')->toString(),
        );

        if (!$reset) {
            return $this->sendError('Invalid or expired reset token', 400);
        }

        return $this->sendResponse(null, 'Password reset successful');
    }
}
