/**
 * SuperTokens Backend Configuration
 *
 * Ini adalah konfigurasi SuperTokens untuk backend.
 * SuperTokens akan handle:
 * - Session management dengan httpOnly cookies
 * - CSRF protection
 * - Token refresh
 * - Email/Password authentication
 */

import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import Session from "supertokens-node/recipe/session/index.js";
import Dashboard from "supertokens-node/recipe/dashboard/index.js";

/**
 * Initialize SuperTokens
 */
export function initSuperTokens() {
  SuperTokens.init({
    // Framework yang dipakai
    framework: "express",

    // SuperTokens core connection
    supertokens: {
      // Option 1: Managed service (easiest untuk development)
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "https://try.supertokens.com",

      // Option 2: Self-hosted (untuk production)
      // connectionURI: "http://localhost:3567",
      // apiKey: process.env.SUPERTOKENS_API_KEY,
    },

    // App information
    appInfo: {
      appName: process.env.APP_NAME || "TaskHub",
      apiDomain: process.env.API_DOMAIN || "http://localhost:3001",
      websiteDomain: process.env.WEBSITE_DOMAIN || "http://localhost:3000",
      apiBasePath: "/auth",  // Auth endpoints di /auth/*
      websiteBasePath: "/auth",  // Frontend auth pages di /auth/*
    },

    // Recipes (features yang mau dipakai)
    recipeList: [
      // Email/Password authentication
      EmailPassword.init({
        // Customize sign up
        signUpFeature: {
          formFields: [
            {
              id: "email",
            },
            {
              id: "password",
            },
            {
              id: "name",
              optional: false,  // Required field
            },
          ],
        },

        // Override default functions (optional)
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Custom sign up logic
              signUp: async function (input) {
                // Call original implementation
                const response = await originalImplementation.signUp(input);

                if (response.status === "OK") {
                  // TODO: Custom logic setelah user register
                  // Misal: Send welcome email, create user profile, etc
                  console.log("New user registered:", response.user.id);

                  // Example: Save user to your database
                  // await db.users.create({
                  //   superTokensUserId: response.user.id,
                  //   email: response.user.email,
                  //   name: input.formFields.find(f => f.id === 'name').value
                  // });
                }

                return response;
              },

              // Custom sign in logic
              signIn: async function (input) {
                const response = await originalImplementation.signIn(input);

                if (response.status === "OK") {
                  console.log("User logged in:", response.user.id);

                  // TODO: Track login, update last login time, etc
                }

                return response;
              },
            };
          },

          // Override API endpoints (optional)
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Add custom response data
              signInPOST: async function (input) {
                const response = await originalImplementation.signInPOST(input);

                if (response.status === "OK") {
                  // Add custom data to response
                  // TODO: Fetch user profile dari database
                  // const userProfile = await db.users.findOne({
                  //   superTokensUserId: response.user.id
                  // });

                  // response.user.profile = userProfile;
                }

                return response;
              },
            };
          },
        },
      }),

      // Session management
      Session.init({
        // Session configuration
        cookieSecure: process.env.NODE_ENV === "production", // HTTPS only di production
        cookieSameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",

        // Session duration
        sessionExpiredStatusCode: 401,

        // Override session functions (optional)
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Custom session creation
              createNewSession: async function (input) {
                // Add custom session data
                const sessionData = {
                  // TODO: Add custom data yang mau disimpan di session
                  // role: 'user',
                  // permissions: ['read', 'write']
                };

                return originalImplementation.createNewSession({
                  ...input,
                  sessionDataInDatabase: sessionData,
                });
              },
            };
          },
        },
      }),

      // Dashboard (optional - untuk monitoring)
      Dashboard.init({
        // Access dashboard di http://localhost:3001/auth/dashboard
        admins: [
          // TODO: Add admin emails
          // "admin@taskhub.com"
        ],
      }),
    ],
  });
}

/**
 * Get SuperTokens middleware untuk Express
 */
export function getSupertokensMiddleware() {
  return SuperTokens.middleware();
}

/**
 * Get SuperTokens error handler
 */
export function getSupertokensErrorHandler() {
  return SuperTokens.errorHandler();
}

/**
 * Get all SuperTokens routes
 */
export function getSupertokensRoutes() {
  return SuperTokens.getRequestHandler();
}
