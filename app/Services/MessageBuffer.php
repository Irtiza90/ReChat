<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\Log;

class MessageBuffer
{
    protected $buffer = [];
    protected $maxMessages = 100;

    public function pushMessage(Message $message): void
    {
        // Append message to buffer
        $this->buffer[] = $message;

        // If the buffer limit has reached, pop the first (oldest) message
        if (count($this->getBuffer()) > $this->maxMessages) {
            array_shift($this->buffer);
        }
    }

    /**
     * get a slice of the buffer based on the offset and limit
     */
    public function getMessages($offset = 0, $limit = 20): array
    {
        return array_slice($this->getBuffer(), $offset, $limit);
    }

    public function getBuffer() {
        // if the buffer is empty, load from the database
        if (empty($this->buffer)) {
            $this->getMessagesOnBufferFail();
        }

        return $this->buffer;
    }

    /**
     * The buffer may be empty in case cases, eg: when the app starts.
     * To prevent this we loa messages from the database and store them in the buffer.
     */
    private function getMessagesOnBufferFail(): void {
        Log::debug('HIT: MessageBuffer::getMessagesOnBufferFail()');

        $messages = Message::latest()
            ->limit($this->maxMessages)
            ->get()
            ->reverse(); // reverse the order to have the oldest messages first in the buffer.

        foreach ($messages as $message) {
            $this->pushMessage($message);
        }
    }

    public function getMessageCount(): int
    {
        return count($this->getBuffer());
    }
}
