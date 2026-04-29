<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('updates email and regenerates username', function () {
    $user = User::factory()->create(['username' => 'old', 'email' => 'old@example.com']);

    $this->actingAs($user, 'sanctum')->putJson('/api/profile', [
        'email' => 'fresh@example.com',
    ])->assertOk()
        ->assertJsonPath('data.email', 'fresh@example.com')
        ->assertJsonPath('data.username', 'fresh');
});

it('rejects duplicate emails and weak profile passwords', function () {
    User::factory()->create(['email' => 'taken@example.com', 'username' => 'taken']);
    $user = User::factory()->create(['username' => 'user']);

    $this->actingAs($user, 'sanctum')->putJson('/api/profile', [
        'email' => 'taken@example.com',
        'password' => 'secret',
        'password_confirmation' => 'secret',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

it('updates password and revokes other tokens only', function () {
    $user = User::factory()->create(['username' => 'secure']);
    $currentToken = $user->createToken('current')->plainTextToken;
    $otherToken = $user->createToken('other');

    $this->withToken($currentToken)->putJson('/api/profile', [
        'password' => 'NewPassword1234',
        'password_confirmation' => 'NewPassword1234',
    ])->assertOk();

    $user->refresh();
    expect(Hash::check('NewPassword1234', $user->password))->toBeTrue();
    expect($user->tokens()->whereKey($otherToken->accessToken->id)->exists())->toBeFalse();
    expect($user->tokens()->count())->toBe(1);
});
