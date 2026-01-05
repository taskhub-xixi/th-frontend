/**
 * Custom hooks for auth feature
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * Hook to manage authentication state
 * Wrapper around AuthContext to provide additional methods
 */
export function useAuth() {
  const context = useAuthContext();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await context.logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to logout");
    }
  }, [context.logout, router]);

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await context.login(credentials);
        return response;
      } catch (err) {
        toast.error(err.message || "Login failed");
        throw err;
      }
    },
    [context.login],
  );

  const register = useCallback(
    async (userData) => {
      try {
        const response = await context.register(userData);
        return response;
      } catch (err) {
        toast.error(err.message || "Registration failed");
        throw err;
      }
    },
    [context.register],
  );

  return {
    ...context,
    login,
    logout,
    register,
  };
}

/**
 * Hook to check authentication status
 */
export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role) {
  const { user } = useAuthContext();

  return user?.role === role;
}

/**
 * Hook to check if user is tasker
 */
export function useIsTasker() {
  return useHasRole("tasker");
}

/**
 * Hook to check if user is poster
 */
export function useIsPoster() {
  return useHasRole("poster");
}

/**
 * Hook to redirect based on authentication
 */
export function useRequireAuth(redirectTo = "/login") {
  const { user, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!(isAuthenticated && user)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  return { user, isAuthenticated };
}

/**
 * Hook to redirect if user doesn't have required role
 */
export function useRequireRole(role, redirectTo = "/dashboard") {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== role) {
      router.push(redirectTo);
    }
  }, [user, role, router, redirectTo]);

  return { user, hasRole: user?.role === role };
}

/**
 * Hook to manage password reset
 */
export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authApi.resetPassword(email);

      if (response.success) {
        setSuccess(true);
        toast.success("Password reset link sent to your email");
      } else {
        setError(response.message || "Failed to send reset link");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }, []);

  return { resetPassword, loading, error, success, reset: () => setSuccess(false) };
}

/**
 * Hook to manage password change
 */
export function useChangePassword() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      if (!user) {
        setError("You must be logged in to change password");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await authApi.changePassword({
          current_password: currentPassword,
          new_password: newPassword,
        });

        if (response.success) {
          setSuccess(true);
          toast.success("Password changed successfully");
        } else {
          setError(response.message || "Failed to change password");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        toast.error("Failed to change password");
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return {
    changePassword,
    loading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
