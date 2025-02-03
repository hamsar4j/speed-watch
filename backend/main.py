from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.summary import router as summary_router
from api.chat import router as chat_router
from database.db import init_db

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(summary_router)
app.include_router(chat_router)