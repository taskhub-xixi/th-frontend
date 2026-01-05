/**
 * Debug utility for authentication issues
 */

export async function debugAuthStatus() {
  try {
    console.log("🔍 Debugging Auth Status...");
    
    // Check CSRF token
    const csrfToken = sessionStorage.getItem("csrf_token");
    console.log("✓ CSRF Token in sessionStorage:", csrfToken ? "✅ EXISTS" : "❌ MISSING");
    
    // Check localStorage user
    const user = localStorage.getItem("user");
    console.log("✓ User in localStorage:", user ? "✅ EXISTS" : "❌ MISSING");
    
    // Check backend auth status
    try {
      const response = await fetch("https://taskhub-be.vercel.app/api/debug/auth-status", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("✓ Backend Auth Check:");
      console.log("  - Auth Cookie Present:", data.hasAuthCookie ? "✅ YES" : "❌ NO");
      console.log("  - All Cookies:", data.allCookies.join(", ") || "❌ NONE");
      console.log("  - NODE_ENV:", data.nodeEnv);
      
      return {
        csrf_token_exists: !!csrfToken,
        user_exists: !!user,
        auth_cookie_exists: data.hasAuthCookie,
        cookies: data.allCookies,
        node_env: data.nodeEnv,
      };
    } catch (err) {
      console.error("❌ Failed to check backend auth:", err);
      return null;
    }
  } catch (error) {
    console.error("❌ Debug failed:", error);
    return null;
  }
}

export function printDebugInfo() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║             🔍 Authentication Debug Information            ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\n📝 To check auth status, run in browser console:");
  console.log("   import { debugAuthStatus } from '@/lib/debug-auth'");
  console.log("   debugAuthStatus().then(info => console.table(info))");
  console.log("\n");
}
