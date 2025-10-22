import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, form);
      console.log(res.data);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      // Handle validation errors array from backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(error => error.msg || error.message).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error || "Signup failed");
      }
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" />
      <button onClick={handleSignup} className="bg-blue-500 text-white w-full p-2">Sign Up</button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
};

export default Signup;
