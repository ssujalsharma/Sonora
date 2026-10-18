import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("spotify_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("spotify_token") || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "signup"

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("spotify_user", JSON.stringify(res.data));
      }
    } catch {
      // Not logged in or expired
      if (!token) {
        setUser(null);
        localStorage.removeItem("spotify_user");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async ({ identifier, password }) => {
    const payload = { password };
    if (identifier.includes("@")) {
      payload.email = identifier;
    } else {
      payload.username = identifier;
    }

    const res = await api.post("/auth/login", payload);
    const data = res.data;

    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("spotify_token", data.token);
    }

    setUser(userData);
    localStorage.setItem("spotify_user", JSON.stringify(userData));
    setAuthModalOpen(false);
    return userData;
  };

  const register = async ({ username, email, password, role = "user" }) => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    const data = res.data;

    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("spotify_token", data.token);
    }

    setUser(userData);
    localStorage.setItem("spotify_user", JSON.stringify(userData));
    setAuthModalOpen(false);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_user");
  };

  const openAuth = (mode = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const isArtist = user?.role === "artist";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isArtist,
        login,
        register,
        logout,
        authModalOpen,
        authModalMode,
        openAuth,
        closeAuth,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
