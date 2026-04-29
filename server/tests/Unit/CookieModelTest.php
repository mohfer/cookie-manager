<?php

use App\Models\Cookie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('encrypts cookie values at rest and decrypts them when accessed', function () {
    $user = User::factory()->create(['username' => 'model-user']);
    $value = [['name' => 'sid', 'value' => 'secret']];

    $cookie = $user->cookies()->create([
        'name' => 'Session',
        'domain' => 'example.com',
        'value' => $value,
    ]);

    $rawValue = $cookie->getRawOriginal('value');

    expect($rawValue)->not->toBe(json_encode($value));
    expect($cookie->value)->toBe($value);
});

it('returns legacy plain json values and empty arrays for invalid values', function () {
    $cookie = new Cookie();

    expect($cookie->getValueAttribute('[{"name":"sid"}]'))->toBe([['name' => 'sid']]);
    expect($cookie->getValueAttribute('not-json'))->toBe([]);
    expect($cookie->getValueAttribute(null))->toBe([]);
});
