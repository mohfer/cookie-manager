<?php

namespace App\Http\Controllers;

use App\Models\Cookie;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CookieController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $cookies = Cookie::all();
        return $this->sendResponse($cookies, 'Cookies retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain' => 'required|string|unique:cookies,domain',
            'name' => 'required|string|unique:cookies,name',
            'value' => 'required|array',
        ]);

        $cookie = Cookie::create($validated);

        return $this->sendResponse($cookie, 'Cookie created successfully', 201);
    }

    public function show($id)
    {
        $cookie = Cookie::find($id);

        if (!$cookie) {
            return $this->sendError('Cookie not found', 404);
        }

        return $this->sendResponse($cookie, 'Cookie retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $cookie = Cookie::find($id);

        if (!$cookie) {
            return $this->sendError('Cookie not found', 404);
        }

        $validated = $request->validate([
            'domain' => 'sometimes|required|string|unique:cookies,domain,' . $id,
            'name' => 'sometimes|required|string|unique:cookies,name,' . $id,
            'value' => 'sometimes|required|array',
        ]);

        $cookie->update($validated);

        return $this->sendResponse($cookie, 'Cookie updated successfully');
    }

    public function destroy($id)
    {
        $cookie = Cookie::find($id);

        if (!$cookie) {
            return $this->sendError('Cookie not found', 404);
        }

        $cookie->delete();

        return $this->sendResponse(null, 'Cookie deleted successfully');
    }
}
