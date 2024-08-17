<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

use App\Services\MessageBuffer;
use App\Events\MessageSent;

class MessageController extends Controller
{
    protected $messageBuffer;

    public function __construct(MessageBuffer $messageBuffer)
    {
        $this->messageBuffer = $messageBuffer;
    }

    public function index(Request $request)
    {
        $perPage = 100;
        $page = $request->get('page', 1);
        $offset = ($page - 1) * $perPage;

        $messages = $this->messageBuffer->getMessages($offset, $perPage);
        $totalMessages = $this->messageBuffer->getMessageCount();

        return response()->json([
            'data' => $messages,
            'current_page' => $page,
            'last_page' => ceil($totalMessages / $perPage),
        ]);
    }

    public function store(Request $request)
    {
        $message = Message::create([
            'username' => $request->username,
            'message'  => $request->message,
        ]);

        // Push the new message to the buffer
        $this->messageBuffer->pushMessage($message);

        // Offload broadcasting to a queue (make sure the job is dispatched quickly)
        broadcast(new MessageSent($message))->toOthers();

        return response(status: 200);
        // return response()->json($message);
    }
}
