<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cookie>
 */
final class CookieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'domain' => fake()->domainName(),
            'name' => fake()->word() . '_cookie',
            'value' => [
                [
                    'name' => fake()->word(),
                    'value' => fake()->uuid(),
                    'domain' => '.' . fake()->domainName(),
                    'path' => '/',
                    'secure' => fake()->boolean(),
                    'httpOnly' => fake()->boolean(),
                ],
            ],
        ];
    }
}
