<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCookieRequest;
use App\Http\Requests\UpdateCookieRequest;
use App\Services\CookieService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

final class CookieController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CookieService $cookieService) {}

    public function index(Request $request)
    {
        return $this->sendResponse($this->cookieService->getAllForUser($request->user()), 'Cookies retrieved successfully');
    }

    public function store(StoreCookieRequest $request)
    {
        $cookie = $this->cookieService->createForUser($request->user(), $request->validated());

        return $this->sendResponse($cookie, 'Cookie created successfully', 201);
    }

    public function show(Request $request, int $cookie)
    {
        $ownedCookie = $this->cookieService->findByIdForUser($request->user(), $cookie);

        if (!$ownedCookie) {
            return $this->sendError('Cookie not found', 404);
        }

        return $this->sendResponse($ownedCookie, 'Cookie retrieved successfully');
    }

    public function update(UpdateCookieRequest $request, int $cookie)
    {
        $ownedCookie = $this->cookieService->findByIdForUser($request->user(), $cookie);

        if (!$ownedCookie) {
            return $this->sendError('Cookie not found', 404);
        }

        $updatedCookie = $this->cookieService->update($ownedCookie, $request->validated());

        return $this->sendResponse($updatedCookie, 'Cookie updated successfully');
    }

    public function destroy(Request $request, int $cookie)
    {
        $ownedCookie = $this->cookieService->findByIdForUser($request->user(), $cookie);

        if (!$ownedCookie) {
            return $this->sendError('Cookie not found', 404);
        }

        $this->cookieService->delete($ownedCookie);

        return $this->sendResponse(null, 'Cookie deleted successfully');
    }
}