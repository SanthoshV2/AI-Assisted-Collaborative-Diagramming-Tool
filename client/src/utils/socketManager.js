// socketManager.js
// Real WebSocket manager for collaborative drawing (FastAPI backend)

const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws";

class SocketManager {
  constructor() {
    this.connected = false;
    this.currentUser = null;
    this.callbacks = {};
    this.socket = null;
  }

  connect(roomId, userId) {
    if (this.socket && this.connected) return;

    this.socket = new WebSocket(`${WS_URL}/${roomId}/${userId}`);

    this.socket.onopen = () => {
      this.connected = true;
      this.currentUser = userId;
      console.log("✅ Connected to WebSocket");
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && this.callbacks[data.type]) {
          this.callbacks[data.type].forEach((cb) => cb(data));
        }
      } catch (err) {
        console.error("❌ Failed to parse WS message:", event.data, err);
      }
    };

    this.socket.onclose = () => {
      this.connected = false;
      console.log("❌ WebSocket closed");
    };

    this.socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };
  }

  disconnect() {
    this.connected = false;
    this.callbacks = {};
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (!this.callbacks[event]) return;
    if (callback) {
      this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback);
    } else {
      delete this.callbacks[event];
    }
  }

  emit(event, data) {
    if (this.socket && this.connected && this.socket.readyState === WebSocket.OPEN) {
      const payload = { type: event, ...data };
      this.socket.send(JSON.stringify(payload));
    } else {
      console.error();
    }
  }

  joinRoom(roomId, userInfo) {
    this.currentUser = userInfo.id;
    this.emit("join-room", { roomId, user: userInfo });
  }

  leaveRoom() {
    this.emit("leave-room", { userId: this.currentUser });
    this.currentUser = null;
  }

  addElement(element) {
    const enrichedElement = { ...element, userId: this.currentUser };
    this.emit("element-added", { element: enrichedElement });
  }

  updateElement(elementId, updates) {
    this.emit("element-updated", { elementId, updates });
  }

  clearCanvas() {
    this.emit("canvas-cleared", { userId: this.currentUser });
  }

  // === AI Related ===
  requestAISuggestion(prompt, data) {
    this.emit("ai-request", { prompt, ...data });
  }
}

const socketManager = new SocketManager();
export default socketManager;
