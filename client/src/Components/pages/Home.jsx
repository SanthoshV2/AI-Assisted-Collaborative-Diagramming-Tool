import React from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Users, 
  Brain, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Layout,
  MessageSquare
} from 'lucide-react';

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Assistance",
      description: "Generate diagrams, suggest layouts, and auto-organize content with intelligent AI."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live cursors, instant updates, and team presence."
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Infinite Canvas",
      description: "Unlimited space to create, organize, and visualize your ideas without constraints."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smart Templates",
      description: "Start faster with AI-generated templates for workflows, brainstorming, and planning."
    }
  ];

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DiagramAI
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </SignUpButton>
            </>
          ) : (
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 border border-blue-200/50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Collaborative Diagramming
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Reimagined with AI
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create stunning diagrams, flowcharts, and visual workflows with your team. 
              Our AI assistant helps you organize ideas, suggest improvements, and accelerate your creative process.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {!isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg">
                    <span>Start Creating Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
                <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-lg">
                  Watch Demo
                </button>
              </>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to visualize ideas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools and intelligent features designed for modern teams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="p-6 bg-white rounded-2xl shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of teams already using DiagramAI to create, collaborate, and innovate faster.
          </p>
          
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg text-lg flex items-center space-x-2 mx-auto">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2025 DiagramAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;