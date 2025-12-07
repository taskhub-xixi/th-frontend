# Implementation Guide - Auth Best Practices

Panduan step-by-step untuk implement auth dengan security best practices tanpa library.

## 📋 Prerequisites

1. Backend API yang sudah ready dengan endpoints:
   - `POST /api/auth/login` - Login user
   - `POST /api/auth/register` - Register user
   - `POST /api/auth/logout` - Logout user (optional)
   - `POST /api/auth/refresh` - Refresh token (optional)

2. Backend response format:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## 🚀 Step-by-Step Implementation

### Step 1: Setup Environment Variables

Create/update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENCRYPTION_KEY=your-secret-encryption-key-change-this-in-production
```

### Step 2: Replace Core Files

#### 2.1 Update AuthContext
```bash
cp bestpractice/AuthContext.jsx src/context/AuthContext.jsx
```

**Key changes:**
- ✅ SSR-safe localStorage access
- ✅ Added `login()` helper method
- ✅ Proper error handling

#### 2.2 Update Axios Instance
```bash
cp bestpractice/axios.js src/lib/axios.js
```

**Key changes:**
- ✅ Fixed typos
- ✅ Removed console.logs
- ✅ Better error handling
- ✅ SSR-safe

**Or use encrypted version:**
```bash
cp bestpractice/axios-with-encryption.js src/lib/axios.js
cp bestpractice/security-utils.js src/lib/security-utils.js
```

#### 2.3 Update LoginForm
```bash
cp bestpractice/LoginForm.jsx src/features/auth/login/components/LoginForm.jsx
```

**Key changes:**
- ✅ Proper token storage
- ✅ AuthContext integration
- ✅ Better error handling
- ✅ Fixed error message extraction

#### 2.4 Update SignUpForm
```bash
cp bestpractice/SignUpForm.jsx src/features/auth/register/components/signUpForm.jsx
```

**Key changes:**
- ✅ Fixed error message extraction
- ✅ Better error handling
- ✅ Added more status code handling

### Step 3: Add Protected Routes (Choose One)

#### Option A: Next.js Middleware (Recommended)

Create `src/middleware.js`:
```javascript
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

**IMPORTANT**: Middleware butuh token di cookies, bukan localStorage!
Jika masih pakai localStorage, gunakan Option B.

#### Option B: Client-Side Route Guard

Wrap protected pages dengan `ProtectedRoute`:

```javascript
// src/app/dashboard/page.jsx
import { ProtectedRoute } from "@/lib/auth-middleware";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

Or use HOC:
```javascript
import { withAuth } from "@/lib/auth-middleware";

function DashboardPage() {
  return <div>Dashboard Content</div>;
}

export default withAuth(DashboardPage);
```

Or use hook:
```javascript
import { useRequireAuth } from "@/lib/auth-middleware";

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) return <div>Loading...</div>;

  return <div>Dashboard for {user.name}</div>;
}
```

### Step 4: Test Everything

#### 4.1 Test Register
1. Go to `/register`
2. Fill form dengan data valid
3. Submit
4. Should redirect to `/login`
5. Check console untuk errors

#### 4.2 Test Login
1. Go to `/login`
2. Login dengan credentials yang baru didaftar
3. Should redirect to `/dashboard`
4. Check localStorage:
   ```javascript
   localStorage.getItem("auth_token")  // Should have token
   localStorage.getItem("user")        // Should have user JSON
   ```
5. Check Network tab di DevTools:
   - Request headers should have `Authorization: Bearer xxx`

#### 4.3 Test Protected Routes
1. Logout (atau clear localStorage)
2. Try access `/dashboard`
3. Should redirect to `/login`

#### 4.4 Test Logout
```javascript
import { useAuth } from "@/context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## 🔒 Security Enhancements (Optional)

### Level 1: Token Encryption
```javascript
// Use axios-with-encryption.js instead of axios.js
import { storeToken, getToken } from "@/lib/security-utils";

// In LoginForm after login success:
storeToken(token);  // Encrypted automatically

// Token will be decrypted automatically in axios interceptor
```

### Level 2: CSRF Protection
```javascript
import { storeCSRFToken, getCSRFToken } from "@/lib/security-utils";

// On app load:
useEffect(() => {
  storeCSRFToken();
}, []);

// In axios interceptor:
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});
```

### Level 3: Password Strength Indicator
```javascript
import { checkPasswordStrength } from "@/lib/security-utils";

function PasswordField() {
  const [password, setPassword] = useState("");
  const strength = checkPasswordStrength(password);

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>Strength: {strength.score}/6</div>
      {strength.feedback.map((fb) => (
        <div key={fb}>{fb}</div>
      ))}
    </div>
  );
}
```

### Level 4: Token Auto-Refresh
```javascript
// In axios-with-encryption.js, uncomment refreshAccessToken function
// Backend perlu return refresh_token saat login
```

## 📊 Comparison: Current vs HttpOnly Cookies vs SuperTokens

| Feature | Current (localStorage) | HttpOnly Cookies | SuperTokens |
|---------|----------------------|------------------|-------------|
| XSS Protection | ❌ Low | ✅ High | ✅ High |
| Setup Complexity | ✅ Easy | ⚠️ Medium | ⚠️ Medium |
| Backend Changes | ✅ None | ❌ Required | ❌ Required |
| CSRF Protection | Manual | ✅ Built-in | ✅ Built-in |
| Token Refresh | Manual | Manual | ✅ Automatic |
| Session Management | Manual | Manual | ✅ Automatic |
| Social Login | Manual | Manual | ✅ Built-in |
| Email Verification | Manual | Manual | ✅ Built-in |

## 🎯 Migration Path

### Now (Quick Wins)
1. ✅ Implement files dari `bestpractice/`
2. ✅ Add token encryption
3. ✅ Add protected routes
4. ✅ Fix all bugs

### Short Term (1-2 weeks)
1. Improve UX (loading states, better errors)
2. Add password reset flow
3. Add email verification
4. Add "Remember Me" feature

### Long Term (Production Ready)
1. **Option A**: Migrate to httpOnly cookies
   - Backend return cookies instead of tokens
   - Frontend remove localStorage
   - Update axios config

2. **Option B**: Migrate to SuperTokens
   - Install SuperTokens SDK
   - Replace auth logic
   - Get enterprise features

## 🐛 Troubleshooting

### Token tidak tersimpan
- Check: Response structure dari backend
- Check: `response.data.token` ada atau tidak
- Check: Console errors

### Redirect loop di login page
- Check: Axios interceptor line 34
- Pastikan ada check `!window.location.pathname.includes("/login")`

### 401 error terus menerus
- Check: Token format di localStorage
- Check: Backend validate token dengan benar
- Check: Token belum expired

### SSR/Hydration errors
- Pastikan semua localStorage access wrapped dengan `typeof window !== "undefined"`
- Use `useEffect` untuk initialize state dari localStorage

## 📚 Next Steps

1. **Test thoroughly** - Test semua edge cases
2. **Add logging** - Monitor errors di production
3. **Performance** - Optimize re-renders
4. **Security audit** - Review security practices
5. **Consider SuperTokens** - Jika butuh production-grade security

---

**Questions?** Check TODO.md untuk improvement checklist lengkap.
