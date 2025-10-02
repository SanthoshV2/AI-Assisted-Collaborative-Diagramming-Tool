import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000"; // backend URL

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { email, password },
        { withCredentials: true } // enable cookies
      );

      alert(res.data.message);

      if (isLogin) {
        window.location.href = "/dashboard";
      } else {
        setIsLogin(true); // after signup, go to login
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />  
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}   
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
    </div>
  );
}

export default Auth;