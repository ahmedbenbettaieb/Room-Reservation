<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    public function run()
    {

        $statuses = ['available', 'occupied'];

        // Create 10 rooms with random data
        for ($i = 1; $i <= 10; $i++) {
            Room::create([
                'name' => 'Room ' . $i,
                'capacity' => rand(5, 20),
                'description' => Str::random(10),
                'amenities' => Str::random(10),
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
