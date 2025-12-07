/**
 * Root Layout dengan SuperTokens
 *
 * IMPORTANT: SuperTokens init MUST happen di client component!
 */

"use client";

import { useEffect } from "react";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokensFrontend } from "../config/supertokens";

// Initialize SuperTokens
if (typeof window !== "undefined") {
  initSuperTokensFrontend();
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SuperTokensWrapper>
          {children}
        </SuperTokensWrapper>
      </body>
    </html>
  );
}
