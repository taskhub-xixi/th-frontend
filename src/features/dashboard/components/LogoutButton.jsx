"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import { clearCSRFToken } from "@/lib/csrf";

/**
 * LogoutButton component
 *
 * Untuk httpOnly cookie, logout HARUS melalui backend
 * karena hanya backend yang bisa clear httpOnly cookie
 */

export function LogoutButton({ className, variant = "outline", ...props }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Call logout API
      // Backend akan clear httpOnly cookie
      await apiClient.post("/auth/logout");

      // Clear CSRF token
      clearCSRFToken();

      // Clear user dari context & localStorage
      logout();

      toast.success("Logout berhasil");

      // Redirect ke login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if request fails, logout user locally
      clearCSRFToken();
      logout();
      router.push("/login");

      toast.error("Logout berhasil (offline mode)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      disabled={isLoading}
      onClick={handleLogout}
      variant={variant}
      {...props}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}

/**
 * Alternative: useLogout hook
 * Untuk dipakai di component lain
 */
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await apiClient.post("/auth/logout");
      clearCSRFToken();
      logout();
      toast.success("Logout berhasil");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearCSRFToken();
      logout();
      router.push("/login");
      toast.error("Logout berhasil (offline mode)");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
}
