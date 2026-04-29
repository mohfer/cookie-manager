<?php

use App\Models\Cookie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function authUser(): User
{
    return User::factory()->create(['username' => fake()->unique()->userName()]);
}

function cookiePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Example Session',
        'domain' => 'example.com',
        'value' => [[
            'name' => 'sid',
            'value' => 'secret-value',
            'domain' => '.example.com',
            'path' => '/',
            'secure' => true,
            'httpOnly' => true,
            'hostOnly' => false,
            'sameSite' => 'lax',
        ]],
    ], $overrides);
}

it('requires authentication for cookie endpoints', function () {
    $this->getJson('/api/cookies')->assertUnauthorized();
    $this->postJson('/api/cookies', cookiePayload())->assertUnauthorized();
});

it('creates, lists, shows, updates, and deletes owned cookies', function () {
    $user = authUser();

    $created = $this->actingAs($user, 'sanctum')->postJson('/api/cookies', cookiePayload())
        ->assertCreated()
        ->assertJsonPath('data.domain', 'example.com')
        ->json('data');

    $this->actingAs($user, 'sanctum')->getJson('/api/cookies')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.value.0.value', 'secret-value');

    $this->actingAs($user, 'sanctum')->getJson("/api/cookies/{$created['id']}")
        ->assertOk()
        ->assertJsonPath('data.name', 'Example Session');

    $this->actingAs($user, 'sanctum')->putJson("/api/cookies/{$created['id']}", cookiePayload([
        'name' => 'Updated Session',
        'domain' => 'updated.example.com',
    ]))->assertOk()
        ->assertJsonPath('data.name', 'Updated Session');

    $this->actingAs($user, 'sanctum')->deleteJson("/api/cookies/{$created['id']}")
        ->assertOk();

    expect(Cookie::count())->toBe(0);
});

it('prevents users from accessing cookies owned by another user', function () {
    $owner = authUser();
    $otherUser = authUser();
    $cookie = $owner->cookies()->create(cookiePayload());

    $this->actingAs($otherUser, 'sanctum')->getJson("/api/cookies/{$cookie->id}")->assertNotFound();
    $this->actingAs($otherUser, 'sanctum')->putJson("/api/cookies/{$cookie->id}", cookiePayload(['name' => 'Hacked']))->assertNotFound();
    $this->actingAs($otherUser, 'sanctum')->deleteJson("/api/cookies/{$cookie->id}")->assertNotFound();
});

it('validates domains and cookie value shape', function () {
    $user = authUser();

    $this->actingAs($user, 'sanctum')->postJson('/api/cookies', cookiePayload([
        'domain' => '<script>alert(1)</script>',
        'value' => [['sameSite' => 'invalid']],
    ]))->assertUnprocessable()
        ->assertJsonValidationErrors(['domain', 'value.0.sameSite']);
});

it('enforces per-user unique cookie names and domains', function () {
    $user = authUser();
    $otherUser = authUser();

    $this->actingAs($user, 'sanctum')->postJson('/api/cookies', cookiePayload())->assertCreated();

    $this->actingAs($user, 'sanctum')->postJson('/api/cookies', cookiePayload())
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['domain', 'name']);

    $this->actingAs($otherUser, 'sanctum')->postJson('/api/cookies', cookiePayload())->assertCreated();
});
