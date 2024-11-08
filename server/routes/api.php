<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group([ 'prefix' => 'auth'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('profile', [AuthController::class, 'profile'])->middleware('auth.middleware');
    Route::post('/create-user', [AuthController::class, 'createUser'])->middleware('auth.middleware');
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::post('logout',[AuthController::class, 'logout'])->middleware('auth.middleware');
    Route::get('get-users', [AuthController::class, 'getUsers'])->middleware('auth.middleware');



});

// Separate group for event-related routes
Route::group(['middleware' => 'auth.middleware' , 'prefix' => 'event'], function () {
    Route::post('reserve-room', [EventController::class, 'reserveAvailableRoom'])->middleware('check.room.availability');
    Route::get('get-all-events', [EventController::class, 'getAllEvents']);
    Route::delete('delete-event/{id}', [EventController::class, 'deleteEvent']);
    Route::put('update-event/{id}', [EventController::class, 'updateEvent'])->middleware('check.room.availability');
    route::post('participate/{id}', [EventController::class, 'participate']);
    route::post('invite-participants/{event_id}/{user_id}', [EventController::class, 'inviteParinticipants']);

});
Route::group(['middleware' => 'auth.middleware' , 'prefix' => 'room'], function () {
    Route::get('get-rooms', [RoomController::class, 'getAllRooms']);
    Route::post('add-room', [RoomController::class, 'addRoom']);
    Route::put('update-room/{id}', [RoomController::class, 'updateRoom']);
    Route::delete('delete-room/{id}', [RoomController::class, 'deleteRoom']);
});

