import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, form);
      console.log("Login successful:", res.data);

      // Login with tokens
      login(res.data.user, {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      });

      navigate("/colleges");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white w-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-sm mt-3">Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link></p>
    </div>
  );
};

export default Login;
