<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;

    public function __construct($details)
    {
        $this->details = $details;
    }

    public function build()
    {
        try {
            //code...
            return $this->subject('Welcome to Our Platform')
                    ->view('emails.welcome');

        } catch (\Throwable $th) {
            //throw $th;
            Log::error($th->getMessage());
            exit;
        }
        
    }
}
