from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from api.database import database
from api.routes import router
from api.config import Settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # run before app starts
    await database.connect()
    # app context
    yield
    # run before app exit
    await database.disconnect()


app = FastAPI(lifespan=lifespan)
app.include_router(router)
settings = Settings()

print(settings.dict())
print(settings.react_app_url)

# allowed URL origins
origins = [
    "http://localhost:5173/",
    settings.react_app_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
