"use client";
import { toast } from "sonner";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { clearCSRFToken, storeCSRFToken, getCSRFToken } from "@/lib/csrf";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only access localStorage in browser
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Initialize CSRF token if not exists
        if (!getCSRFToken()) {
          // Generate client-side token (valid for all requests)
          storeCSRFToken();
        }
      } catch (_error) {
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);

      setUser(response.user);
      setIsAuthenticated(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.user));
        // Store CSRF token dari login response
        if (response.csrfToken) {
          storeCSRFToken(response.csrfToken);
        }
      }

      toast.success("Login successful!");
      router.push("/dashboard");

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);

      setUser(response.user);
      setIsAuthenticated(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.user));
        // Store CSRF token dari register response
        if (response.csrfToken) {
          storeCSRFToken(response.csrfToken);
        }
      }

      toast.success("Registration successful!");
      router.push("/dashboard");

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 1. Call logout API
      await authApi.logout();

      // 2. Clear state
      setUser(null);
      setIsAuthenticated(false);

      // 3. Clear storage
      localStorage.removeItem("user");
      clearCSRFToken();

      // 4. Redirect
      router.push("/login");

      // 5. Show toast
      toast.success("Logged out successfully");
    } catch (_error) {
      // Even if API fails, still clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      clearCSRFToken();
      router.push("/login");
    }
  };

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
        isAuthenticated,
        login,
        register,
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
