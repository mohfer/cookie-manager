<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Http\Requests\StoreCookieRequest;
use App\Models\Cookie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

final class StoreCookieRequestTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_validation_passes_with_valid_data(): void
    {
        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => [
                [
                    'name' => 'session',
                    'value' => 'abc123',
                    'domain' => '.example.com',
                    'path' => '/',
                    'secure' => true,
                    'httpOnly' => true,
                ],
            ],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);
        $request->merge($data);

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validation_fails_when_domain_is_missing(): void
    {
        $data = [
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('domain', $validator->errors()->toArray());
    }

    public function test_validation_fails_when_name_is_missing(): void
    {
        $data = [
            'domain' => 'example.com',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
    }

    public function test_validation_fails_when_value_is_not_array(): void
    {
        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => 'not_an_array',
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('value', $validator->errors()->toArray());
    }

    public function test_validation_fails_when_domain_format_is_invalid(): void
    {
        $data = [
            'domain' => 'invalid domain with spaces',
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('domain', $validator->errors()->toArray());
    }

    public function test_validation_fails_when_duplicate_cookie_exists(): void
    {
        // Create existing cookie
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);
        $request->merge($data);

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
    }

    public function test_validation_passes_when_same_name_different_domain(): void
    {
        // Create existing cookie with different domain
        Cookie::factory()->create([
            'user_id' => $this->user->id,
            'domain' => 'other.com',
            'name' => 'test_cookie',
        ]);

        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);
        $request->merge($data);

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validation_passes_when_same_domain_and_name_for_different_user(): void
    {
        $otherUser = User::factory()->create();

        // Create existing cookie for other user
        Cookie::factory()->create([
            'user_id' => $otherUser->id,
            'domain' => 'example.com',
            'name' => 'test_cookie',
        ]);

        $data = [
            'domain' => 'example.com',
            'name' => 'test_cookie',
            'value' => [['name' => 'session', 'value' => 'abc123']],
        ];

        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);
        $request->merge($data);

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_authorize_returns_true_for_authenticated_user(): void
    {
        $request = new StoreCookieRequest();
        $request->setUserResolver(fn () => $this->user);

        $this->assertTrue($request->authorize());
    }
}
