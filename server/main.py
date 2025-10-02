
import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from ws_manager import ConnectionManager

app = FastAPI()
manager = ConnectionManager()


# during dev allow front-end origin (Vite default 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_token(token: Optional[str]):
    """
    Stub: verify the token (Clerk or JWT).
    Return user dict, or raise HTTPException(401).
    We'll leave this as a stub until you confirm auth approach.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    # TODO: verify with Clerk or your own auth
    # Example return:
    # return {"id": "user_abc", "name": "Alice", "avatar": "..."}
    return {"id": "anon", "name": "Anonymous"}

@app.get("/")
async def root():
    return {"message": "Backend is running"}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: Optional[str] = None):
    # Note: browsers cannot set custom headers on WS handshake, so token usually passed as query param OR
    # client sends an initial 'auth' message after open. Here we accept token query param for simplicity.
    try:
        user = await verify_token(token)
    except HTTPException:
        # accept and then close
        await websocket.accept()
        await websocket.send_text(json.dumps({"type":"error","message":"auth required"}))
        await websocket.close(code=4001)
        return

    await manager.connect(room_id, websocket, user_meta=user)
    # notify room that user joined
    await manager.broadcast(room_id, {"type": "user-joined", "user": user}, exclude=websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            msg = json.loads(data_text)
            # Basic message routing by 'type'
            mtype = msg.get("type")
            if mtype == "cursor-update":
                # broadcast cursor to other users
                await manager.broadcast(room_id, {"type": "cursor-update", "userId": user["id"], "position": msg.get("position")}, exclude=websocket)
            elif mtype == "element-added":
                # persist later — for now broadcast
                await manager.broadcast(room_id, {"type": "element-added", "element": msg.get("element")}, exclude=websocket)
            elif mtype == "element-updated":
                await manager.broadcast(room_id, {"type": "element-updated", "elementId": msg.get("elementId"), "updates": msg.get("updates")}, exclude=websocket)
            elif mtype == "clear-canvas":
                # persist deletion later
                await manager.broadcast(room_id, {"type": "canvas-cleared", "userId": user["id"]}, exclude=None)
            elif mtype == "ai-request":
                # respond with an 'ai-element' after processing (for now: echo request)
                # In production: push to background worker and stream result
                prompt = msg.get("prompt")
                # placeholder AI response: you should implement a real call in a worker
                ai_element = {"id": "ai-1", "type": "group", "data": {"label": f"AI: {prompt}"}}
                await manager.broadcast(room_id, {"type": "ai-element", "element": ai_element}, exclude=None)
            else:
                # default broadcast
                await manager.broadcast(room_id, msg, exclude=websocket)
    except WebSocketDisconnect:
        await manager.disconnect(room_id, websocket)
        await manager.broadcast(room_id, {"type": "user-left", "userId": user["id"]})


