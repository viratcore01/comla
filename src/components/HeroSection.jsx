// src/components/HeroSection.jsx
import React from "react";
import gifBg from "../assets/17Cg.gif";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        src={gifBg}
        alt="Background"
        className="absolute w-full h-full object-cover blur-sm brightness-75"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Comla
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Your gateway to top colleges. Discover, apply, and get accepted to your dream institution.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
