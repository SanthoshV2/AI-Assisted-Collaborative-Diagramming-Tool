import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  UserButton,
} from "@clerk/clerk-react";
import Home from "./Components/pages/Home.jsx";
import Dashboard from "./Components/pages/Dashboard.jsx";
import DiagramCanvas from "./Components/canvas/DiagramCanvas.jsx";

function App() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center ">
        Loading...
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
          <Route
            path="/canvas/:id"
            element={
              <SignedIn>
                <DiagramCanvas />
              </SignedIn>
            }
          />

          <Route path="/canvas" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
