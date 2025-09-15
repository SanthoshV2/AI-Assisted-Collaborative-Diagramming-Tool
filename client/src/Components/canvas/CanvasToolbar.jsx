import React from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { Sparkles, Save, Share, ChevronLeft } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const CanvasToolbar = ({ 
  color, 
  setColor, 
  strokeWidth, 
  setStrokeWidth, 
  onClear, 
  tool, 
  setTool, 
  onAIToggle, 
  showAI,
  roomId,
  userCount = 1
}) => {
  const navigate = useNavigate();
  
  const tools = [
    { id: 'select', name: 'Select', icon: '🔘' },
    { id: 'pencil', name: 'Pencil', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'arrow', name: 'Arrow', icon: '➡️' },
    { id: 'text', name: 'Text', icon: '📝' },
    { id: 'sticky-note', name: 'Note', icon: '📄' }
  ];

  const colors = [
    { name: 'Black', value: 'black' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h1 className="font-medium text-gray-900">
              DiagramAI
              Room: <span className="text-blue-600">{roomId}</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-700">{userCount} online</span>
          </div>
          
          <button
            onClick={() => {/* TODO: Save diagram */}}
            className="flex items-center space-x-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
          >
            <Save size={16} />
            <span className="text-sm">Save</span>
          </button>
          
          <button
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert('Link copied to clipboard!');
            }}
            className="flex items-center space-x-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
          >
            <Share size={16} />
            <span className="text-sm">Share</span>
          </button>
          
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Tools */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`px-2 py-1.5 rounded text-sm font-medium transition-all duration-200 flex items-center ${
                tool === t.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={t.name}
            >
              <span className="mr-1">{t.icon}</span>
              <span className="hidden sm:inline">{t.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Colors */}
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-500 hidden sm:inline">Color:</span>
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c.value}
                  className={`w-6 h-6 rounded-full border ${
                    color === c.value 
                      ? "border-gray-800 shadow-sm scale-110" 
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-20 accent-blue-500"
            />
            <span className="text-xs text-gray-600 min-w-[1.5rem]">{strokeWidth}</span>
          </div>

          {/* AI Toggle */}
          <button
            onClick={onAIToggle}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium ml-2 ${
              showAI 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </button>

          {/* Clear */}
          <button
            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors font-medium ml-2"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;