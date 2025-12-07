/**
 * CSRF Token Management
 *
 * CSRF (Cross-Site Request Forgery) protection untuk httpOnly cookies.
 *
 * Flow:
 * 1. Backend generate CSRF token saat login/session start
 * 2. Frontend save CSRF token di sessionStorage (bukan cookie!)
 * 3. Frontend send CSRF token di header setiap request
 * 4. Backend validate CSRF token match dengan session
 */

/**
 * Generate random CSRF token (client-side)
 * NOTE: Idealnya token generated di backend
 */
export function generateCSRFToken() {
  if (typeof window === "undefined") return null;

  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Get CSRF token dari sessionStorage
 */
export function getCSRFToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("csrf_token");
}

/**
 * Store CSRF token
 * Biasanya dipanggil setelah login success
 */
export function storeCSRFToken(token) {
  if (typeof window === "undefined") return;

  // Jika token tidak provided, generate baru
  const csrfToken = token || generateCSRFToken();
  sessionStorage.setItem("csrf_token", csrfToken);
  return csrfToken;
}

/**
 * Clear CSRF token
 * Dipanggil saat logout atau session expired
 */
export function clearCSRFToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("csrf_token");
}

/**
 * Initialize CSRF token
 * Panggil di app initialization atau setelah login
 */
export async function initializeCSRF(apiClient) {
  if (typeof window === "undefined") return null;

  try {
    // Request CSRF token dari backend
    const response = await apiClient.get("/auth/csrf-token");
    const token = response.data.csrfToken;

    if (token) {
      storeCSRFToken(token);
      return token;
    }
  } catch (error) {
    console.error("Failed to initialize CSRF token:", error);
    // Fallback: generate client-side
    return storeCSRFToken();
  }
}

/**
 * React hook untuk CSRF management
 */
export function useCSRF(apiClient) {
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Check existing token
      let token = getCSRFToken();

      // Jika tidak ada, initialize
      if (!token) {
        token = await initializeCSRF(apiClient);
      }

      setCsrfToken(token);
      setIsLoading(false);
    }

    init();
  }, [apiClient]);

  return { csrfToken, isLoading };
}
