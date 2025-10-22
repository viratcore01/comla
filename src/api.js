import axios from "axios";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: "https://comla-backend.onrender.com", // backend URL
  withCredentials: true, // include cookies for auth if needed
  headers: {
    "Content-Type": "application/json"
  }
});

// Signup function
export const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    console.log("Signup response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response || error.message);
    throw error;
  }
};

// Login function
export const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response || error.message);
    throw error;
  }
};