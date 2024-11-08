<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use App\Models\Room;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        for ($i = 0; $i < 200; $i++) {
            $user = User::inRandomOrder()->first();
            $room = Room::inRandomOrder()->first();

            $startDateTime = Carbon::now()->addDays(rand(0, 30))->setTime(rand(8, 16), 0);
            $durationHours = rand(2, 5);
            $endDateTime = (clone $startDateTime)->addHours($durationHours);
            $estimatedDuration = $endDateTime->diffInMinutes($startDateTime);

            $isRoomAvailable = Event::where('room_id', $room->id)
                ->where(function ($query) use ($startDateTime, $endDateTime) {
                    $query->whereBetween('start_date', [$startDateTime, $endDateTime])
                          ->orWhereBetween('end_date', [$startDateTime, $endDateTime]);
                })->doesntExist();

            if ($isRoomAvailable) {
                Event::create([
                    'title' => 'Team Meeting ' . ($i + 1),
                    'start_date' => $startDateTime,
                    'end_date' => $endDateTime,
                    'estimated_duration' => $estimatedDuration,
                    'description' => 'Discussing project updates ' . ($i + 1),
                    'room_id' => $room->id,
                    'user_id' => $user->id,
                    'status' => 'confirmed',
                ]);
            }
        }
    }
}
