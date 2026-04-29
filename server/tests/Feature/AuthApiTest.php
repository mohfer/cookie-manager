<?php

use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('registers users with strong passwords and returns a token', function () {
    $response = $this->postJson('/api/register', [
        'email' => 'new@example.com',
        'password' => 'Password1234',
        'password_confirmation' => 'Password1234',
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Registration successful')
        ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'email', 'username']]]);

    expect(User::where('email', 'new@example.com')->exists())->toBeTrue();
});

it('rejects weak registration passwords', function () {
    $this->postJson('/api/register', [
        'email' => 'weak@example.com',
        'password' => 'secret',
        'password_confirmation' => 'secret',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});

it('logs in with email or username and rejects invalid credentials', function () {
    User::factory()->create([
        'email' => 'demo@example.com',
        'username' => 'demo',
        'password' => Hash::make('Password1234'),
    ]);

    $this->postJson('/api/login', ['login' => 'demo@example.com', 'password' => 'Password1234'])
        ->assertOk()
        ->assertJsonStructure(['data' => ['token']]);

    $this->postJson('/api/login', ['login' => 'demo', 'password' => 'Password1234'])
        ->assertOk()
        ->assertJsonStructure(['data' => ['token']]);

    $this->postJson('/api/login', ['login' => 'demo', 'password' => 'wrong-password'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('login');
});

it('returns the authenticated user and logs out current token', function () {
    $user = User::factory()->create(['username' => 'demo']);
    $token = $user->createToken('auth-token')->plainTextToken;

    $this->withToken($token)->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('data.email', $user->email);

    $this->withToken($token)->postJson('/api/logout')
        ->assertOk()
        ->assertJsonPath('message', 'Logout successful');

    expect($user->tokens()->count())->toBe(0);
});

it('sends password reset links without revealing unknown emails', function () {
    Mail::fake();
    $user = User::factory()->create(['email' => 'reset@example.com', 'username' => 'reset']);

    $this->postJson('/api/forgot-password', ['email' => $user->email])
        ->assertOk()
        ->assertJsonPath('message', 'Reset link sent to your email');

    $this->postJson('/api/forgot-password', ['email' => 'missing@example.com'])
        ->assertOk();

    Mail::assertQueued(ResetPassword::class, 1);
});
