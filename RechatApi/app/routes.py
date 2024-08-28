from math import ceil
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app import crud
from app.database import database

router = APIRouter()

# store all connected clients
clients: list[WebSocket] = []


@router.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()
    clients.append(websocket)

    # create user, if not exists
    user = await crud.get_user_by_username(username)

    if not user:
        user = await crud.create_user(username=username)

    try:
        while True:
            data = await websocket.receive_text()
            msg = await crud.create_message(user_id=user["id"], message=data)

            msg_response = {
                "data": {
                    "id": msg["id"],
                    "message": data,
                    "timestamp": msg["timestamp"],
                    "user": {
                        "from": username,
                    },
                },
                "event": {
                    "type": "message",
                }
            }

            # send message to all connected clients
            for client in clients:
                await client.send_text(json.dumps(msg_response))

    except WebSocketDisconnect:
        clients.remove(websocket)


@router.get("/messages")
async def get_messages(
    page: int = Query(1, ge=1),
    per_page: int = Query(100, le=100)
):
    offset = (page - 1) * per_page
    _messages = await crud.get_messages(offset=offset, limit=per_page)
    total_messages = await crud.get_message_count()

    messages = []

    for message in _messages:
        msg = {
            "id": message["id"],
            "user_id": message["user_id"],
            "message": message["message"],
            "timestamp": message["timestamp"],
            "user": {
                "from": message["username"],
            }
        }

        messages.append(msg)

    return {
        "data": messages,
        "current_page": page,
        "last_page": ceil(total_messages / per_page)
    }
