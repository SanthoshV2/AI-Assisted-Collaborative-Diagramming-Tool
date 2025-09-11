import React from 'react';
import { 
  Pencil, 
  Square, 
  Type, 
  StickyNote, 
  Link as LinkIcon, 
  Hand, 
  Lasso, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Share,
  Download,
  UserCircle,
  Save,
  Grid3X3,
  Settings,
  Sparkles
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const ToolButton = ({ icon, active, onClick, tooltip }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`p-2 rounded-lg ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
      } transition-colors duration-100`}
    >
      {icon}
    </button>
    {tooltip && (
      <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
        {tooltip}
      </div>
    )}
  </div>
);

const CanvasToolbar = ({
  currentTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  roomId,
  zoom,
  collaborators
}) => {
  const { user } = useUser();

  const tools = [
    { id: 'select', icon: <Lasso size={20} />, tooltip: 'Select (V)' },
    { id: 'hand', icon: <Hand size={20} />, tooltip: 'Pan (H)' },
    { id: 'pencil', icon: <Pencil size={20} />, tooltip: 'Draw (P)' },
    { id: 'shape', icon: <Square size={20} />, tooltip: 'Shape (S)' },
    { id: 'text', icon: <Type size={20} />, tooltip: 'Text (T)' },
    { id: 'stickynote', icon: <StickyNote size={20} />, tooltip: 'Sticky Note (N)' },
    { id: 'connector', icon: <LinkIcon size={20} />, tooltip: 'Connect (C)' },
  ];

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/diagram/${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    alert('Invitation link copied to clipboard!');
  };

  return (
    <div className="bg-white border-b border-gray-200 p-1.5 flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <button className="flex items-center space-x-2 px-3 py-1.5 text-gray-800 hover:bg-gray-100 rounded-lg mr-2">
          <Sparkles size={18} className="text-blue-500" />
          <span className="font-medium">DiagramAI</span>
        </button>
        
        <div className="bg-gray-200 h-6 w-px mx-2"></div>
        
        {tools.map(tool => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            active={currentTool === tool.id}
            onClick={() => onToolChange(tool.id)}
            tooltip={tool.tooltip}
          />
        ))}
        
        <div className="bg-gray-200 h-6 w-px mx-2"></div>
        
        <ToolButton icon={<ZoomIn size={20} />} onClick={onZoomIn} tooltip="Zoom In" />
        <ToolButton icon={<ZoomOut size={20} />} onClick={onZoomOut} tooltip="Zoom Out" />
        <ToolButton icon={<RotateCcw size={20} />} onClick={onResetView} tooltip="Reset View" />
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => {/* TODO: Save diagram */}}
          className="flex items-center space-x-1 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Save size={18} />
          <span>Save</span>
        </button>
        
        <button 
          onClick={copyInviteLink}
          className="flex items-center space-x-1 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Share size={18} />
          <span>Share</span>
        </button>
        
        <div className="bg-gray-200 h-6 w-px mx-1"></div>
        
        <div className="flex items-center">
          {collaborators.map((collab) => (
            <div 
              key={collab.id} 
              className={`w-8 h-8 rounded-full flex items-center justify-center -ml-2 border-2 border-white ${collab.color} text-white font-medium text-sm`}
              title={collab.name}
            >
              {collab.name.charAt(0)}
            </div>
          ))}
        </div>

        <div className="bg-gray-200 h-6 w-px mx-1"></div>
        
        <button 
          onClick={() => {/* TODO: Open settings */}}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;