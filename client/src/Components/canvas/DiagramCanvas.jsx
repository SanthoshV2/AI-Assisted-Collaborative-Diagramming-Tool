import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import CanvasToolbar from './CanvasToolbar';
import GridBackground from './GridBackground';
import socketManager from '../../utils/socketManager';
import { Sparkles, X } from 'lucide-react';

const DiagramCanvas = () => {
  const { id: roomId } = useParams();
  const { user } = useUser();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [userCount, setUserCount] = useState(1);
  const [color, setColor] = useState('#3b82f6'); // blue
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState('pencil');
  const [drawing, setDrawing] = useState(false);
  const [elements, setElements] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiProcessing, setAIProcessing] = useState(false);
  
  const hasJoinedRef = useRef(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctxRef.current = ctx;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      redrawElements();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Connect to socket
  useEffect(() => {
    if (!user || !roomId) return;
    
    socketManager.connect();
    
    if (!hasJoinedRef.current) {
      const userInfo = {
        id: user.id,
        name: user.fullName || user.firstName || 'Anonymous',
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl
      };
      
      socketManager.joinRoom(roomId, userInfo);
      hasJoinedRef.current = true;
    }
    
    // Socket event listeners
    socketManager.on('room-users', ({ users }) => {
      setUserCount(users.length);
    });
    
    socketManager.on('user-joined', () => {
      setUserCount(prev => prev + 1);
    });
    
    socketManager.on('user-left', () => {
      setUserCount(prev => Math.max(1, prev - 1));
    });
    
    socketManager.on('element-added', ({ element }) => {
      if (element.userId === socketManager.currentUser) return;
      addElement(element, false);
    });
    
    socketManager.on('element-updated', ({ elementId, updates }) => {
      if (updates.userId === socketManager.currentUser) return;
      updateElement(elementId, updates, false);
    });
    
    socketManager.on('canvas-cleared', ({ userId }) => {
      if (userId === socketManager.currentUser) return;
      setElements([]);
    });
    
    socketManager.on('clear-canvas', () => {
      setElements([]);
    });
    
    socketManager.on('ai-element', ({ element }) => {
      addElement(element, false);
      setAIProcessing(false);
    });
    
    return () => {
      socketManager.off('room-users');
      socketManager.off('user-joined');
      socketManager.off('user-left');
      socketManager.off('element-added');
      socketManager.off('element-updated');
      socketManager.off('canvas-cleared');
      socketManager.off('clear-canvas');
      socketManager.off('ai-element');
      socketManager.leaveRoom();
    };
  }, [roomId, user]);

  // Update canvas when color or stroke width changes
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = strokeWidth;
    }
  }, [color, strokeWidth]);

  // Helper functions
  const getPointerPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Touch or mouse event
    const clientX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const addElement = (element, emit = true) => {
    setElements(prev => [...prev, element]);
    
    if (emit) {
      socketManager.addElement({
        ...element,
        roomId,
        userId: socketManager.currentUser
      });
    }
  };

  const updateElement = (id, updates, emit = true) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
    
    if (emit) {
      socketManager.updateElement(id, {
        ...updates,
        roomId,
        userId: socketManager.currentUser
      });
    }
  };

  const handleClearCanvas = () => {
    setElements([]);
    socketManager.clearCanvas();
  };

  // Drawing logic
  const startDrawing = (event) => {
    event.preventDefault();
    
    const pos = getPointerPosition(event);
    const ctx = ctxRef.current;
    
    setDrawing(true);
    
    // Base element
    const elementBase = {
      id: `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: tool,
      color: tool === 'eraser' ? '#ffffff' : color,
      strokeWidth
    };
    
    // Create specific element based on tool
    let element;
    
    switch (tool) {
      case 'pencil':
      case 'eraser':
        element = { 
          ...elementBase, 
          points: [pos],
          type: 'pencil'
        };
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.strokeWidth;
        break;
        
      case 'text':
        const text = prompt('Enter text:');
        if (!text) {
          setDrawing(false);
          return;
        }
        
        element = {
          ...elementBase,
          text,
          x: pos.x,
          y: pos.y,
          fontSize: 16
        };
        
        addElement(element);
        setDrawing(false);
        return;
        
      case 'sticky-note':
        const note = prompt('Enter note text:');
        if (!note) {
          setDrawing(false);
          return;
        }
        
        element = {
          ...elementBase,
          text: note,
          x: pos.x,
          y: pos.y,
          width: 200,
          height: 150,
          backgroundColor: '#fff3cd'
        };
        
        addElement(element);
        setDrawing(false);
        return;
        
      default:
        // rectangle, circle, arrow
        element = {
          ...elementBase,
          startX: pos.x,
          startY: pos.y
        };
        break;
    }
    
    setCurrentElement(element);
  };

  const draw = (event) => {
    if (!drawing || !currentElement) return;
    event.preventDefault();
    
    const pos = getPointerPosition(event);
    const ctx = ctxRef.current;
    
    let updatedElement = { ...currentElement };
    
    switch (currentElement.type) {
      case 'pencil':
        updatedElement.points = [...(currentElement.points || []), pos];
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
        
      case 'rectangle':
        updatedElement.endX = pos.x;
        updatedElement.endY = pos.y;
        redrawElements();
        
        // Draw preview rectangle
        ctx.strokeStyle = updatedElement.color;
        ctx.lineWidth = updatedElement.strokeWidth;
        const width = pos.x - updatedElement.startX;
        const height = pos.y - updatedElement.startY;
        ctx.strokeRect(updatedElement.startX, updatedElement.startY, width, height);
        break;
        
      case 'circle':
        updatedElement.endX = pos.x;
        updatedElement.endY = pos.y;
        redrawElements();
        
        // Draw preview circle
        const radius = Math.sqrt(
          Math.pow(pos.x - updatedElement.startX, 2) + 
          Math.pow(pos.y - updatedElement.startY, 2)
        );
        
        ctx.beginPath();
        ctx.strokeStyle = updatedElement.color;
        ctx.lineWidth = updatedElement.strokeWidth;
        ctx.arc(updatedElement.startX, updatedElement.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'arrow':
        updatedElement.endX = pos.x;
        updatedElement.endY = pos.y;
        redrawElements();
        
        // Draw preview arrow
        drawArrow(
          ctx, 
          updatedElement.startX, 
          updatedElement.startY, 
          pos.x, 
          pos.y, 
          updatedElement.color, 
          updatedElement.strokeWidth
        );
        break;
        
      default:
        break;
    }
    
    setCurrentElement(updatedElement);
  };

  const endDrawing = () => {
    if (!drawing) return;
    setDrawing(false);
    
    if (currentElement && (currentElement.type === 'pencil' || 
                          currentElement.type === 'rectangle' || 
                          currentElement.type === 'circle' || 
                          currentElement.type === 'arrow')) {
      addElement(currentElement);
    }
    
    setCurrentElement(null);
    ctxRef.current?.closePath();
  };

  // Draw all elements
  const redrawElements = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  };

  // Draw a single element
  const drawElement = (ctx, element) => {
    ctx.save();
    
    switch (element.type) {
      case 'pencil':
        if (!element.points || element.points.length < 2) break;
        
        ctx.beginPath();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.strokeWidth;
        ctx.moveTo(element.points[0].x, element.points[0].y);
        
        element.points.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y);
        });
        
        ctx.stroke();
        break;
        
      case 'rectangle':
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.strokeWidth;
        const width = (element.endX || 0) - element.startX;
        const height = (element.endY || 0) - element.startY;
        ctx.strokeRect(element.startX, element.startY, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(
          Math.pow((element.endX || 0) - element.startX, 2) + 
          Math.pow((element.endY || 0) - element.startY, 2)
        );
        
        ctx.beginPath();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.strokeWidth;
        ctx.arc(element.startX, element.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'arrow':
        drawArrow(
          ctx, 
          element.startX, 
          element.startY, 
          element.endX, 
          element.endY, 
          element.color, 
          element.strokeWidth
        );
        break;
        
      case 'text':
        ctx.font = `${element.fontSize || 16}px Arial`;
        ctx.fillStyle = element.color || 'black';
        ctx.fillText(element.text || '', element.x, element.y);
        break;
        
      case 'sticky-note':
        // Draw note background
        ctx.fillStyle = element.backgroundColor || '#fff3cd';
        ctx.fillRect(element.x, element.y, element.width || 200, element.height || 150);
        
        // Draw border
        ctx.strokeStyle = '#d6c78e';
        ctx.lineWidth = 1;
        ctx.strokeRect(element.x, element.y, element.width || 200, element.height || 150);
        
        // Draw text
        ctx.fillStyle = '#856404';
        ctx.font = '14px Arial';
        const lines = (element.text || '').split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, element.x + 10, element.y + 25 + idx * 18);
        });
        break;
        
      case 'ai-text':
        // Draw AI response box
        ctx.fillStyle = element.backgroundColor || '#e6f7ff';
        ctx.fillRect(element.x, element.y, element.width || 300, element.height || 100);
        
        // Draw border
        ctx.strokeStyle = '#91d5ff';
        ctx.lineWidth = 1;
        ctx.strokeRect(element.x, element.y, element.width || 300, element.height || 100);
        
        // Draw text
        ctx.fillStyle = element.color || '#0066cc';
        ctx.font = '14px Arial';
        const aiLines = (element.text || '').split('\n');
        aiLines.forEach((line, idx) => {
          ctx.fillText(line, element.x + 10, element.y + 25 + idx * 18);
        });
        break;
    }
    
    ctx.restore();
  };

  const drawArrow = (ctx, startX, startY, endX, endY, color = 'black', width = 2) => {
    if (startX == null || startY == null || endX == null || endY == null) return;
    
    const headlen = 10; // arrow head length
    const angle = Math.atan2(endY - startY, endX - startX);
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headlen * Math.cos(angle - Math.PI / 6),
      endY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headlen * Math.cos(angle + Math.PI / 6),
      endY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  };

  // AI handling
  const handleAIRequest = () => {
    if (!aiPrompt.trim() || aiProcessing) return;
    
    setAIProcessing(true);
    
    socketManager.requestAISuggestion(aiPrompt, {
      currentElements: elements,
      roomId,
      userId: socketManager.currentUser
    });
    
    // Reset prompt but keep panel open
    setAIPrompt('');
  };

  // Redraw when elements change
  useEffect(() => {
    redrawElements();
  }, [elements]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CanvasToolbar
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onClear={handleClearCanvas}
        tool={tool}
        setTool={setTool}
        onAIToggle={() => setShowAI(!showAI)}
        showAI={showAI}
        roomId={roomId}
        userCount={userCount}
      />
      
      <div className="relative flex-grow">
        <GridBackground zoom={1} />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        
        {/* AI Panel */}
        {showAI && (
          <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <button onClick={() => setShowAI(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3">
              <p className="text-sm text-gray-600 mb-3">
                Ask the AI to generate content, suggest layouts, or create diagrams for you.
              </p>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAIPrompt(e.target.value)}
                  placeholder="E.g., Draw a flowchart for user login"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={aiProcessing}
                />
                <button
                  onClick={handleAIRequest}
                  disabled={!aiPrompt.trim() || aiProcessing}
                  className={`px-3 py-2 rounded text-white text-sm font-medium ${
                    !aiPrompt.trim() || aiProcessing
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {aiProcessing ? 'Generating...' : 'Ask'}
                </button>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-500">Try these:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Draw a flowchart', 'Create a mind map', 'Generate a user story'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setAIPrompt(suggestion)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagramCanvas;