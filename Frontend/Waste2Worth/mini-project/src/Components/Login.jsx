// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
        role,
      });

      const { token, name, role: serverRole } = res.data;

      // Save session data
      localStorage.setItem("token", token);
      localStorage.setItem("username", email);
      localStorage.setItem("role", serverRole);
      localStorage.setItem("name", name);

      setMessage("Login successful!");

      // Immediately redirect based on role
      if (serverRole === "user") navigate("/about");
      else if (serverRole === "admin") navigate("/AdminPanel");
      else if (serverRole === "ngo") navigate("/NGOPanel");

    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data === "NGO registration is pending. Please wait for admin approval."
      ) {
        setMessage("Your NGO account is pending approval.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div id="login-body">
      <div className="overlay-login">
        <div className="login-main-card">
          <h2>Login</h2>

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="ngo">NGO</option>
          </select>

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button className="login-final-submit" onClick={handleLogin}>
            Login
          </button>

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
