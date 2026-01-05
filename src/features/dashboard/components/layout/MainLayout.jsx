"use client";

import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronDown, Hamburger, LogOut, Menu, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";

function TopBar() {
  const { toggleSidebar, open } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
      {/* Hamburger Menu - Hanya muncul di mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="lg:hidden"
      >
        {open ? (
          <Hamburger className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Spacer untuk desktop */}
      <div className="hidden lg:block" />

      {/* User Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
        >
          {user ? (
            <>
              <span className="text-xs md:text-sm font-medium">
                Hi, {user.firstName || user.name || "User"}
              </span>
              <span className="text-lg">👋</span>
            </>
          ) : (
            <>
              <span className="text-xs md:text-sm font-medium">Hi,</span>
              <span className="text-lg">👋</span>
            </>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              {/* Profile */}
              <button
                onClick={() => {
                  router.push("/dashboard/profile");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  router.push("/dashboard/settings");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              <div className="h-px bg-border my-2" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          {/* Top bar */}
          <TopBar />
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
