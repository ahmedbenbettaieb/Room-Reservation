<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\Room;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UpdateEventMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $event;
    public $room;

    public function __construct( Event $event , $room)
    {
        $this->event = $event;
        $this->room = $room;


    }
   
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build( )
    {
        return $this->subject('Event'.$this->event->title .'Updated')
        ->view('emails.eventUpdate')
        ->with([
            'start_date' => $this->event->start_date,
            'end_date' => $this->event->end_date,
            'room' => $this->room,
            'title' => $this->event->title
        ]);

    }
}
