// A simple WebSocket manager to connect frontend with backend for real-time updates.

class SocketManager {
  constructor() {
    this.ws = null;              // the actual WebSocket connection
    this.roomId = null;          // current room ID
    this.user = null;            // current user info
    this.callbacks = {};         // event -> [callbacks]
    this.reconnectAttempts = 0;  // for retrying if disconnected
  }

  /**
   * Connect to a WebSocket room
   * @param {string} roomId - The room identifier
   * @param {object} user - Current user info
   * @param {string|null} token - Optional authentication token
   */
  connect(roomId, user, {token = null} = {}) {
    // safety check
    if (!roomId) {
      console.error("Cannot connect: roomId is missing");
      return;
    }

    console.log("socketManager: connecting to room", roomId);
    this.roomId = roomId;
    this.user = user;

    // Base URL for WebSocket server
    const baseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

    // Example: ws://localhost:8000/ws/room123?token=abc123
    let url = `${baseUrl}/ws/${encodeURIComponent(roomId)}`;
    if (token) url += `?token=${encodeURIComponent(token)}`;

    console.log("Connecting to:", url);
    this.ws = new WebSocket(url);

    // Connection opened
    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0; // reset retry counter

      // Inform the server we joined
      this.send("join", { user });
    };

    // Handle incoming messages
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const type = message.type;

        // Run all callbacks registered for this event type
        if (type && this.callbacks[type]) {
          this.callbacks[type].forEach(cb => cb(message));
        }
      } catch (err) {
        console.error("Invalid message from server:", event.data, err);
      }
    };

    // Connection closed
    this.ws.onclose = () => {
      console.warn("WebSocket closed");

      // Try reconnecting (up to 5 times)
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= 5) {
        const retryDelay = 1000 * this.reconnectAttempts; // 1s, 2s, 3s...
        console.log(`Reconnecting in ${retryDelay / 1000}s...`);

        setTimeout(() => {
          this.connect(roomId, user, token);
        }, retryDelay);
      }
    };

    // Error handling
    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return this;
  }

  /**
   * Leave the room and close WebSocket
   */
  leaveRoom() {
    if (this.ws) {
      try {
        this.send("leave", {}); // tell server we left
      } catch (_) {}

      console.log("Leaving room", this.roomId);
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribe to a server event
   */
  on(event, callback) {
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event].push(callback);
  }

  /**
   * Unsubscribe from a server event
   */
  off(event, callback) {
    if (!this.callbacks[event]) return;

    if (callback) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    } else {
      delete this.callbacks[event];
    }
  }

  /**
   * Send a message to server
   */
  send(type, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send, WebSocket not open:", type, payload);
      return;
    }

    const message = { type, ...payload };
    this.ws.send(JSON.stringify(message));
  }

  // ===== Helper methods for common actions =====

  sendCursor(position) {
    this.send("cursor-update", { position });
  }

  addElement(element) {
    this.send("element-added", { element });
  }

  updateElement(elementId, updates) {
    this.send("element-updated", { elementId, updates });
  }

  clearCanvas() {
    this.send("clear-canvas");
  }

  requestAI(prompt, data) {
    this.send("ai-request", { prompt, data });
  }
}

// Export as a single instance
const socketManager = new SocketManager();
export default socketManager;



