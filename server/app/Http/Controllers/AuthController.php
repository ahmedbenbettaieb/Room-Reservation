<?php

namespace App\Http\Controllers;

use App\Jobs\SendWelcome;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Namshi\JOSE\JWT;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\JWTAuth as JWTAuthJWTAuth;

class AuthController extends Controller
{

    public function _construct()
    {
        $this->middleware('auth.middleware', ['except' => ['login', 'register ', 'ConfirmCode','refreshToken']]);
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'success' => false], 400);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials', 'success' => false], 401);
        }

        return $this->createNewToken($token);
    }
    public function createNewToken($token)
    {
        $user = auth()->user();

        $refreshTokenTTL = config('jwt.refresh_ttl');
        $refreshToken = JWTAuth::fromUser($user);

        JWTAuth::factory()->setTTL(config('jwt.ttl'));

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL(),
            'user' => $user,
            'refresh_token' => $refreshToken,
            'success' => true
        ], 200);
    }

    public function profile(){
        return response()->json(auth()->user());
    }
    public function createUser(Request $request)
    {
        if (auth()->user()->role !== 'superUser') {
            return response()->json(['error' => 'Unauthorized', 'success' => false], 403);
        }

        // Validate the new user data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => 'required|string|in:user,admin,superUser',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'success' => false]);
        }
        $generatedPassword=bin2hex(random_bytes(10));

        // Create the new user
        $user=New User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($generatedPassword);
        $user->role = $request->role;
        $user->save();

        $this->sendWelcomeEmail($user, $generatedPassword);

        return response()->json(['message' => 'User created and email sent successfully', 'success' => true]);
    }
    public static function sendWelcomeEmail($user, $password)
    {
        $details = [
            'title' => 'Welcome to the platform!',
            'body' => "Hello {$user->name}, your account has been created with the following credentials:",
            'email' => $user->email,
            'password' => $password,
        ];

        // Mail::to($user->email)->send(new \App\Mail\WelcomeMail($details));
        SendWelcome::dispatch($user, $details);


    }





    public function refreshToken()
    {
        try {

            $token= JWTAuth::getToken();
            $token= JWTAuth::refresh($token);


            return  $this->createNewToken($token);

        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }


    }

    public function logout()
    {
        try {
            JWTAuth::invalidate();
            return response()->json(['message' => 'User successfully signed out', 'success' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);
        }
    }
    public function getUsers(){
        try {
            $superUser=auth()->user();


            $users=User::all();
            return response()->json($users, 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(), 'success' => false], 500);

        }

    }



}
