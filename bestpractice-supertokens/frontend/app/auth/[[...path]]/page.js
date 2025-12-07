/**
 * Auth Page - Pre-built UI dari SuperTokens
 *
 * Ini akan handle:
 * - /auth/login (atau /auth)
 * - /auth/register
 * - /auth/reset-password
 *
 * Semua UI sudah disediakan SuperTokens!
 */

"use client";

import { getRoutingComponent, canHandleRoute } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { useEffect } from "react";

export default function Auth() {
  useEffect(() => {
    // Check if SuperTokens can handle this route
    if (!canHandleRoute([EmailPasswordPreBuiltUI])) {
      // Redirect ke home jika route tidak dikenali
      window.location.href = "/";
    }
  }, []);

  // Render SuperTokens pre-built UI
  return getRoutingComponent([EmailPasswordPreBuiltUI]);
}
