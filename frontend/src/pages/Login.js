import { useState } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import loginImage from "../assets/login.avif"; 
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data: sessionData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    localStorage.setItem("sb-user", JSON.stringify(sessionData.user));
    localStorage.setItem("sb-token", sessionData.session.access_token);

    alert("Login successful!");
    navigate("/posts");
  };

  return (
    <>
      {}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="nav-logo">mini-blog</h1>
          </div>
          <div className="nav-right">
            <button 
              className="nav-btn login-btn"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button 
              className="nav-btn signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {}
      <div className="auth-container">
        {}
        <div className="auth-form">
          <div className="form-overlay"></div>
          <div className="auth-card">
            <h2 className="welcome-title">Welcome Back</h2>
            <p className="welcome-subtitle">Login to continue your blogging journey</p>

            <input
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Log in</button>

            <p className="auth-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>
          </div>
        </div>

        {}
        <div
          className="auth-image"
          style={{ backgroundImage: `url(${loginImage})` }}
        >
          <div className="auth-image-overlay"></div>
          <div className="auth-image-text">
            Share your thoughts with the world
          </div>
        </div>
      </div>
    </>
  );
}