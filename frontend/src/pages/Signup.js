import { useState } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import signupImage from "../assets/signup.avif";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    navigate("/login");
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
        <div
          className="auth-image"
          style={{ backgroundImage: `url(${signupImage})` }}
        >
          <div className="auth-image-overlay"></div>
          <div className="auth-image-text">
            Sign up to share your ideas
          </div>
        </div>

        {}
        <div className="auth-form">
          <div className="form-overlay"></div>
          <div className="auth-card">
            <h2 className="welcome-title">Welcome to Mini Blog</h2>
            <p className="welcome-subtitle">Create an account to start writing</p>

            <input
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button onClick={handleSignup}>Sign up</button>

            <p className="auth-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Log in</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}