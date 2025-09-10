import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
Plus,
Search,
Clock,
Users,
Star,
MoreVertical,
Grid3X3,
List,
TrendingUp,
FileText,
Layout,
Target,
Lightbulb,
Sparkles,
} from 'lucide-react';

const Dashboard = () => {
const { user } = useUser();
const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState('');
const [filterType, setFilterType] = useState('all'); // 'all', 'recent', 'shared', 'starred'
const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
const [showCreateModal, setShowCreateModal] = useState(false);

// Mock data - replace with actual API calls
const [diagrams, setDiagrams] = useState([
{
id: '1',
title: 'Product Roadmap Q4',
description: 'Strategic planning for Q4 product development',
thumbnail: '/api/placeholder/300/200',
lastModified: new Date('2024-01-10'),
collaborators: [
{ id: '1', name: 'Alice Johnson', avatar: '/api/placeholder/32/32' },
{ id: '2', name: 'Bob Smith', avatar: '/api/placeholder/32/32' },
],
isStarred: true,
type: 'flowchart',
color: 'bg-blue-500'
},
{
id: '2',
title: 'User Journey Mapping',
description: 'Complete user experience flow analysis',
thumbnail: '/api/placeholder/300/200',
lastModified: new Date('2024-01-09'),
collaborators: [
{ id: '3', name: 'Carol Wilson', avatar: '/api/placeholder/32/32' },
],
isStarred: false,
type: 'journey',
color: 'bg-purple-500'
},
{
id: '3',
title: 'System Architecture',
description: 'Backend infrastructure design',
thumbnail: '/api/placeholder/300/200',
lastModified: new Date('2024-01-08'),
collaborators: [
{ id: '4', name: 'David Brown', avatar: '/api/placeholder/32/32' },
{ id: '5', name: 'Eva Davis', avatar: '/api/placeholder/32/32' },
{ id: '6', name: 'Frank Miller', avatar: '/api/placeholder/32/32' },
],
isStarred: true,
type: 'technical',
color: 'bg-green-500'
}
]);

const [templates] = useState([
{
id: 't1',
title: 'Sprint Planning',
description: 'Agile sprint planning template',
icon: <Target className="w-6 h-6" />,
color: 'from-blue-500 to-blue-600',
category: 'Agile'
},
{
id: 't2',
title: 'Mind Map',
description: 'Brainstorming and idea organization',
icon: <Lightbulb className="w-6 h-6" />,
color: 'from-yellow-500 to-orange-500',
category: 'Brainstorming'
},
{
id: 't3',
title: 'Process Flow',
description: 'Business process visualization',
icon: <Layout className="w-6 h-6" />,
color: 'from-purple-500 to-purple-600',
category: 'Process'
},
{
id: 't4',
title: 'User Story Map',
description: 'User-centered feature planning',
icon: <Users className="w-6 h-6" />,
color: 'from-green-500 to-green-600',
category: 'UX'
}
]);

// Generate room code
const generateRoomCode = () => {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let code = '';
for (let i = 0; i < 6; i++) {
code += chars.charAt(Math.floor(Math.random() * chars.length));
}
return code;
};

const handleCreateDiagram = (templateId = null) => {
const roomCode = generateRoomCode();
setShowCreateModal(false);
navigate(`/diagram/${roomCode}`);
};

const handleOpenDiagram = (diagramId) => {
const diagram = diagrams.find(d => d.id === diagramId);
if (diagram) {
navigate(`/diagram/${diagramId}`);
}
};

const handleToggleStar = (diagramId) => {
setDiagrams(prev => prev.map(d =>
d.id === diagramId ? { ...d, isStarred: !d.isStarred } : d
));
};

const filteredDiagrams = diagrams.filter(diagram => {
const matchesSearch = diagram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
diagram.description.toLowerCase().includes(searchQuery.toLowerCase());

const matchesFilter = filterType === 'all' || 
                     (filterType === 'starred' && diagram.isStarred) ||
                     (filterType === 'recent' && diagram.lastModified > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                     (filterType === 'shared' && diagram.collaborators.length > 1);

return matchesSearch && matchesFilter;

});

const formatLastModified = (date) => {
const now = new Date();
const diff = now - date;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));

if (days === 0) return 'Today';
if (days === 1) return 'Yesterday';
if (days < 7) return `${days} days ago`;
return date.toLocaleDateString();

};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DiagramAI</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Diagram</span>
            </motion.button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Diagrams</p>
                <p className="text-2xl font-bold text-gray-900">{diagrams.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collaborators</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-gray-900">{diagrams.filter(d => d.isStarred).length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Templates Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCreateDiagram(template.id)}
                className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 cursor-pointer hover:shadow-medium transition-all duration-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {template.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                  {template.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Diagrams Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Diagrams</h2>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search diagrams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Diagrams</option>
                <option value="recent">Recent</option>
                <option value="starred">Starred</option>
                <option value="shared">Shared</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Diagrams Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiagrams.map((diagram, index) => (
                <motion.div
                  key={diagram.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-medium transition-all duration-200 group"
                >
                  <div 
                    className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer relative overflow-hidden"
                    onClick={() => handleOpenDiagram(diagram.id)}
                  >
                    <div className={`absolute inset-0 ${diagram.color} opacity-10`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl text-gray-400">📊</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(diagram.id);
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Star 
                          className={`w-4 h-4 ${diagram.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleOpenDiagram(diagram.id)}
                      >
                        {diagram.title}
                      </h3>
                      <div className="relative">
                        <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {diagram.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatLastModified(diagram.lastModified)}
                        </span>
                      </div>
                      
                      <div className="flex -space-x-2">
                        {diagram.collaborators.slice(0, 3).map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          >
                            {collaborator.name.charAt(0)}
                          </div>
                        ))}
                        {diagram.collaborators.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                            +{diagram.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
              {filteredDiagrams.map((diagram, index) => (
                <motion.div
                  key={diagram.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 group"
                >
                  <div className={`w-12 h-12 ${diagram.color} rounded-lg flex items-center justify-center text-white text-lg mr-4`}>
                    📊
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleOpenDiagram(diagram.id)}
                    >
                      {diagram.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{diagram.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {formatLastModified(diagram.lastModified)}
                    </span>
                    <div className="flex -space-x-2">
                      {diagram.collaborators.slice(0, 3).map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        >
                          {collaborator.name.charAt(0)}
                        </div>
                      ))}
                      {diagram.collaborators.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                          +{diagram.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStar(diagram.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${diagram.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Create Diagram Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Diagram</h2>
            <p className="mb-6 text-gray-600">Choose a template or start from scratch.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleCreateDiagram(template.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors ${template.color ? `bg-gradient-to-r ${template.color} text-white` : 'bg-gray-100'}`}
                >
                  {template.icon}
                  <span className="mt-2 font-medium">{template.title}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleCreateDiagram()}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-2"
            >
              Start from Scratch
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2024 DiagramAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
