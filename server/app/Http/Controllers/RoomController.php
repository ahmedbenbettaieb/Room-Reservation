<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{

    public function addRoom(Request $request)
    {
        try {


            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'capacity' => 'required|integer',
                'description' => 'required|string',
                'amenities' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors(), 'success' => false], 400);
            }


            $room = new Room();
            $room->name = $request->name;
            $room->status = "available";
            $room->capacity = $request->capacity;
            $room->description = $request->description;
            $room->amenities = $request->amenities;
            $room->created_at = now();
            $room->updated_at = now();
            $room->save();
            return response()->json(['message' => 'Room added successfully', 'success' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function getAllRooms()
    {
        try {

            $rooms = Room::all();
            return response()->json($rooms);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function deleteRoom($id)
    {
        try {
            $room = Room::find($id);
            if (!$room) return response()->json(['message' => 'Room not found', 'success' => false], 404);
            $room->delete();
            return response()->json(['message' => 'Room deleted successfully', 'success' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }

    public function updateRoom(Request $request, $id)
    {
        try {
            $room = Room::find($id);
            if (!$room) return response()->json(['message' => 'Room not found', 'success' => false], 404);
               $room->name = $request->name ? $request->name : $room->name;
            $room->capacity = $request->capacity ? $request->capacity : $room->capacity;
            $room->description = $request->description ? $request->description : $room->description;
            $room->amenities = $request->amenities ? $request->amenities : $room->amenities;
            $room->updated_at = now();
            $room->save();
            return response()->json(['message' => 'Room updated successfully', 'success' => true , 'room' => $room], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
}
