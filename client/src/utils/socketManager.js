// Simple mock socket manager for the canvas 
// In a real implementation, this would use Socket.io or another WebSocket library

class SocketManager {
  constructor() {
    this.connected = false;
    this.currentUser = null;
    this.callbacks = {};
    this._hasSimulatedCursor = false;
  }

  connect() {
    this.connected = true;
    console.log('Socket connected (simulated)');
    return this;
  }

  disconnect() {
    this.connected = false;
    this.callbacks = {};
    console.log('Socket disconnected (simulated)');
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
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    } else {
      delete this.callbacks[event];
    }
  }

  emit(event, data) {
    console.log(`Emitting ${event}:`, data);
    // In a real app, this would send to the server
    
    // Special handling for cursor updates - simulate broadcasting to other users
    if (event === 'cursor-update') {
      // Simulate server broadcasting the cursor position back
      // In a real app, this would go to the server first and then to other clients
      setTimeout(() => {
        // Create a simulated user cursor if none exists
        if (!this._hasSimulatedCursor) {
          this._hasSimulatedCursor = true;
          
          const simulatedPosition = {
            x: Math.random() * 800,
            y: Math.random() * 500
          };
          
          // Send simulated cursor update
          this._trigger('cursor-update', {
            userId: 'simulated-user',
            position: simulatedPosition,
            name: 'Simulated User',
            color: '#FF5722'
          });
          
          // Move simulated cursor every few seconds
          setInterval(() => {
            const newPosition = {
              x: Math.random() * 800, 
              y: Math.random() * 500
            };
            
            this._trigger('cursor-update', {
              userId: 'simulated-user',
              position: newPosition,
              name: 'Simulated User',
              color: '#FF5722'
            });
          }, 3000);
        }
      }, 500);
    }

    // For AI requests
    if (event === 'ai-request') {
      setTimeout(() => {
        this._simulateAIResponse(data);
      }, 1500);
    }
  }

  _simulateAIResponse(request) {
    const { prompt, roomId } = request;

    const room = roomId || (request.options && request.options.rommId) || "unknow-room";

    console.log(`Simulating AI response for: "${prompt}" in room: ${room}`);
    
    // Generate a mock element based on the prompt
    const element = {
      id: Date.now() + Math.random(),
      type: 'ai-text',
      text: `AI response for: "${prompt}"`,
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      backgroundColor: '#e6f7ff',
      color: '#0066cc'
    };

    // Trigger callbacks for ai-element event
    this._trigger('ai-element', { element });
  }

  _trigger(event, data) {
    if (!this.callbacks[event]) return;
    this.callbacks[event].forEach(callback => callback(data));
  }

  joinRoom(roomId, userInfo) {
    this.currentUser = userInfo.id;
    console.log(`Joining room ${roomId} as user:`, userInfo);
    
    // Simulate room joined event
    setTimeout(() => {
      this._trigger('room-users', { 
        users: [userInfo, { id: 'simulated-user', name: 'Simulated User' }] 
      });
    }, 300);
  }

  leaveRoom() {
    this.currentUser = null;
  }

  addElement(element) {
    console.log('Adding element:', element);
    // Simulate sending to server and others
    // In a real implementation this would emit to server
    
    // For demo, we'll simulate a local event to show it works
    if (element.action === 'start' || element.action === 'end') {
      this._trigger('element-added', { element });
    }
  }

  updateElement(elementId, updates) {
    console.log('Updating element:', elementId, updates);
    // Simulate sending to server and others
    this._trigger('element-updated', { elementId, updates });
  }

  clearCanvas() {
    console.log('Clearing canvas');
    this._trigger('canvas-cleared', { userId: this.currentUser });
    this._trigger('clear-canvas', {});
  }

  requestAISuggestion(prompt, data) {
    console.log('Requesting AI suggestion:', prompt, data);
    this.emit('ai-request', { prompt, ...data });
  }
}

const socketManager = new SocketManager();
export default socketManager;