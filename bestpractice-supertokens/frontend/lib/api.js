/**
 * API client untuk SuperTokens
 *
 * SuperTokens automatically handles:
 * - Sending cookies
 * - CSRF tokens
 * - Token refresh
 *
 * Kamu tinggal pakai fetch biasa atau axios!
 */

import { appInfo } from "../config/appInfo";

/**
 * Fetch wrapper yang aware dengan SuperTokens
 */
export async function apiCall(endpoint, options = {}) {
  const url = `${appInfo.apiDomain}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // ✅ IMPORTANT: Send cookies automatically
      credentials: "include",
    });

    // SuperTokens automatically handles 401 (expired session)
    // and will refresh token in background

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API call failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return apiCall(endpoint, { method: "GET" });
}

/**
 * POST request
 */
export async function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: "DELETE" });
}

/**
 * Example usage:
 *
 * // Get user profile
 * const profile = await apiGet('/api/user/profile');
 *
 * // Update profile
 * await apiPost('/api/user/profile', { name: 'New Name' });
 *
 * // SuperTokens handles everything automatically!
 * // - Cookies sent automatically
 * // - CSRF tokens added automatically
 * // - Token refresh if needed
 */
