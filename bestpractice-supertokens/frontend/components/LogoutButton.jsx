/**
 * Logout Button dengan SuperTokens
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export function LogoutButton({ children, className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // ✅ SuperTokens signOut - one liner!
      await signOut();

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {isLoading ? "Logging out..." : (children || "Logout")}
    </button>
  );
}
