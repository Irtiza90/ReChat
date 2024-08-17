<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MessageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/messages',  [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);

Route::get('/test-broadcast', function () {
    broadcast(new \App\Events\MessageSent(\App\Models\Message::first()));
});
