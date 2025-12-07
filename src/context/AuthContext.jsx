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

    // Check if user exists in localStorage
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

  /**
   * Logout function
   * Clear user state dan localStorage
   * Cookie akan di-clear oleh backend
   */
  const logout = () => {
    setUser(null);

    // Clear user data dari localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  /**
   * Login function
   * Save user data (tapi BUKAN token!)
   * Token ada di httpOnly cookie, browser yang manage
   */
  const login = (userData) => {
    setUser(userData);

    // Save user data untuk UX (profile, name, etc)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  /**
   * Update user function
   * Untuk update profile, settings, etc
   */
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        login,
        logout,
        setUser,
        updateUser,
        user,
      }}
    >
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
