<?php

namespace App\Jobs;

use App\Mail\EventInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEventInvitation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $event;
    public $room;
    public $email;

    /**
     * Create a new job instance.
     *
     * @param $event
     * @param $room
     */
    public function __construct($event, $roomName, $email)
    {
        $this->event = $event;
        $this->room = $roomName;
        $this->email = $email;
    }

    public function handle()
    {
        Mail::to($this->email)->send(new EventInvitation($this->event, $this->room));
    }
}
