<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Cookie;
use App\Models\User;
use App\Policies\CookiePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CookiePolicyTest extends TestCase
{
    use RefreshDatabase;

    private CookiePolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new CookiePolicy();
    }

    public function test_user_can_view_any_cookies(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->viewAny($user));
    }

    public function test_user_can_view_own_cookie(): void
    {
        $user = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->view($user, $cookie));
    }

    public function test_user_cannot_view_other_users_cookie(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->view($user, $cookie));
    }

    public function test_user_can_create_cookies(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->create($user));
    }

    public function test_user_can_update_own_cookie(): void
    {
        $user = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->update($user, $cookie));
    }

    public function test_user_cannot_update_other_users_cookie(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->update($user, $cookie));
    }

    public function test_user_can_delete_own_cookie(): void
    {
        $user = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->delete($user, $cookie));
    }

    public function test_user_cannot_delete_other_users_cookie(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $cookie = Cookie::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->delete($user, $cookie));
    }
}
