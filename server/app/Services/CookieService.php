<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Cookie;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

final class CookieService
{
    public function getAllForUser(User $user): Collection
    {
        return $user->cookies()->orderBy('name', 'asc')->get();
    }

    public function findByIdForUser(User $user, int $id): ?Cookie
    {
        return $user->cookies()->whereKey($id)->first();
    }

    public function createForUser(User $user, array $data): Cookie
    {
        return $user->cookies()->create($data);
    }

    public function update(Cookie $cookie, array $data): Cookie
    {
        $cookie->update($data);

        return $cookie->fresh();
    }

    public function delete(Cookie $cookie): void
    {
        $cookie->delete();
    }
}
