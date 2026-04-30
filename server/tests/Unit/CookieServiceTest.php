<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Cookie;
use App\Models\User;
use App\Services\CookieService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CookieServiceTest extends TestCase
{
    use RefreshDatabase;

    private CookieService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CookieService();
        $this->user = User::factory()->create();
    }

    public function test_get_all_for_user_returns_user_cookies_ordered_by_name(): void
    {
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'zebra',
        ]);
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'alpha',
        ]);
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'beta',
        ]);

        $cookies = $this->service->getAllForUser($this->user);

        $this->assertCount(3, $cookies);
        $this->assertEquals('alpha', $cookies[0]->name);
        $this->assertEquals('beta', $cookies[1]->name);
        $this->assertEquals('zebra', $cookies[2]->name);
    }

    public function test_get_all_for_user_does_not_return_other_users_cookies(): void
    {
        $otherUser = User::factory()->create();

        Cookie::factory()->create(['user_id' => $this->user->id]);
        Cookie::factory()->create(['user_id' => $otherUser->id]);

        $cookies = $this->service->getAllForUser($this->user);

        $this->assertCount(1, $cookies);
        $this->assertEquals($this->user->id, $cookies[0]->user_id);
    }

    public function test_find_by_id_for_user_returns_cookie_when_owned(): void
    {
        $cookie = Cookie::factory()->create(['user_id' => $this->user->id]);

        $found = $this->service->findByIdForUser($this->user, $cookie->id);

        $this->assertNotNull($found);
        $this->assertEquals($cookie->id, $found->id);
    }

    public function test_find_by_id_for_user_returns_null_when_not_owned(): void
    {
        $otherUser = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $otherUser->id]);

        $found = $this->service->findByIdForUser($this->user, $cookie->id);

        $this->assertNull($found);
    }

    public function test_find_duplicate_returns_cookie_when_exists(): void
    {
        $cookie = Cookie::factory()->create([
            'user_id' => $this->user->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $found = $this->service->findDuplicate($this->user, 'example.com', 'test_cookie');

        $this->assertNotNull($found);
        $this->assertEquals($cookie->id, $found->id);
    }

    public function test_find_duplicate_returns_null_when_not_exists(): void
    {
        $found = $this->service->findDuplicate($this->user, 'example.com', 'test_cookie');

        $this->assertNull($found);
    }

    public function test_find_duplicate_returns_null_for_different_domain(): void
    {
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $found = $this->service->findDuplicate($this->user, 'other.com', 'test_cookie');

        $this->assertNull($found);
    }

    public function test_find_duplicate_returns_null_for_different_name(): void
    {
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $found = $this->service->findDuplicate($this->user, 'example.com', 'other_cookie');

        $this->assertNull($found);
    }

    public function test_find_duplicate_returns_null_for_different_user(): void
    {
        $otherUser = User::factory()->create();

        Cookie::factory()->create([
            'user_id' => $otherUser->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $found = $this->service->findDuplicate($this->user, 'example.com', 'test_cookie');

        $this->assertNull($found);
    }

    public function test_create_for_user_creates_cookie(): void
    {
        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $cookie = $this->service->createForUser($this->user, $data);

        $this->assertInstanceOf(Cookie::class, $cookie);
        $this->assertEquals($this->user->id, $cookie->user_id);
        $this->assertEquals('example.com', $cookie->domain);
        $this->assertEquals('test_cookie', $cookie->name);
        $this->assertDatabaseHas('cookies', [
            'user_id' => $this->user->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);
    }

    public function test_update_updates_cookie_and_returns_fresh_instance(): void
    {
        $cookie = Cookie::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'old_name',
        ]);

        $updated = $this->service->update($cookie, ['name' => 'new_name']);

        $this->assertEquals('new_name', $updated->name);
        $this->assertDatabaseHas('cookies', [
            'id' => $cookie->id,
            'name' => 'new_name',
        ]);
    }

    public function test_delete_removes_cookie(): void
    {
        $cookie = Cookie::factory()->create(['user_id' => $this->user->id]);

        $this->service->delete($cookie);

        $this->assertDatabaseMissing('cookies', ['id' => $cookie->id]);
    }
}
