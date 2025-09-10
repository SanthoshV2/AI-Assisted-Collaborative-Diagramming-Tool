import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/canvas/:id" element={<DiagramCanvas />} />
        </Routes>
       </div>
      </BrowserRouter>
    </>
  );
}

export default App;
