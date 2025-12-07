/**
 * Protected Route Component dengan SuperTokens
 *
 * Wrap component dengan ini untuk require authentication
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const session = useSessionContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Jika tidak ada session dan loading selesai, redirect ke login
    if (isClient && !session.loading && !session.doesSessionExist) {
      router.push("/auth");
    }
  }, [session, router, isClient]);

  // Show loading saat check session
  if (!isClient || session.loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Jika tidak ada session, jangan render (akan redirect)
  if (!session.doesSessionExist) {
    return null;
  }

  // Session exists, render children
  return <>{children}</>;
}

/**
 * Alternative: withAuth HOC
 * Usage: export default withAuth(DashboardPage);
 */
export function withAuth(Component) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook untuk get session info
 */
export function useAuth() {
  const session = useSessionContext();

  return {
    isLoading: session.loading,
    isAuthenticated: session.doesSessionExist,
    userId: session.userId,
    accessTokenPayload: session.accessTokenPayload,
  };
}
