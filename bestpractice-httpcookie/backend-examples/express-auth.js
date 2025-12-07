/**
 * Express.js Backend Implementation untuk HttpOnly Cookie Auth
 *
 * Install dependencies:
 * npm install express cors bcryptjs jsonwebtoken cookie-parser dotenv
 */

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ===============================
// MIDDLEWARE SETUP
// ===============================

// CORS configuration - CRITICAL untuk httpOnly cookies!
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Frontend URL
    credentials: true, // ✅ WAJIB! Allow cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// ===============================
// CSRF TOKEN MANAGEMENT
// ===============================

// Generate CSRF token
function generateCSRFToken() {
  return require("crypto").randomBytes(32).toString("hex");
}

// Store CSRF tokens (in production, use Redis/database)
const csrfTokens = new Map();

// CSRF validation middleware
function validateCSRF(req, res, next) {
  // Skip CSRF for GET requests
  if (req.method === "GET") {
    return next();
  }

  const csrfToken = req.headers["x-csrf-token"];
  const userId = req.userId; // Set by auth middleware

  if (!csrfToken) {
    return res.status(403).json({ message: "CSRF token required" });
  }

  const storedToken = csrfTokens.get(userId);
  if (csrfToken !== storedToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
}

// ===============================
// AUTH MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {
  // Get token dari cookie (bukan Authorization header!)
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    // Token invalid atau expired
    res.clearCookie("auth_token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ===============================
// COOKIE CONFIGURATION
// ===============================

const getCookieConfig = () => ({
  httpOnly: true, // ✅ JavaScript tidak bisa akses
  secure: process.env.NODE_ENV === "production", // ✅ HTTPS only di production
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // ✅ CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/", // Available untuk semua routes
});

// ===============================
// AUTH ROUTES
// ===============================

/**
 * POST /api/auth/register
 * Register new user
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    // TODO: Check if user already exists di database
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(409).json({ message: "Email already registered" });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Save user to database
    // const user = await User.create({
    //   email,
    //   password: hashedPassword,
    //   name,
    // });

    // Mock user for demo
    const user = {
      id: Date.now().toString(),
      email,
      name,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * Login user dan set httpOnly cookie
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // TODO: Find user di database
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    // Mock user for demo
    const user = {
      id: "123",
      email: email,
      name: "John Doe",
      password: await bcrypt.hash("password123", 10), // Mock hashed password
    };

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "24h",
      }
    );

    // Generate CSRF token
    const csrfToken = generateCSRFToken();
    csrfTokens.set(user.id, csrfToken);

    // ✅ Set httpOnly cookie
    res.cookie("auth_token", token, getCookieConfig());

    // Return user data + CSRF token (BUKAN token JWT!)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      csrfToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/logout
 * Logout user dan clear cookie
 */
app.post("/api/auth/logout", authenticateToken, (req, res) => {
  // Clear CSRF token
  csrfTokens.delete(req.userId);

  // Clear cookie
  res.clearCookie("auth_token", getCookieConfig());

  res.json({ message: "Logout successful" });
});

/**
 * GET /api/auth/csrf-token
 * Get CSRF token untuk authenticated user
 */
app.get("/api/auth/csrf-token", authenticateToken, (req, res) => {
  let csrfToken = csrfTokens.get(req.userId);

  if (!csrfToken) {
    csrfToken = generateCSRFToken();
    csrfTokens.set(req.userId, csrfToken);
  }

  res.json({ csrfToken });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    // TODO: Get user from database
    // const user = await User.findById(req.userId);

    // Mock user
    const user = {
      id: req.userId,
      email: req.userEmail,
      name: "John Doe",
    };

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// PROTECTED ROUTES EXAMPLE
// ===============================

/**
 * GET /api/user/profile
 * Protected route example
 */
app.get("/api/user/profile", authenticateToken, validateCSRF, (req, res) => {
  res.json({
    message: "Protected data",
    userId: req.userId,
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log(`✅ HttpOnly cookies enabled`);
});

module.exports = app;
