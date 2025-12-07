/**
 * Backend SuperTokens Configuration
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-backend
 */

import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";

export const backendConfig = (): TypeInput => {
  return {
    framework: "custom",
    supertokens: {
      // Use managed service (recommended for development)
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "https://try.supertokens.com",

      // For self-hosted SuperTokens core:
      // connectionURI: "http://localhost:3567",
      // apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init({
        // Customize sign up fields
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
              optional: false,
            },
          ],
        },

        // Override functions to add custom logic
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Custom sign up logic
              signUp: async function (input) {
                let response = await originalImplementation.signUp(input);

                if (response.status === "OK") {
                  // TODO: Add custom logic after sign up
                  // e.g., send welcome email, create user profile, etc.
                  console.log("New user signed up:", response.user.id);
                }

                return response;
              },

              // Custom sign in logic
              signIn: async function (input) {
                let response = await originalImplementation.signIn(input);

                if (response.status === "OK") {
                  // TODO: Add custom logic after sign in
                  // e.g., log activity, update last login, etc.
                  console.log("User signed in:", response.user.id);
                }

                return response;
              },
            };
          },
        },
      }),

      SessionNode.init({
        // Session configuration
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // Add custom data to session
              createNewSession: async function (input) {
                // TODO: Add custom session data
                // e.g., user roles, permissions, etc.

                return originalImplementation.createNewSession({
                  ...input,
                  accessTokenPayload: {
                    ...input.accessTokenPayload,
                    // Add your custom data here
                    // role: 'user',
                    // permissions: []
                  },
                });
              },
            };
          },
        },
      }),
    ],
    isInServerlessEnv: true,
  };
};
