from sqlalchemy import select

from .models import users, messages
from .database import database

async def get_user_by_username(username: str):
    query = users.select().where(users.c.username == username)
    return await database.fetch_one(query)

async def create_user(username: str):
    query = users.insert().values(username=username)
    user_id = await database.execute(query)
    return { "id": user_id, "username": username }

async def create_message(user_id: int, message: str):
    query = messages.insert().values(user_id=user_id, message=message)
    message_id = await database.execute(query)

    fetch_query = (
        select(messages.c.timestamp)
        .where(messages.c.id == message_id)
    )
    res = await database.fetch_one(fetch_query)

    return { "id": message_id, "user_id": user_id, "message": message, "timestamp": str(res["timestamp"]) }

async def get_messages(limit: int = 10, offset: int = 0):
    query = (
        select(users.c.username, messages)
        .select_from(messages.join(users, users.c.id == messages.c.user_id))
        .order_by(messages.c.timestamp.desc())
        .offset(offset)
        .limit(limit)
    )

    return await database.fetch_all(query)

async def get_message_count():
    query = "SELECT COUNT(*) FROM messages;"
    return await database.fetch_val(query)
