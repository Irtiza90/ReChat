<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index()
    {
        // TODO: set a limit to messages
        return Message::all();
    }

    public function store(Request $request)
    {
        $message = new Message;
        $message->username = $request->username;
        $message->message = $request->message;
        $message->save();

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}
