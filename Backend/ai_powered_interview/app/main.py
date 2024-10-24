# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from contextlib import asynccontextmanager
from app.routers import categories, session, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler to create database tables on startup.
    """
    create_db_and_tables()  # Initialize the database and create tables
    yield

app = FastAPI(
    lifespan=lifespan,
    title="Interview Management Microservice",
    version="1.0.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",  # Frontend URL
    "http://127.0.0.1:3000",
    # Add other allowed origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies to be sent
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(session.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Interview Management API"}
