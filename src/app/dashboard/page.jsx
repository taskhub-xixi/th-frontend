"use client";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Search, User } from "lucide-react";

export default function Page() {
  const { user } = useAuth();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || user?.name || "User"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">{user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-4">
        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Applications</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile Views</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border rounded-xl p-8 min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No recent activity yet. Start exploring!</p>
        </div>
      </div>
    </>
  );
}
