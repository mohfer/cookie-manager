<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCookieRequest;
use App\Http\Requests\UpdateCookieRequest;
use App\Models\Cookie;
use App\Services\CookieService;
use App\Traits\ApiResponse;

final class CookieController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CookieService $cookieService) {}

    public function index()
    {
        return $this->sendResponse($this->cookieService->getAll(), 'Cookies retrieved successfully');
    }

    public function store(StoreCookieRequest $request)
    {
        $cookie = $this->cookieService->create($request->validated());

        return $this->sendResponse($cookie, 'Cookie created successfully', 201);
    }

    public function show(Cookie $cookie)
    {
        return $this->sendResponse($cookie, 'Cookie retrieved successfully');
    }

    public function update(UpdateCookieRequest $request, Cookie $cookie)
    {
        $cookie = $this->cookieService->update($cookie, $request->validated());

        return $this->sendResponse($cookie, 'Cookie updated successfully');
    }

    public function destroy(Cookie $cookie)
    {
        $this->cookieService->delete($cookie);

        return $this->sendResponse(null, 'Cookie deleted successfully');
    }
}
