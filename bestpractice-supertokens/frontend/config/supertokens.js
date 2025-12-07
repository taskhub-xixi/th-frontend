/**
 * SuperTokens Frontend Configuration
 *
 * Konfigurasi SuperTokens untuk Next.js frontend.
 * File ini akan di-import di layout.js
 */

import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";

/**
 * Initialize SuperTokens
 * Call this once saat app start
 */
export function initSuperTokensFrontend() {
  // Check if already initialized
  if (typeof window === "undefined") {
    return; // Skip during SSR
  }

  SuperTokens.init({
    appInfo,

    // Recipes (features)
    recipeList: [
      // Email/Password authentication
      EmailPassword.init({
        // Customize sign up fields
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "email",
                label: "Email",
                placeholder: "Enter your email",
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Enter your password",
              },
              {
                id: "name",
                label: "Full Name",
                placeholder: "Enter your name",
                optional: false, // Required
              },
            ],
          },
        },

        // Customize form styles (optional)
        style: `
          [data-supertokens~=container] {
            font-family: inherit;
          }
          [data-supertokens~=button] {
            background-color: #0070f3;
            border-radius: 8px;
          }
          [data-supertokens~=button]:hover {
            background-color: #0051cc;
          }
        `,

        // Override default functions
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Add custom logic after sign up
              signUp: async function (input) {
                const response = await originalImplementation.signUp(input);

                if (response.status === "OK") {
                  console.log("Sign up successful!");

                  // TODO: Custom logic setelah sign up
                  // Misal: track analytics, show welcome toast, etc
                }

                return response;
              },

              // Add custom logic after sign in
              signIn: async function (input) {
                const response = await originalImplementation.signIn(input);

                if (response.status === "OK") {
                  console.log("Sign in successful!");

                  // TODO: Custom logic setelah sign in
                  // Misal: track analytics, redirect, etc
                }

                return response;
              },
            };
          },
        },
      }),

      // Session management
      Session.init({
        // Session expired handling
        onHandleEvent: (context) => {
          if (context.action === "UNAUTHORISED") {
            // Session expired atau tidak valid
            console.log("Session expired, redirecting to login");
            // SuperTokens akan auto redirect ke /auth
          } else if (context.action === "SESSION_CREATED") {
            console.log("New session created");
          } else if (context.action === "SIGN_OUT") {
            console.log("User signed out");
          } else if (context.action === "REFRESH_SESSION") {
            console.log("Session refreshed");
          }
        },
      }),
    ],

    // Window handler for redirects
    windowHandler: (originalImplementation) => {
      return {
        ...originalImplementation,
        location: {
          ...originalImplementation.location,
          setHref: (href) => {
            // Custom redirect logic
            console.log("Redirecting to:", href);
            originalImplementation.location.setHref(href);
          },
        },
      };
    },
  });
}

/**
 * Get redirect to auth page URL
 */
export function getAuthUrl(redirectBack = true) {
  const currentPath = window.location.pathname;
  const authUrl = "/auth";

  if (redirectBack && currentPath !== "/") {
    return `${authUrl}?redirectToPath=${currentPath}`;
  }

  return authUrl;
}
