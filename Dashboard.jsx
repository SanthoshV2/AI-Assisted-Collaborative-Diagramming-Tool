
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Sparkles, Plus, Folder } from "lucide-react";
import axios from "axios";

const isValidRoomCode = (code) => /^[a-zA-Z0-9]{6,8}$/.test(code);

const generateRoomCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Dashboard = () => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedDiagrams = async () => {
      if (!user) return;
      try {
        const response = await axios.get("http://localhost:8000/diagrams", {
          params: { userId: user.id },
          withCredentials: true,
        });
        setSavedDiagrams(response.data || []);
      } catch (err) {
        console.error("Error fetching diagrams:", err);
      }
    };
    fetchSavedDiagrams();
  }, [user]);

  const handleJoin = (e) => {
    e.preventDefault();
    const trimmedCode = roomCode.trim();

    if (!isValidRoomCode(trimmedCode)) {
      setError("Room code must be 6-8 alphanumeric characters");
      return;
    }

    setLoading(true);
    navigate(`/canvas/${trimmedCode}`);
  };

  const handleCreateRoom = () => {
    const newCode = generateRoomCode();
    navigate(`/canvas/${newCode}`);
  };

  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DiagramAI</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName}!
              </p>
            </div>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-10">
        {/* LEFT — Create / Join Room */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              AI-Powered Diagramming
            </h2>
            <p className="text-gray-600">
              Create or join a collaborative diagramming session
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                setError("");
              }}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={8}
              required
              disabled={loading}
            />

            <button
              type="submit"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </form>

          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 flex-1"></div>
            <span className="px-3 text-sm text-gray-500 bg-white">or</span>
            <div className="border-t border-gray-300 flex-1"></div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Room</span>
          </button>

          {error && (
            <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
          )}

          {/* AI Features Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              AI Features
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Smart shape recognition</li>
              <li>• Auto-organize content</li>
              <li>• AI-powered suggestions</li>
              <li>• Intelligent text completion</li>
            </ul>
          </div>
        </div>

        {/* RIGHT — Saved Diagrams */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Folder className="w-5 h-5 mr-2 text-blue-600" />
            Saved Diagrams
          </h2>

          {savedDiagrams.length === 0 ? (
            <p className="text-gray-500 text-sm">No saved diagrams yet.</p>
          ) : (
            <ul className="space-y-2">
              {savedDiagrams.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => navigate(`/canvas/${d.roomCode}`)}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {d.name || `Diagram ${d.roomCode}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;