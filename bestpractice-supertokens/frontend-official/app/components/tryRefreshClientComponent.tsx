/**
 * Try Refresh Client Component
 *
 * Attempts to refresh session if expired
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/protecting-route
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Session from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";

export const TryRefreshComponent = () => {
  const router = useRouter();
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    /**
     * Attempt to refresh the session
     * If refresh fails, redirect to auth page
     */
    void Session.attemptRefreshingSession()
      .then((hasSession) => {
        if (hasSession) {
          // Refresh successful, reload the page
          router.refresh();
        } else {
          // No session, redirect to auth
          redirectToAuth();
        }
      })
      .catch(() => {
        setDidError(true);
      });
  }, [router]);

  /**
   * If the refresh failed, show error
   * This is a safety fallback - usually won't be reached
   */
  if (didError) {
    return <div>Something went wrong. Please try again.</div>;
  }

  /**
   * Show loading while refreshing
   */
  return <div>Loading...</div>;
};
