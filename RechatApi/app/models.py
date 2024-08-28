from sqlalchemy import Table, Column, Integer, String, ForeignKey, DateTime, func
from .database import metadata

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), unique=True, index=True),
    Column("created_at", DateTime, default=func.now(), nullable=False),
)

messages = Table(
    "messages",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("message", String(255), nullable=False),
    Column("timestamp", DateTime, default=func.now(), nullable=False),
)
