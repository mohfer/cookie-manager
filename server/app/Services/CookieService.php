<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Cookie;
use Illuminate\Database\Eloquent\Collection;

final class CookieService
{
    public function getAll(): Collection
    {
        return Cookie::orderBy('name', 'asc')->get();
    }

    public function findById(int $id): ?Cookie
    {
        return Cookie::find($id);
    }

    public function create(array $data): Cookie
    {
        return Cookie::create($data);
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
