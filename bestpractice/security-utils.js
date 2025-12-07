/**
 * Security utility functions untuk auth
 *
 * NOTE: Enkripsi di client-side bukan security yang sempurna!
 * Ini hanya "obscurity" bukan true encryption.
 * Token tetap bisa di-decode jika attacker punya akses ke kode.
 *
 * Best practice tetap: HttpOnly Cookies di backend
 */

/**
 * Simple XOR encryption untuk token
 * WARNING: Ini bukan enkripsi yang aman untuk production!
 * Gunakan hanya sebagai tambahan layer, bukan solusi utama.
 */
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-secret-key-change-this";

/**
 * Encrypt token menggunakan simple XOR cipher
 * @param {string} token - Token yang akan di-encrypt
 * @returns {string} - Encrypted token dalam base64
 */
export function encryptToken(token) {
  if (!token) return "";

  try {
    let encrypted = "";
    for (let i = 0; i < token.length; i++) {
      // XOR dengan secret key
      encrypted += String.fromCharCode(
        token.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    // Encode ke base64
    return btoa(encrypted);
  } catch (error) {
    console.error("Failed to encrypt token:", error);
    return token; // Return original jika gagal
  }
}

/**
 * Decrypt token
 * @param {string} encryptedToken - Encrypted token
 * @returns {string} - Decrypted token
 */
export function decryptToken(encryptedToken) {
  if (!encryptedToken) return "";

  try {
    // Decode dari base64
    const encrypted = atob(encryptedToken);
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      // XOR untuk decrypt
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt token:", error);
    return encryptedToken; // Return original jika gagal
  }
}

/**
 * Safely store token di localStorage dengan enkripsi
 */
export function storeToken(token) {
  if (typeof window === "undefined") return;

  const encrypted = encryptToken(token);
  localStorage.setItem("auth_token", encrypted);
}

/**
 * Safely retrieve token dari localStorage dengan dekripsi
 */
export function getToken() {
  if (typeof window === "undefined") return null;

  const encrypted = localStorage.getItem("auth_token");
  if (!encrypted) return null;

  return decryptToken(encrypted);
}

/**
 * Clear all auth data
 */
export function clearAuthData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token");
}

/**
 * Check if token is expired
 * Assumes JWT token format
 */
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    // Parse JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;

    if (!exp) return false; // No expiration

    // Check if expired (dengan 30 detik buffer)
    return Date.now() >= exp * 1000 - 30000;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return null;
  }
}

/**
 * Sanitize user input untuk prevent XSS
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check password strength
 * Returns: { isStrong: boolean, score: number, feedback: string[] }
 */
export function checkPasswordStrength(password) {
  const feedback = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push("Password minimal 8 karakter");

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push("Tambahkan huruf kecil");

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Tambahkan huruf besar");

  if (/[0-9]/.test(password)) score++;
  else feedback.push("Tambahkan angka");

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push("Tambahkan karakter khusus (!@#$%^&*)");

  return {
    isStrong: score >= 4,
    score,
    feedback,
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Store CSRF token
 */
export function storeCSRFToken() {
  if (typeof window === "undefined") return null;

  const token = generateCSRFToken();
  sessionStorage.setItem("csrf_token", token);
  return token;
}

/**
 * Get CSRF token
 */
export function getCSRFToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("csrf_token");
}
