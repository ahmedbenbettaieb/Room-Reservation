<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Models\Event;
use App\Models\Room;

class EventInvitation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $event;

    public $room;


    /**
     * Create a new message instance.
     *
     * @param Event $event
     * @return void
     */
    public function __construct(Event $event , $room)
    {
        $this->event = $event;
        $this->room = $room;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

            return $this->subject('You Are Invited to an Event')
            ->view('emails.eventInvitation')
            ->with([
                'title' => $this->event->title,
                'start_date' => $this->event->start_date,
                'end_date' => $this->event->end_date,
                'room' => $this->room,
                'description' => $this->event->description,
            ]);


    }

    //can we queue the email right here ?

}
