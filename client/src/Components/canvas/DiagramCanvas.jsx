import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Pencil, Square, Type, StickyNote, Link as LinkIcon, Hand, Lasso, ZoomIn, ZoomOut, Grid3X3 } from 'lucide-react';
import CanvasToolbar from './CanvasToolbar';
// import GridBackground from './GridBackground';
// import StickyNoteNode from './NodeTypes/StickyNote';
// import TextBoxNode from './NodeTypes/TextBox';
// import ShapeNode from './NodeTypes/Shape';
// import ConnectorNode from './NodeTypes/Connector';
// import UserCursors from '../collaboration/UserCursors';

const DiagramCanvas = () => {
  const { id: roomId } = useParams();
  const { user } = useUser();
  const canvasRef = useRef(null);
  const [canvasState, setCanvasState] = useState({
    elements: [],
    selectedElements: [],
    tool: 'select', // select, hand, pencil, shape, text, stickynote, connector
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDrawing: false,
    lastPosition: { x: 0, y: 0 }
  });

  const [userCursors, setUserCursors] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  // Initialize canvas with roomId
  useEffect(() => {
    if (!roomId || !user) return;

    const initCanvas = async () => {
      // TODO: Connect to socket and load canvas data
      console.log(`Initializing canvas for room ${roomId}`);
      
      // Simulate loading canvas data
      setTimeout(() => {
        setCanvasState(prev => ({
          ...prev,
          elements: [
            // Sample elements
            {
              id: 'note1',
              type: 'stickynote',
              content: 'Welcome to DiagramAI!',
              position: { x: 100, y: 100 },
              size: { width: 200, height: 200 },
              color: 'bg-yellow-200',
              createdBy: user.id
            },
            {
              id: 'text1',
              type: 'text',
              content: 'This is a collaborative canvas',
              position: { x: 400, y: 150 },
              size: { width: 300, height: 50 },
              createdBy: user.id
            }
          ]
        }));

        setCollaborators([
          {
            id: user.id,
            name: user.fullName || user.username,
            color: 'bg-blue-500'
          }
        ]);
      }, 500);
    };

    initCanvas();

    return () => {
      // TODO: Disconnect from socket
    };
  }, [roomId, user]);

  // Handle mouse events
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom,
      y: (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom
    };

    setCanvasState(prev => ({
      ...prev,
      isDrawing: true,
      lastPosition: position
    }));

    // Handle element creation based on selected tool
    if (canvasState.tool !== 'select' && canvasState.tool !== 'hand') {
      createNewElement(position);
    } else if (canvasState.tool === 'select') {
      selectElementAtPosition(position);
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom,
      y: (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom
    };

    // Update user cursor position for collaboration
    // TODO: Send cursor position to other users via socket

    if (canvasState.isDrawing) {
      if (canvasState.tool === 'hand') {
        // Pan the canvas
        setCanvasState(prev => ({
          ...prev,
          pan: {
            x: prev.pan.x + (position.x - prev.lastPosition.x) * prev.zoom,
            y: prev.pan.y + (position.y - prev.lastPosition.y) * prev.zoom
          }
        }));
      } else if (canvasState.tool === 'select' && canvasState.selectedElements.length > 0) {
        // Move selected elements
        moveSelectedElements(position);
      }
    }

    setCanvasState(prev => ({
      ...prev,
      lastPosition: position
    }));
  };

  const handleMouseUp = () => {
    setCanvasState(prev => ({
      ...prev,
      isDrawing: false
    }));

    // TODO: Send updated canvas state to other users via socket
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    // Zoom in/out with mouse wheel
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(canvasState.zoom * delta, 0.1), 5);
    
    setCanvasState(prev => ({
      ...prev,
      zoom: newZoom
    }));
  };

  // Element manipulation functions
  const createNewElement = (position) => {
    const newElement = {
      id: `el-${Date.now()}`,
      position,
      createdBy: user.id
    };

    switch (canvasState.tool) {
      case 'stickynote':
        newElement.type = 'stickynote';
        newElement.content = '';
        newElement.size = { width: 200, height: 200 };
        newElement.color = 'bg-yellow-200';
        break;
      case 'text':
        newElement.type = 'text';
        newElement.content = 'Click to edit';
        newElement.size = { width: 200, height: 50 };
        break;
      case 'shape':
        newElement.type = 'shape';
        newElement.shape = 'rectangle';
        newElement.size = { width: 150, height: 100 };
        newElement.color = 'bg-blue-200';
        break;
      case 'connector':
        newElement.type = 'connector';
        newElement.points = [position, position];
        newElement.style = 'straight';
        break;
      default:
        return;
    }

    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElements: [newElement.id]
    }));
  };

  const selectElementAtPosition = (position) => {
    // Find element under cursor
    const clickedElement = canvasState.elements.find(el => {
      if (el.type === 'connector') return false; // Special handling for connectors
      
      const { x, y } = el.position;
      const { width, height } = el.size || { width: 0, height: 0 };
      
      return (
        position.x >= x && 
        position.x <= x + width && 
        position.y >= y && 
        position.y <= y + height
      );
    });

    setCanvasState(prev => ({
      ...prev,
      selectedElements: clickedElement ? [clickedElement.id] : []
    }));
  };

  const moveSelectedElements = (currentPosition) => {
    const dx = currentPosition.x - canvasState.lastPosition.x;
    const dy = currentPosition.y - canvasState.lastPosition.y;

    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el => {
        if (prev.selectedElements.includes(el.id)) {
          return {
            ...el,
            position: {
              x: el.position.x + dx,
              y: el.position.y + dy
            }
          };
        }
        return el;
      })
    }));
  };

  const handleToolChange = (tool) => {
    setCanvasState(prev => ({
      ...prev,
      tool,
      selectedElements: [] // Clear selection when changing tools
    }));
  };

  const handleZoomIn = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5)
    }));
  };

  const handleZoomOut = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1)
    }));
  };

  const handleResetView = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  };

  const updateElement = (id, changes) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...changes } : el
      )
    }));

    // TODO: Broadcast element changes to other users via socket
  };

  const deleteSelectedElements = () => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !prev.selectedElements.includes(el.id)),
      selectedElements: []
    }));

    // TODO: Broadcast deletion to other users
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (canvasState.selectedElements.length > 0) {
          deleteSelectedElements();
        }
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          // TODO: Copy selected elements
        } else if (e.key === 'v') {
          // TODO: Paste elements
        } else if (e.key === 'z') {
          // TODO: Undo
        } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
          // TODO: Redo
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasState.selectedElements]);

  // Render elements
  const renderElements = () => {
    return canvasState.elements.map(element => {
      const isSelected = canvasState.selectedElements.includes(element.id);
      
      switch (element.type) {
        case 'stickynote':
          return (
            <StickyNoteNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              updateElement={updateElement}
              zoom={canvasState.zoom}
            />
          );
        case 'text':
          return (
            <TextBoxNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              updateElement={updateElement}
              zoom={canvasState.zoom}
            />
          );
        case 'shape':
          return (
            <ShapeNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              updateElement={updateElement}
              zoom={canvasState.zoom}
            />
          );
        case 'connector':
          return (
            <ConnectorNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              updateElement={updateElement}
              zoom={canvasState.zoom}
            />
          );
        default:
          return null;
      }
    });
  };

  const canvasCursorStyle = () => {
    switch (canvasState.tool) {
      case 'hand': return 'cursor-grab';
      case 'select': return 'cursor-default';
      case 'pencil': return 'cursor-pencil';
      default: return 'cursor-crosshair';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <CanvasToolbar 
        currentTool={canvasState.tool}
        onToolChange={handleToolChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        roomId={roomId}
        zoom={Math.round(canvasState.zoom * 100)}
        collaborators={collaborators}
      />
      
      <div 
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={canvasRef}
      >
        <div 
          className={`absolute ${canvasCursorStyle()}`}
          style={{
            transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x / canvasState.zoom}px, ${canvasState.pan.y / canvasState.zoom}px)`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%'
          }}
        >
          <GridBackground zoom={canvasState.zoom} />
          
          <div className="absolute inset-0">
            {renderElements()}
          </div>
        </div>
        
        <UserCursors users={userCursors} />
        
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md text-sm">
          Zoom: {Math.round(canvasState.zoom * 100)}%
        </div>
      </div>
    </div>
  );
};

export default DiagramCanvas;