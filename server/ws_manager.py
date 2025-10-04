
import json
from typing import Dict, List, Optional
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # rooms: room_id -> list of websockets
        self.rooms: Dict[str, List[WebSocket]] = {}
        # optional: keep metadata per socket (user info)
        self.meta: Dict[WebSocket, dict] = {}

    async def connect(self, room_id: str, websocket: WebSocket, user_meta: Optional[dict] = None):
        await websocket.accept()
        self.rooms.setdefault(room_id, []).append(websocket)
        if user_meta:
            self.meta[websocket] = user_meta

    async def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms and websocket in self.rooms[room_id]:
            self.rooms[room_id].remove(websocket)
        if websocket in self.meta:
            del self.meta[websocket]

    async def broadcast(self, room_id: str, message: dict, exclude: Optional[WebSocket] = None):
        """Broadcast message to all sockets in room_id except exclude"""
        text = json.dumps(message)
        for ws in list(self.rooms.get(room_id, [])):
            if ws is exclude:
                continue
            try:
                await ws.send_text(text)
            except Exception:
                # if a send fails, remove socket
                await self.disconnect(room_id, ws)

