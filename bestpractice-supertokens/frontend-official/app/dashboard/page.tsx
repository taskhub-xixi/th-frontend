/**
 * Protected Dashboard Page
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/protecting-route
 */

import { redirect } from "next/navigation";
import { getSSRSession } from "../sessionUtils";
import { TryRefreshComponent } from "../components/tryRefreshClientComponent";
import SignOutButton from "../components/signOutButton";

export default async function DashboardPage() {
  // Check session server-side
  const session = await getSSRSession();

  if (!session) {
    // No session, redirect to auth
    return redirect("/auth");
  }

  // If we get here, we have a valid session
  const userId = session.getUserId();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome! Your user ID is: {userId}</p>

      <div style={{ marginTop: "20px" }}>
        <SignOutButton />
      </div>
    </div>
  );
}

/**
 * Error Boundary Component
 * Catches session errors and attempts refresh
 */
export function ErrorBoundary({ error }: { error: Error }) {
  if (error.message === "Session expired") {
    return <TryRefreshComponent />;
  }

  throw error;
}
