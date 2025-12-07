/**
 * Auth Middleware untuk Next.js
 *
 * Cara pakai:
 * 1. Create file: src/middleware.js di root project
 * 2. Export middleware function
 * 3. Configure matcher untuk protected routes
 */

import { NextResponse } from "next/server";

/**
 * Middleware untuk protect routes
 * NOTE: Ini contoh basic, adjust sesuai kebutuhan
 */
export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes yang tidak perlu auth
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without token
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Save redirect URL
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages (login/register)
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

/**
 * Alternative: Client-side route guard component
 * Gunakan ini jika tidak pakai middleware
 */

/**
 * HOC untuk protect pages di client-side
 * Usage:
 * export default withAuth(DashboardPage);
 */
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isLoading && !user && isClient) {
        router.push("/login");
      }
    }, [user, isLoading, router, isClient]);

    // Show loading while checking auth
    if (isLoading || !user) {
      return <div>Loading...</div>;
    }

    // User is authenticated
    return <Component {...props} />;
  };
}

/**
 * Hook untuk protect routes di component
 * Usage di page:
 * useRequireAuth();
 */
export function useRequireAuth(redirectUrl = "/login") {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  return { user, isLoading };
}

/**
 * Component untuk protect routes
 * Usage:
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, isLoading } = useRequireAuth(redirectTo);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useRequireAuth
  }

  return <>{children}</>;
}

/**
 * Check if user has specific role/permission
 */
export function useCheckPermission(requiredRole) {
  const { user } = useAuth();

  if (!user) return false;

  // Adjust based on your user object structure
  return user.role === requiredRole || user.roles?.includes(requiredRole);
}
