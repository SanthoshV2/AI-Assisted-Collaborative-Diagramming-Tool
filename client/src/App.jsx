import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Home from "./Components/pages/Home.jsx";
import Dashboard from "./Components/pages/Dashboard.jsx";
import DiagramCanvas from "./Components/canvas/DiagramCanvas.jsx";

function App() {
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
          </Routes>

          <Route path="/canvas" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />} />
      </BrowserRouter>
    </>
  );
}

export default App;
