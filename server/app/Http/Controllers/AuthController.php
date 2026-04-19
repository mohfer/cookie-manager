<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

final class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $authService) {}

    public function login(LoginRequest $request)
    {
        $data = $this->authService->login($request->validated());

        return $this->sendResponse($data, 'Login successful');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);

        return $this->sendResponse(null, 'Logout successful');
    }

    public function user(Request $request)
    {
        return $this->sendResponse($this->authService->getUser($request), 'User retrieved successfully');
    }
}
