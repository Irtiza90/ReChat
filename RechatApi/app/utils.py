from app import crud


class MessageBuffer:
    def __init__(self):
        self.buffer = []
        self.max_messages = 100

    async def push_message(self, message: dict):
        self.buffer.append(message)
        if len(self.buffer) > self.max_messages:
            self.buffer.pop(0)  # Remove the oldest message

    async def get_messages(self, offset: int, limit: int) -> list[dict]:
        return self.buffer[offset:offset + limit]

    async def get_buffer(self) -> list[dict]:
        if not self.buffer:
            await self.load_messages_from_db()
        return self.buffer

    async def load_messages_from_db(self):
        messages = await crud.get_messages(offset=0, limit=self.max_messages)
        self.buffer = messages[::-1]  # Reverse the order

    async def get_message_count(self) -> int:
        return len(self.buffer)
