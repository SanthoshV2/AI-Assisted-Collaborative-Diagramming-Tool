from fastapi import FastAPI, HTTPException
from websocket import router as websocket_router
from fastapi.middleware.cors import CORSMiddleware
from db import supabase
from sync import create_or_sync_user
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(websocket_router)



@app.get("/")
async def root():
    return {"message": "FastAPI Drawing WebSocket is running"}


@app.get("/test_db")
async def test_db_connection():
    try:
        response = supabase.table("users").select("*").limit(1).execute()
        return {"status": "DB connected", "data_preview": response.data}
    except Exception as e:
        return {"status": "DB connection failed", "error": str(e)}


@app.get("/sync_user/{clerk_user_id}/{email}/{full_name}")
async def sync_user(clerk_user_id: str, email: str, full_name: str):
    user = create_or_sync_user(clerk_user_id, email, full_name)
    if not user:
        raise HTTPException(status_code=400, detail="Failed to sync user")
    return user


@app.get("/users")
async def get_all_users():
    try:
        response = supabase.table("users").select("*").execute()
        return {"status": "success", "users": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
