import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );

  const login = (userData, tokens) => {
    setIsAuthenticated(true);
    setEmail(userData.email);
    setUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("user", JSON.stringify(userData));
    if (tokens) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  };

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return null;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.accessToken;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  // Function to get valid access token (refreshes if needed)
  const getAccessToken = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) return null;

    // Check if token is expired (simple check - you might want to decode JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        // Token expired, refresh it
        token = await refreshAccessToken();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      token = await refreshAccessToken();
    }

    return token;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      email,
      user,
      login,
      logout,
      getAccessToken,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
