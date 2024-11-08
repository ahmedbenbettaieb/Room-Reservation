<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Event;
use Carbon\Carbon;

class CheckRoomAvailability
{
    public function handle(Request $request, Closure $next)
    {
        $roomId = $request->input('room_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $eventId = $request->route('id');
        //add one minute to start date
        $startDate = Carbon::parse($startDate)->addMinutes(1);
        $endDate = Carbon::parse($endDate)->subMinutes(1);


        if ($request->isMethod('post')) {
            $conflictingEvents = Event::where('room_id', $roomId)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                })
                ->get();

            if ($conflictingEvents->isNotEmpty()) {
                return response()->json(['message' => 'Room is already reserved during this time.'], 409);
            }
        } elseif ($request->isMethod('put')) {
            if (is_null($roomId) && is_null($startDate) && is_null($endDate)) {
                return $next($request);
            }

            $event = Event::find($eventId);
            if (!$event) {
                return response()->json(['message' => 'Event not found'], 404);
            }

            $roomId = $roomId ?? $event->room_id;
            $startDate = $startDate ? Carbon::parse($startDate) : $event->start_date;
            $endDate = $endDate ? Carbon::parse($endDate) : $event->end_date;

            $conflictingEvents = Event::where('room_id', $roomId)
                ->where('id', '!=', $eventId)
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->where(function ($subQuery) use ($startDate, $endDate) {
                        $subQuery->whereBetween('start_date', [$startDate, $endDate])
                            ->orWhereBetween('end_date', [$startDate, $endDate]);
                    })
                    ->orWhere(function ($subQuery) use ($startDate, $endDate) {
                        $subQuery->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
                })
                ->get();

            if ($conflictingEvents->isNotEmpty()) {
                return response()->json(['message' => 'Room is already reserved during this time.'], 409);
            }
        }

        return $next($request);
    }
}
