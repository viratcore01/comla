import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, UserPlus, Info } from "lucide-react";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, email, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="text-3xl">🌀</div>
          <div>
            <div className="text-xl font-bold">Comla</div>
            <div className="text-sm text-neutral-600">Building Cool Stuff</div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex space-x-4 text-base items-center">
          {/* About Us always visible */}
          <button
            onClick={() => navigate("/about-us")}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-400 shadow-lg hover:shadow-[0_0_20px_#3b82f6] transition-all duration-300"
          >
            <Info size={18} />
            <span>About Us</span>
          </button>

          {isAuthenticated ? (
            // Logged-in user view
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <UserRound size={18} />
                <span>{email ? email.split("@")[0] : "Account"}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded w-48 z-10">
                  <div className="px-4 py-2 border-b">
                    <div className="font-bold">
                      {email ? email.split("@")[0] : "User"}
                    </div>
                    <div className="text-xs text-gray-500">{email}</div>
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Profile
                  </button>
                  {user?.role === 'student' && (
                    <button
                      onClick={() => navigate('/student-applications')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      My Applications
                    </button>
                  )}
                  {user?.role === 'college' && (
                    <button
                      onClick={() => navigate('/college-applications')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Manage Applications
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin-dashboard')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Guest view (not logged in)
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-[0_0_20px_#3b82f6] transition-all duration-300"
              >
                <UserRound size={18} />
                <span>Login</span>
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-400 shadow-lg hover:shadow-[0_0_20px_#3b82f6] transition-all duration-300"
              >
                <UserPlus size={18} />
                <span>Signup</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
