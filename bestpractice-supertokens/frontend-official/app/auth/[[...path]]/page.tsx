/**
 * Auth Page - SuperTokens Pre-built UI
 *
 * Handles all /auth/* routes
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-frontend
 */

"use client";

import { useEffect } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import SuperTokens from "supertokens-auth-react";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";

export default function Auth() {
  useEffect(() => {
    // Check if SuperTokens can handle this route
    if (
      SuperTokens.canHandleRoute([EmailPasswordPreBuiltUI]) === false
    ) {
      // Route not handled by SuperTokens, redirect to auth
      redirectToAuth({ redirectBack: false });
    }
  }, []);

  // Render SuperTokens pre-built UI
  if (typeof window !== "undefined") {
    return SuperTokens.getRoutingComponent([EmailPasswordPreBuiltUI]);
  }

  return null;
}
