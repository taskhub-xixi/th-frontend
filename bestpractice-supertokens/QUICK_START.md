# Quick Start - SuperTokens (15 menit)

Panduan super cepat untuk setup SuperTokens dan lihat magic-nya! ✨

## 🎯 What You'll Get

Setelah 15 menit:
- ✅ Login/Register berfungsi
- ✅ HttpOnly cookies automatic
- ✅ CSRF protection automatic
- ✅ Token refresh automatic
- ✅ Session management automatic

## 🚀 Setup (15 minutes)

### Step 1: Backend Setup (5 menit)

```bash
# 1. Create backend folder
mkdir supertokens-backend
cd supertokens-backend

# 2. Initialize
npm init -y

# 3. Install SuperTokens
npm install supertokens-node express cors dotenv

# 4. Copy files
cp ../bestpractice-supertokens/backend/server.js .
cp ../bestpractice-supertokens/backend/config.js .
cp ../bestpractice-supertokens/backend/.env.example .env

# 5. Edit .env (minimal config)
echo "PORT=3001
APP_NAME=TaskHub
API_DOMAIN=http://localhost:3001
WEBSITE_DOMAIN=http://localhost:3000
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.com
NODE_ENV=development" > .env

# 6. Add "type": "module" ke package.json
# Atau copy dari bestpractice-supertokens/backend/package.json

# 7. Start server
node server.js
```

Expected output:
```
==================================================
✅ Server running on http://localhost:3001
✅ SuperTokens initialized
✅ CORS enabled for: http://localhost:3000
==================================================

📚 Available Endpoints:
   Auth endpoints: /auth/*
   - POST /auth/signup
   - POST /auth/signin
   - POST /auth/signout
   - POST /auth/session/refresh
...
```

### Step 2: Test Backend (2 menit)

```bash
# Test sign up
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "formFields": [
      {"id": "email", "value": "test@example.com"},
      {"id": "password", "value": "password123"},
      {"id": "name", "value": "Test User"}
    ]
  }' -v

# Look for in response:
# Set-Cookie: sAccessToken=...; HttpOnly; ...
# Set-Cookie: sRefreshToken=...; HttpOnly; ...
```

### Step 3: Frontend Setup (5 menit)

```bash
# Di folder Next.js kamu
cd th-frontend

# 1. Install SuperTokens
npm install supertokens-auth-react supertokens-web-js

# 2. Copy files
mkdir -p src/config
cp bestpractice-supertokens/frontend/config/supertokens.js src/config/
cp bestpractice-supertokens/frontend/config/appInfo.js src/config/
cp bestpractice-supertokens/frontend/app/layout.js src/app/  # Backup dulu!
cp -r bestpractice-supertokens/frontend/app/auth src/app/
cp -r bestpractice-supertokens/frontend/components src/

# 3. Create .env.local
echo "NEXT_PUBLIC_API_DOMAIN=http://localhost:3001
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000" > .env.local

# 4. Start frontend
npm run dev
```

### Step 4: Test Full Flow (3 menit)

#### Test Pre-built UI (Fastest!)

1. **Go to auth page**:
   ```
   http://localhost:3000/auth
   ```

2. **Sign Up**:
   - Click "Sign Up" tab
   - Fill: email, password, name
   - Submit
   - Should redirect to home atau dashboard

3. **Check Cookies**:
   - F12 → Application → Cookies
   - Should see:
     - ✅ `sAccessToken` (HttpOnly)
     - ✅ `sRefreshToken` (HttpOnly)
     - ✅ `sFrontToken` (NOT httpOnly - just metadata)

4. **Test Login**:
   - Go back to /auth
   - Should auto-redirect jika sudah login!
   - Or logout dan login lagi

5. **Test Protected Route**:
   ```
   http://localhost:3000/dashboard
   ```
   - Should work if logged in
   - Should redirect to /auth if not logged in

#### Test dengan Custom UI (Optional)

```javascript
// src/app/login/page.js
import { CustomLoginForm } from '@/components/CustomLoginForm';

export default function LoginPage() {
  return <CustomLoginForm />;
}
```

## 🎉 Success Checklist

After setup, kamu harus bisa:

- [x] Backend running di port 3001
- [x] Frontend running di port 3000
- [x] Sign up works
- [x] Login works
- [x] Cookies visible di DevTools dengan HttpOnly flag
- [x] Protected routes redirect to /auth if not logged in
- [x] Logout works
- [x] API calls work (check /dashboard)

## 🔍 Debug Common Issues

### 1. CORS Error

**Error**: `Access-Control-Allow-Origin`

**Fix**:
```javascript
// backend/config.js - check CORS config
app.use(cors({
  origin: process.env.WEBSITE_DOMAIN,  // Must match frontend!
  allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()],
  credentials: true,
}));

// .env
WEBSITE_DOMAIN=http://localhost:3000  // No trailing slash!
```

### 2. "SuperTokens not initialized"

**Error**: `SuperTokens.init must be called before...`

**Fix**:
```javascript
// frontend/app/layout.js
// Make sure initSuperTokensFrontend() is called!
if (typeof window !== "undefined") {
  initSuperTokensFrontend();
}
```

### 3. Redirect Loop

**Error**: Keeps redirecting between /auth and /dashboard

**Fix**:
```javascript
// Check appInfo is SAME di frontend dan backend!
// frontend/config/appInfo.js
// backend/config.js

// Must match:
// - appName
// - apiDomain
// - websiteDomain
// - apiBasePath
// - websiteBasePath
```

### 4. "Cannot find module" Errors

**Fix**:
```bash
# Make sure you have "type": "module" in package.json
# Or rename files to .mjs

# backend/package.json
{
  "type": "module",
  ...
}
```

## 📊 What Just Happened?

```
┌─────────────────────────────────────────────────────┐
│ Sign Up Flow                                        │
└─────────────────────────────────────────────────────┘

1. User submit email + password
   ↓
2. POST /auth/signup
   ↓
3. SuperTokens validates & creates user
   ↓
4. Creates session + sets httpOnly cookies
   ├─ sAccessToken (short-lived, 1hr)
   ├─ sRefreshToken (long-lived, 100 days)
   └─ sFrontToken (metadata, NOT httpOnly)
   ↓
5. User automatically logged in!

┌─────────────────────────────────────────────────────┐
│ API Call Flow                                       │
└─────────────────────────────────────────────────────┘

1. Frontend: fetch('/api/user/profile')
   ↓
2. Browser AUTO sends cookies
   ↓
3. Backend: verifySession() middleware
   ├─ Validates sAccessToken
   ├─ If expired → auto refresh from sRefreshToken
   └─ Sets new cookies
   ↓
4. Return data to frontend
   ↓
5. All automatic! No manual token management!
```

## 🎓 Key Differences dari Manual Implementation

| Task | Manual (HttpOnly Cookie) | SuperTokens |
|------|-------------------------|-------------|
| Setup backend | 200+ lines | ~50 lines |
| Setup frontend | 150+ lines | ~30 lines |
| CSRF protection | Manual implementation | ✅ Automatic |
| Token refresh | Manual logic | ✅ Automatic |
| Session management | Manual database | ✅ Automatic |
| Handle errors | Manual | ✅ Automatic |
| Code yang kamu tulis | ~350 lines | ~80 lines |

## 🚀 Next Steps

1. ✅ **Paham flow?** → Read IMPLEMENTATION_GUIDE.md
2. ✅ **Customize UI?** → Read CUSTOM_UI_GUIDE.md
3. ✅ **Migrate?** → Read MIGRATION_GUIDE.md
4. ✅ **Add features?** → Social login, email verification, etc

## 💡 Quick Commands Reference

```bash
# Start backend
cd supertokens-backend && node server.js

# Start frontend
cd th-frontend && npm run dev

# Test signup via curl
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"formFields":[{"id":"email","value":"test@test.com"},{"id":"password","value":"password123"},{"id":"name","value":"Test"}]}'

# Access dashboard (in browser)
open http://localhost:3000/dashboard

# View SuperTokens dashboard
open http://localhost:3001/auth/dashboard
```

---

**Time spent**: ~15 minutes
**Lines of code**: ~80 lines
**Features**: Login, Register, Session, CSRF, Token Refresh - ALL WORKING! 🎉