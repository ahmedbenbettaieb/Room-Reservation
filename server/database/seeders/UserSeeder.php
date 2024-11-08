<?php

namespace Database\Seeders;

use App\Http\Controllers\AuthController;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            \App\Models\User::factory()->create([
                'name' => 'User ' . ($i + 1),
                'email' => 'user' . ($i + 1) . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]);
            AuthController::sendWelcomeEmail(\App\Models\User::where('email', 'user' . ($i + 1) . '@example.com')->first(), 'password');
        }
        //
    }
}
