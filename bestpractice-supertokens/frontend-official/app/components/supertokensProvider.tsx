/**
 * SuperTokens Provider Component
 *
 * Wraps the app with SuperTokens context
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-frontend
 */

"use client";

import React from "react";
import { SuperTokensWrapper } from "supertokens-auth-react";
import SuperTokensReact from "supertokens-auth-react";
import { frontendConfig } from "../config/frontend";

// Initialize SuperTokens only on client side
if (typeof window !== "undefined") {
  SuperTokensReact.init(frontendConfig());
}

export const SuperTokensProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
