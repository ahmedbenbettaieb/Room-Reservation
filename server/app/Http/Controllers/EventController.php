<?php

namespace App\Http\Controllers;

use App\Jobs\SendEventInvitation;
use App\Jobs\SendEventUpdate;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Mail\EventInvitation;
use App\Mail\UpdateEventMail;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function _construct()
    {
        $this->middleware('auth:api');
    }




    public function reserveAvailableRoom(Request $request)
    {
        try {
            //validate entry

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'room_id' => 'required|integer',
                'participants' => 'sometimes|array',
            ]);
            if($validator->fails()){
                return response()->json(['errors' => $validator->errors(), 'success' => false], 400);
            }
            $invitationMessages=[];
            $room = Room::find($request->room_id);
            if ($room) {

                $startDateTime = Carbon::parse($request->start_date);
                $endDateTime = Carbon::parse($request->end_date);
                $estimatedDuration = $endDateTime->diffInMinutes($startDateTime);


                    $event = new Event();
                    $event->title = $request->title;
                    $event->start_date = $startDateTime;
                    $event->end_date = $endDateTime;
                    $event->estimated_duration = $estimatedDuration;
                    $event->description = $request->description;
                    $event->room_id = $request->room_id;
                    $event->user_id = auth()->user()->id;
                    $event->status ="confirmed";
                    $event->save();
                    if($request->participants){
                        foreach ($request->participants as $participant) {
                            $message=$this->inviteParinticipants($event->id, $participant);
                            $invitationMessages[]=[
                                'message'=>$message,
                            ];
                        }
                    }


                    return response()->json(['message' => 'Room reserved successfully', 'success' => true ,'inviations'=> $invitationMessages], 201);

            } else {
                return response()->json(['message' => 'Room not available', 'success' => false], 400);
            }
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }



    public function updateEvent(Request $request, $event_id)
{
    try {
        $data=$request->json()->all();

        $event = Event::find($event_id);
        $alreadyInvitedParticipants = Participant::where('event_id', $event_id)->pluck('user_id')->toArray();

        if (!$event) {
            return response()->json(['message' => 'Event not found', 'success' => false], 404);
        }

        if ($request->has('title')) {
            $event->title = $request->title;
        }
        if ($request->has('description')) {
            $event->description = $request->description;
        }
        $idsToNotSendEmailTo = [];



        $startDate = $request->has('start_date') ? Carbon::parse($request->input('start_date')) : $event->start_date;
        $endDate = $request->has('end_date') ? Carbon::parse($request->input('end_date')) : $event->end_date;
        $roomId = $request->has('room_id') ? $request->input('room_id') : $event->room_id;

        if ($roomId && !Room::find($roomId)) {
            return response()->json(['message' => 'Room not found', 'success' => false], 404);
        }
        $invitationMessages=[];
        $event->start_date = $startDate;
        $event->end_date = $endDate;
        $event->room_id = $roomId;
        $event->estimated_duration = Carbon::parse($event->end_date)->diffInMinutes(Carbon::parse($event->start_date));


        $event->save();
        if($request->has('participants')){
            $idsToNotSendEmailTo = $data['participants'];

            foreach ($request->participants as $participant) {
               $message= $this->inviteParinticipants($event->id, $participant);
               $invitationMessages[]=[
                   'message'=>$message,
               ];
            }
        }
        self::updateEventSendEmailToAlreadyInvitedParticipants($alreadyInvitedParticipants, $idsToNotSendEmailTo, $event);

        return response()->json(['message' => 'Event updated successfully', 'success' => true, 'data' => $event ,"invitations"=> $invitationMessages ], 200);

    } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage(), 'success' => false ,'error' => 'error'], 500);
    }
}






    public function getAllEvents()
    {
        try {


            //there's room id , search with it for room name
            $events = Event::with('room','participants')->get();
            return response()->json($events, 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function deleteEvent($id)
    {
        try {

            $event = Event::find($id);
            if (!$event) return response()->json(['message' => 'Event not found', 'success' => false], 404);
            $event->delete();
            return response()->json(['message' => 'Event deleted successfully', 'success' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }

    private function checkRoomAvailabilityInTheRange($start_date, $end_date, $room_id)
    {
        $events = Event::where('room_id', $room_id)
            ->whereBetween('start_date', [$start_date, $end_date])
            ->orWhereBetween('end_date', [$start_date, $end_date])
            ->get();
        return $events->count() == 0;
    }


    public function getAllParticipantsForOneEvent($event_id){
        try {
            $event = Event::find($event_id);
            if (!$event) {
                return response()->json(['message' => 'Event not found', 'success' => false], 400);
            }
            $participants = Participant::with('user')->where('event_id', $event_id)->get();
            return response()->json(['message' => 'Participants retrieved successfully', 'success' => true ,'data' => $participants], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function getAllEventsForOneUser(){

        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'User not found', 'success' => false], 400);
            }
            $participants = Participant::with('event')->where('user_id', $user->id)->get();
            return response()->json(['message' => 'Events retrieved successfully', 'success' => true ,'data' => $participants], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function participate($event_id){

        try {
            $user = auth()->user();
            $event = Event::find($event_id);
            if (!$event) {
                return response()->json(['message' => 'Event not found', 'success' => false], 400);
            }
            $alreadyParticipant =Participant::where('user_id', $user->id)->where('event_id', $event_id)->first();
            if ($alreadyParticipant) {
                return response()->json(['message' => 'You are already a participant of this event', 'success' => false], 400);
            }
            $busyInTheSameTime = self::alreadyParticipatedInOtherEventInTheSameTime($event_id, $user->id);
            if (!$busyInTheSameTime) {
                return response()->json(['message' => 'You are participating in another event in the same time', 'success' => false], 400);
            }

            $participant=new Participant();
            $participant->user_id = $user->id;
            $participant->event_id = $event_id;
            $participant->save();
            return response()->json(['message' => 'You are now a participant of this event', 'success' => true], 200);

        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }

    }

    public function inviteParinticipants($event_id, $user_id ){
        try {


            $event = Event::find($event_id);
            if (!$event) {
               return "Event not found";
            }
            $userToInvite = User::find($user_id);
            if (!$userToInvite) {
               return "User not found";
            }
            $participant = Participant::where('user_id', $user_id)->where('event_id', $event_id)->first();
            if ($participant) {
             return  "User ".$userToInvite->name." is already a participant of this event";
            }
            if(!self::alreadyParticipatedInOtherEventInTheSameTime($event_id, $user_id)){
                 return"User ".$userToInvite->name." is participating in another event in  the same time";
            }
            $room=Room::find($event->room_id);
            $roomName=$room['name'];

            SendEventInvitation::dispatch($event, $room->name, $userToInvite->email);

            $participant = new Participant();
            $participant->user_id = $user_id;
            $participant->event_id = $event_id;
            $participant->save();

            return "Invitation sent successfully to ".$userToInvite->name;



        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    static function updateEventSendEmailToAlreadyInvitedParticipants($participantIds = [], $newParticipantIDs = [],$event)
    {
        try {
            $participantIdsToSendUpdate = array_intersect($newParticipantIDs, $participantIds);


            foreach ($participantIdsToSendUpdate as $participantId) {
                $participant = Participant::find($participantId);

                if ($participant) {
                    $roomName = Room::find($event->room_id)->name;


                    SendEventUpdate::dispatch($event, $roomName, $participant->user->email);
                }
            }

            return response()->json(['message' => 'Update emails sent successfully', 'success' => true], 200);

        } catch (\Throwable $th) {
            Log::error("Error in updateEventSendEmailToAlreadyInvitedParticipants: " . $th->getMessage());
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }





    public static function alreadyParticipatedInOtherEventInTheSameTime($event_id, $user_id)
    {
        $participantUser=Participant::where('user_id', $user_id)->get();
        if($participantUser->isEmpty()){
            return true;
        }
        $actualEvent=Event::find($event_id);

        $events = Event::where('id', '!=', $event_id)->get();

        foreach ($events as $event) {
            if ($actualEvent->start_date <= $event->start_date && $actualEvent->end_date >= $event->end_date) {
                $participant = Participant::where('user_id', $user_id)->where('event_id', $event->id)->first();
                if ($participant) {
                    return false;
                }
            }
        }

        return true;
    }









}
