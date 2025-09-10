import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Home from "./Components/pages/Home.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here, e.g. <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
       </div>
      </BrowserRouter>
    </>
  );
}

export default App;
