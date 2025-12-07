/**
 * App Info Configuration
 *
 * IMPORTANT: This must be EXACTLY the same in frontend and backend!
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/init
 */

export const appInfo = {
  // App name
  appName: "TaskHub",

  // API domain (backend)
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3001",

  // Website domain (frontend)
  websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || "http://localhost:3000",

  // API base path - where SuperTokens auth endpoints are
  apiBasePath: "/api/auth",

  // Website base path - where auth UI is shown
  websiteBasePath: "/auth",
};
