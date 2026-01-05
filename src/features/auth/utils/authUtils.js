/**
 * Utility functions for auth feature
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    strength: getPasswordStrength(password),
    errors,
  };
}

/**
 * Get password strength
 */
function getPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 3) return "medium";
  if (strength <= 4) return "strong";
  return "very strong";
}

/**
 * Validate registration data
 */
export function validateRegistration(data) {
  const errors = [];

  if (!data.name || data.name.length < 3) {
    errors.push("Name must be at least 3 characters");
  }

  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (data.password !== data.repeatPassword) {
    errors.push("Passwords do not match");
  }

  if (!data.role) {
    errors.push("Please select your role");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate login data
 */
export function validateLogin(data) {
  const errors = [];

  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password || data.password.length < 1) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;

  const user = localStorage.getItem("user");
  return !!user;
}

/**
 * Get current user from storage
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Get user role from storage
 */
export function getUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

/**
 * Check if user has specific role
 */
export function hasRole(role) {
  const userRole = getUserRole();
  return userRole === role;
}

/**
 * Store user data in localStorage
 */
export function storeUser(user) {
  if (typeof window === "undefined") return;

  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Remove user data from localStorage
 */
export function clearUser() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("csrf_token");
}

/**
 * Get auth token
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

/**
 * Store auth token
 */
export function storeAuthToken(token) {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
}

/**
 * Clear auth token
 */
export function clearAuthToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
}

/**
 * Mask email for display
 */
export function maskEmail(email) {
  if (!email) return email;

  const [username, domain] = email.split("@");
  if (!(username && domain)) return email;

  const maskedUsername =
    username.length > 2
      ? `${username[0]}${"*".repeat(username.length - 2)}${username[username.length - 1]}`
      : username;

  return `${maskedUsername}@${domain}`;
}

/**
 * Format user display name
 */
export function formatUserName(user) {
  if (!user) return "User";

  if (user.name) return user.name;
  if (user.email) return maskEmail(user.email);
  if (user.username) return user.username;

  return "User";
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get remaining session time in minutes
 */
export function getSessionTimeRemaining(token) {
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]);
    const now = Date.now() / 1000;
    const remaining = payload.exp - now;
    return Math.max(0, Math.floor(remaining / 60));
  } catch {
    return 0;
  }
}
