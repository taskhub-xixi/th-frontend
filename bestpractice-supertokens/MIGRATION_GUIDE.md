# Migration Guide: HttpOnly Cookie → SuperTokens

Panduan migrasi dari implementasi httpOnly cookie manual ke SuperTokens.

## 🎯 Why Migrate?

Dari httpOnly cookie implementation kamu yang ~350 lines menjadi SuperTokens ~80 lines dengan features lebih banyak!

### What You'll Gain:
- ✅ **80% less code** - 350 lines → 80 lines
- ✅ **Automatic token refresh** - No manual implementation
- ✅ **Automatic CSRF protection** - No manual token management
- ✅ **Session management** - Revoke sessions, multi-device logout
- ✅ **Ready for features** - Social login, email verify, 2FA ready to enable
- ✅ **Less maintenance** - SuperTokens handles updates

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup current implementation
- [ ] List all custom auth features kamu pakai
- [ ] Plan user data migration strategy
- [ ] Test SuperTokens in development
- [ ] Plan rollout strategy

### Backend Migration
- [ ] Install SuperTokens dependencies
- [ ] Replace manual auth endpoints with SuperTokens
- [ ] Migrate user data to SuperTokens format
- [ ] Update protected route middleware
- [ ] Test all endpoints

### Frontend Migration
- [ ] Install SuperTokens React SDK
- [ ] Replace manual login/register with SuperTokens
- [ ] Update API client (remove manual cookie handling)
- [ ] Replace protected route components
- [ ] Test all flows

### Post-Migration
- [ ] Test thoroughly
- [ ] Monitor errors
- [ ] Gradual rollout
- [ ] Remove old code

## 🔄 Step-by-Step Migration

### Step 1: Install Dependencies (10 min)

**Backend:**
```bash
cd backend
npm install supertokens-node
```

**Frontend:**
```bash
cd frontend
npm install supertokens-auth-react supertokens-web-js
```

### Step 2: Backend Migration (30-60 min)

#### 2.1 Create SuperTokens Config

Create `backend/supertokens-config.js`:
```javascript
import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import Session from "supertokens-node/recipe/session/index.js";

export function initSuperTokens() {
  SuperTokens.init({
    framework: "express",
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
    },
    appInfo: {
      appName: process.env.APP_NAME,
      apiDomain: process.env.API_DOMAIN,
      websiteDomain: process.env.WEBSITE_DOMAIN,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
    ],
  });
}
```

#### 2.2 Update Server.js

**Before (Manual):**
```javascript
// Manual CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Manual auth endpoints
app.post('/api/auth/login', async (req, res) => {
  // ~50 lines of manual login logic
  // Password validation
  // JWT generation
  // Cookie setting
  // CSRF token generation
});

app.post('/api/auth/register', async (req, res) => {
  // ~40 lines of manual register logic
});

// Manual auth middleware
function authenticateToken(req, res, next) {
  // ~30 lines of token validation
}
```

**After (SuperTokens):**
```javascript
import { initSuperTokens } from './supertokens-config.js';

initSuperTokens();

// SuperTokens CORS (includes all necessary headers)
app.use(cors({
  origin: process.env.WEBSITE_DOMAIN,
  allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()],
  credentials: true,
}));

app.use(express.json());

// SuperTokens middleware (handles all auth endpoints automatically!)
app.use(SuperTokens.middleware());

// Use SuperTokens session middleware for protected routes
import { verifySession } from "supertokens-node/recipe/session/framework/express/index.js";

app.get('/api/user/profile', verifySession(), (req, res) => {
  const userId = req.session.getUserId();
  // Your logic
});

// SuperTokens error handler
app.use(SuperTokens.errorHandler());
```

**Reduction: ~200 lines → ~30 lines!**

#### 2.3 Migrate User Data (if needed)

If you already have users, migrate them:

```javascript
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";

// For each existing user:
async function migrateUser(oldUser) {
  try {
    // Create user in SuperTokens
    const response = await EmailPassword.signUp(
      "public", // tenantId
      oldUser.email,
      oldUser.hashedPassword, // Or generate new password reset
    );

    if (response.status === "OK") {
      // Map old user ID to new SuperTokens user ID
      await db.users.update(
        { id: oldUser.id },
        { superTokensUserId: response.user.id }
      );

      console.log(`Migrated user: ${oldUser.email}`);
    }
  } catch (error) {
    console.error(`Failed to migrate ${oldUser.email}:`, error);
  }
}
```

### Step 3: Frontend Migration (30-60 min)

#### 3.1 Create SuperTokens Config

Create `frontend/config/supertokens.js`:
```javascript
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export function initSuperTokensFrontend() {
  if (typeof window === "undefined") return;

  SuperTokens.init({
    appInfo: {
      appName: "TaskHub",
      apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN,
      websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
    ],
  });
}
```

#### 3.2 Update App Layout

**Before:**
```javascript
// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**After:**
```javascript
"use client";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokensFrontend } from "@/config/supertokens";

if (typeof window !== "undefined") {
  initSuperTokensFrontend();
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SuperTokensWrapper>{children}</SuperTokensWrapper>
      </body>
    </html>
  );
}
```

#### 3.3 Update Login Form

**Before (Manual):**
```javascript
const handleLogin = async (data) => {
  const response = await apiClient.post('/auth/login', data);
  const { user, csrfToken } = response.data;

  // Manual CSRF storage
  sessionStorage.setItem('csrf_token', csrfToken);

  // Manual user state
  setUser(user);
  localStorage.setItem('user', JSON.stringify(user));

  router.push('/dashboard');
};
```

**After (SuperTokens):**
```javascript
import { signIn } from "supertokens-auth-react/recipe/emailpassword";

const handleLogin = async (data) => {
  const response = await signIn({
    formFields: [
      { id: "email", value: data.email },
      { id: "password", value: data.password }
    ]
  });

  if (response.status === "OK") {
    // ✅ Done! SuperTokens handled everything!
    router.push('/dashboard');
  } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
    setError("Invalid email or password");
  }
};
```

**Reduction: ~60 lines → ~15 lines!**

#### 3.4 Update API Client

**Before (Manual):**
```javascript
// axios.js
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Manual CSRF injection
apiClient.interceptors.request.use((config) => {
  const csrfToken = sessionStorage.getItem('csrf_token');
  if (csrfToken && config.method !== 'get') {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Manual session expired handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Manual redirect
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**After (SuperTokens):**
```javascript
// api.js
export async function apiCall(endpoint, options) {
  const response = await fetch(`${API_DOMAIN}${endpoint}`, {
    ...options,
    credentials: "include", // Send cookies
  });

  // ✅ SuperTokens handles everything:
  // - Automatic cookie sending
  // - Automatic CSRF
  // - Automatic token refresh
  // - Automatic redirect on 401

  return response.json();
}
```

**Reduction: ~50 lines → ~10 lines!**

#### 3.5 Update Protected Routes

**Before:**
```javascript
// Manual protection
export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);

  if (isLoading) return <Loading />;
  if (!user) return null;

  return <>{children}</>;
}
```

**After:**
```javascript
import { ProtectedRoute as STProtectedRoute } from '@/components/ProtectedRoute';

// Or use SuperTokens SessionAuth
import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function DashboardPage() {
  return (
    <SessionAuth>
      {/* Your content */}
    </SessionAuth>
  );
}
```

### Step 4: Remove Old Code (15 min)

Delete files yang tidak diperlukan:

**Backend:**
- ❌ `auth/login.js` (replaced by SuperTokens)
- ❌ `auth/register.js`
- ❌ `auth/logout.js`
- ❌ `middleware/auth.js`
- ❌ `utils/csrf.js`
- ❌ `utils/jwt.js`

**Frontend:**
- ❌ `lib/csrf.js`
- ❌ Old AuthContext (if using SuperTokens SessionAuth)
- ❌ Manual protected route components

### Step 5: Update Environment Variables

**Backend .env:**
```bash
# Add:
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.com
# Or self-hosted: http://localhost:3567

# Remove:
# JWT_SECRET (handled by SuperTokens)
```

**Frontend .env.local:**
```bash
# Add:
NEXT_PUBLIC_API_DOMAIN=http://localhost:3001
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000

# Remove:
# Any manual auth configs
```

## 🧪 Testing Migration

### Test Checklist

**Backend:**
- [ ] Sign up works → `POST /auth/signup`
- [ ] Sign in works → `POST /auth/signin`
- [ ] Sign out works → `POST /auth/signout`
- [ ] Session refresh works (automatic)
- [ ] Protected endpoints work
- [ ] CORS works from frontend

**Frontend:**
- [ ] Pre-built UI shows at `/auth`
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Protected routes redirect if not logged in
- [ ] Protected routes accessible when logged in
- [ ] Logout works
- [ ] Token refresh works (automatic)
- [ ] API calls work

**Cookies:**
- [ ] `sAccessToken` present (HttpOnly)
- [ ] `sRefreshToken` present (HttpOnly)
- [ ] `sFrontToken` present (NOT HttpOnly - just metadata)
- [ ] Cookies cleared on logout

## 📊 Before vs After

| Metric | Before | After | Saved |
|--------|--------|-------|-------|
| **Backend Code** | ~250 lines | ~50 lines | 80% ↓ |
| **Frontend Code** | ~200 lines | ~40 lines | 80% ↓ |
| **Dependencies** | 6 packages | 1 package | 83% ↓ |
| **Manual Features** | CSRF, refresh, etc | None | 100% ↓ |
| **Maintenance** | High | Low | 90% ↓ |
| **Security Updates** | Manual | Automatic | 100% ↓ |

## 🎯 Common Migration Challenges

### Challenge 1: Custom User Fields

**Problem**: You have custom fields (name, phone, etc)

**Solution**:
```javascript
// Backend
EmailPassword.init({
  signUpFeature: {
    formFields: [
      { id: "email" },
      { id: "password" },
      { id: "name", optional: false },  // ← Custom field!
      { id: "phone", optional: true },  // ← Custom field!
    ]
  },
  override: {
    functions: (original) => ({
      ...original,
      signUp: async (input) => {
        const response = await original.signUp(input);
        if (response.status === "OK") {
          // Save custom fields to your database
          const name = input.formFields.find(f => f.id === 'name').value;
          await saveUserProfile(response.user.id, { name });
        }
        return response;
      }
    })
  }
});
```

### Challenge 2: Existing Sessions

**Problem**: Users already logged in dengan old system

**Solution**: Gradual migration
```javascript
// Support both old and new sessions temporarily
app.get('/api/profile', async (req, res) => {
  // Try SuperTokens session first
  try {
    await verifySession()(req, res, () => {});
    const userId = req.session.getUserId();
    // Handle with SuperTokens
  } catch {
    // Fallback to old auth
    const token = req.cookies.auth_token;
    if (token) {
      // Handle with old auth
    }
  }
});

// After some time, remove old auth support
```

### Challenge 3: Custom Authorization Logic

**Problem**: You have complex role/permission checks

**Solution**: Use session metadata
```javascript
// Store in session
Session.init({
  override: {
    functions: (original) => ({
      ...original,
      createNewSession: async (input) => {
        // Add custom claims
        const user = await getUser(input.userId);
        return original.createNewSession({
          ...input,
          accessTokenPayload: {
            ...input.accessTokenPayload,
            role: user.role,
            permissions: user.permissions,
          }
        });
      }
    })
  }
});

// Access in protected routes
app.get('/admin', verifySession(), (req, res) => {
  const { role } = req.session.getAccessTokenPayload();
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Admin logic
});
```

## 🚀 Rollout Strategy

### Option 1: Big Bang (Fastest)
```
Week 1: Development + Testing
Week 2: Deploy to production
Week 3: Monitor + fix issues
```

### Option 2: Gradual (Safest)
```
Week 1: Deploy backend with dual support (old + new)
Week 2: Test with internal users
Week 3: Roll out to 10% users
Week 4: Roll out to 50% users
Week 5: Roll out to 100% users
Week 6: Remove old code
```

## ✅ Migration Complete Checklist

- [ ] All auth flows tested
- [ ] No console errors
- [ ] Cookies working correctly
- [ ] Protected routes working
- [ ] API calls working
- [ ] Token refresh working
- [ ] Logout working
- [ ] Old code removed
- [ ] Documentation updated
- [ ] Team trained on new system

---

**Estimated Total Migration Time**: 2-4 hours
**Code Reduction**: ~80%
**Maintenance Reduction**: ~90%

**Result**: Production-ready auth with enterprise features! 🎉
