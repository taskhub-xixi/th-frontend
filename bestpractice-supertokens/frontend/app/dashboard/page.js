/**
 * Dashboard Page - Protected Route Example
 */

"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute, useAuth } from "../../components/ProtectedRoute";
import { LogoutButton } from "../../components/LogoutButton";
import { apiGet } from "../../lib/api";

function DashboardContent() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // ✅ API call dengan automatic session handling!
        const data = await apiGet("/api/user/profile");
        setProfile(data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>Profile</h2>
        {profile && (
          <div>
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Name:</strong> {profile.name}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <LogoutButton>Logout</LogoutButton>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
