/**
 * Sign Out Button Component
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/session-helpers
 */

"use client";

import { useRouter } from "next/navigation";
import Session from "supertokens-auth-react/recipe/session";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await Session.signOut();
    router.push("/auth");
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
