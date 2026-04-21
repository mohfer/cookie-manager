<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

final class ProfileController extends Controller
{
    use ApiResponse;

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $currentTokenId = $user->currentAccessToken()?->id;

        if (isset($data['email'])) {
            $user->email = $data['email'];
            $user->username = $this->generateUsername($data['email'], $user->id);
            $user->name = $user->username;
        }

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        if (isset($data['password'])) {
            $tokenQuery = $user->tokens();

            if ($currentTokenId !== null) {
                $tokenQuery->where('id', '!=', $currentTokenId);
            }

            $tokenQuery->delete();
        }

        return $this->sendResponse($user->fresh(), 'Profile updated successfully');
    }

    private function generateUsername(string $email, int $excludeId): string
    {
        $base = strtolower(strtok($email, '@'));
        $username = $base;
        $i = 1;

        while (\App\Models\User::where('username', $username)->where('id', '!=', $excludeId)->exists()) {
            $username = $base . $i;
            $i++;
        }

        return $username;
    }
}
