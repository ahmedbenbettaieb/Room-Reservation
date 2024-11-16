<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TestController extends Controller
{

    public function test(){
        try{

            $user =[
                'name' => 'test',
                'email' => 'test@example.com',
            ];

            self::sendWelcomeEmail($user,'test');
        }catch(Exception $e){
            return $e->getMessage();
        }

    }
     public static function sendWelcomeEmail($user, $password)
    {
        $details = [
            'title' => 'Welcome to the platform!',
            'body' => "Hello {$user['name']}, your account has been created with the following credentials:",
            'email' => $user['email'],
            'password' => $password,
        ];

        Mail::to($user['email'])->send(new \App\Mail\WelcomeMail($details));


    }
}
