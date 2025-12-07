/**
 * Express Server dengan SuperTokens
 *
 * Complete backend implementation dengan SuperTokens.
 * SuperTokens akan handle semua auth logic automatically!
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifySession } from "supertokens-node/recipe/session/framework/express/index.js";
import {
  initSuperTokens,
  getSupertokensMiddleware,
  getSupertokensErrorHandler
} from "./config.js";

// Load environment variables
dotenv.config();

// Initialize SuperTokens
initSuperTokens();

// Create Express app
const app = express();

// ===============================
// MIDDLEWARE
// ===============================

// CORS - IMPORTANT: Must be before SuperTokens middleware!
app.use(
  cors({
    origin: process.env.WEBSITE_DOMAIN || "http://localhost:3000",
    allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// SuperTokens middleware - handles auth endpoints automatically
app.use(getSupertokensMiddleware());

// ===============================
// ROUTES
// ===============================

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

/**
 * Public route example
 */
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});

/**
 * Protected route example
 * ✅ verifySession() automatically validates session!
 */
app.get("/api/user/profile", verifySession(), async (req, res) => {
  // req.session contains session data
  const userId = req.session.getUserId();
  const sessionHandle = req.session.getHandle();

  // TODO: Fetch user data dari database
  // const user = await db.users.findOne({ superTokensUserId: userId });

  // Mock user data
  const user = {
    id: userId,
    email: "user@example.com",
    name: "John Doe",
    sessionHandle,
  };

  res.json({ user });
});

/**
 * Update profile (protected)
 */
app.post("/api/user/profile", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  const { name } = req.body;

  // TODO: Update user di database
  // await db.users.update({ superTokensUserId: userId }, { name });

  res.json({ message: "Profile updated", userId, name });
});

/**
 * Get user session info
 */
app.get("/api/user/session", verifySession(), async (req, res) => {
  const session = req.session;

  const sessionInfo = {
    userId: session.getUserId(),
    sessionHandle: session.getHandle(),
    accessTokenPayload: session.getAccessTokenPayload(),
    sessionDataInDatabase: await session.getSessionDataFromDatabase(),
  };

  res.json(sessionInfo);
});

/**
 * Revoke session (logout from this device)
 */
app.post("/api/user/logout", verifySession(), async (req, res) => {
  await req.session.revokeSession();
  res.json({ message: "Logged out successfully" });
});

/**
 * Revoke all sessions (logout from all devices)
 */
app.post("/api/user/logout-all", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();

  // Revoke all sessions for this user
  await Session.revokeAllSessionsForUser(userId);

  res.json({ message: "Logged out from all devices" });
});

/**
 * Protected admin route example
 * Bisa ditambah custom authorization logic
 */
app.get("/api/admin/users", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();

  // TODO: Check if user is admin
  // const user = await db.users.findOne({ superTokensUserId: userId });
  // if (user.role !== 'admin') {
  //   return res.status(403).json({ message: "Forbidden" });
  // }

  // Mock admin check
  const isAdmin = true; // Replace dengan actual check

  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  res.json({ message: "Admin data", users: [] });
});

/**
 * Optional: Custom error handling untuk business logic
 */
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// SuperTokens error handler - MUST be after all routes
app.use(getSupertokensErrorHandler());

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("✅ Server running on http://localhost:" + PORT);
  console.log("✅ SuperTokens initialized");
  console.log("✅ CORS enabled for:", process.env.WEBSITE_DOMAIN || "http://localhost:3000");
  console.log("=".repeat(50));
  console.log("\n📚 Available Endpoints:");
  console.log("   Auth endpoints: /auth/*");
  console.log("   - POST /auth/signup");
  console.log("   - POST /auth/signin");
  console.log("   - POST /auth/signout");
  console.log("   - POST /auth/session/refresh");
  console.log("\n   API endpoints:");
  console.log("   - GET  /api/health");
  console.log("   - GET  /api/public");
  console.log("   - GET  /api/user/profile (protected)");
  console.log("   - POST /api/user/profile (protected)");
  console.log("   - GET  /api/user/session (protected)");
  console.log("   - POST /api/user/logout (protected)");
  console.log("   - POST /api/user/logout-all (protected)");
  console.log("\n   Dashboard: /auth/dashboard");
  console.log("=".repeat(50));
});

export default app;
