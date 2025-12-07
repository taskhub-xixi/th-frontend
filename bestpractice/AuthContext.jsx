"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only access localStorage in browser
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    // Check if user exists in localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);

    // Only access localStorage in browser
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
    }
  };

  const login = (userData, token) => {
    setUser(userData);

    // Only access localStorage in browser
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
      if (token) {
        localStorage.setItem("auth_token", token);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
