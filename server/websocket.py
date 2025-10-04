from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import json
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.rooms = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        self.rooms[room_id].append((websocket, user_id))
        await self.broadcast(room_id, {"type": "user-joined", "userId": user_id})
        await self.broadcast_users(room_id)

    def disconnect(self, websocket: WebSocket, room_id: str):
        connections = self.rooms.get(room_id, [])
        for ws, uid in connections:
            if ws == websocket:
                connections.remove((ws, uid))
                break
        if not connections:
            self.rooms.pop(room_id, None)

    async def broadcast(self, room_id: str, message: dict):
        for ws, _ in list(self.rooms.get(room_id, [])):
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                self.disconnect(ws, room_id)

    async def broadcast_users(self, room_id: str):
        users = [{"id": uid} for _, uid in self.rooms.get(room_id, [])]
        await self.broadcast(room_id, {"type": "room-users", "users": users})

manager = ConnectionManager()

# --- WebSocket Endpoint ---
@app.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await manager.connect(websocket, room_id, user_id)

    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            # AI Request
            if data.get("type") == "ai-request":
                print(f"📨 AI request from {data['user']['name']} in room {room_id}")
                user_elements = data.get("elements", [])

                try:
                    if user_elements:
                        first = user_elements[0]
                        x_start = first.get("startX") or (first.get("points")[0]["x"] if first.get("points") else 50)
                        y_start = first.get("startY") or (first.get("points")[0]["y"] if first.get("points") else 50)
                        x_end = first.get("endX") or (first.get("points")[-1]["x"] if first.get("points") else x_start+100)
                        y_end = first.get("endY") or (first.get("points")[-1]["y"] if first.get("points") else y_start+100)

                        width = abs(x_end - x_start)
                        height = abs(y_end - y_start)

                        ai_suggestion = [
                            {
                                "id": f"ai-{int(time.time()*1000)}",
                                "type": "oval",
                                "x": min(x_start, x_end),
                                "y": min(y_start, y_end),
                                "width": width,
                                "height": height,
                                "color": "#3b82f6",
                                "backgroundColor": "transparent",
                                "strokeWidth": 2
                            }
                        ]
                        print("🤖 Gemini structured suggestion:", ai_suggestion)
                    else:
                        ai_suggestion = []

                except Exception as e:
                    print("⚠️ Gemini AI error:", e)
                    ai_suggestion = []

                # --- Broadcast AI suggestions to frontend ---
                await manager.broadcast(room_id, {
                    "type": "ai-suggestions",
                    "suggestions": ai_suggestion
                })

            else:
                # Broadcast other drawing events
                await manager.broadcast(room_id, data)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast(room_id, {"type": "user-left", "userId": user_id})
        await manager.broadcast_users(room_id)
