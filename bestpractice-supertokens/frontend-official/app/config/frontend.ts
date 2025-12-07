/**
 * Frontend SuperTokens Configuration
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-frontend
 */

import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "email",
                label: "Email",
                placeholder: "Email address",
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Password",
              },
              {
                id: "name",
                label: "Full Name",
                placeholder: "First Name and Last Name",
                optional: false,
              },
            ],
          },
        },
      }),
      SessionReact.init(),
    ],
    // Handle window location for Next.js
    windowHandler: (original: any) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: () => window.location.pathname,
        assign: (url: any) => window.location.assign(url),
        setHref: (url: any) => window.location.href = url,
      },
    }),
  };
};
