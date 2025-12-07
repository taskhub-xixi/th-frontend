/**
 * App configuration untuk SuperTokens
 *
 * IMPORTANT: appInfo MUST be same di frontend dan backend!
 */

export const appInfo = {
  appName: "TaskHub",
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3001",
  websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};
