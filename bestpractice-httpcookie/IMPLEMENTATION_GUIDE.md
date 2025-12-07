# HttpOnly Cookie Implementation Guide

Step-by-step guide untuk implement authentication dengan httpOnly cookies.

## 🎯 Prerequisites

1. **Backend**: Node.js + Express (atau framework lain)
2. **Frontend**: Next.js (sudah ada)
3. **Understanding**: Basic JWT dan cookies

## 📋 Step-by-Step Implementation

### STEP 1: Setup Backend

#### 1.1 Install Dependencies
```bash
cd backend-folder  # Folder backend kamu
npm install express cors bcryptjs jsonwebtoken cookie-parser dotenv
```

#### 1.2 Create Express Server
```bash
# Copy contoh implementation
cp bestpractice-httpcookie/backend-examples/express-auth.js backend/server.js
cp bestpractice-httpcookie/backend-examples/.env.example backend/.env
```

#### 1.3 Configure Environment
Edit `backend/.env`:
```bash
PORT=3001
JWT_SECRET=ganti-dengan-secret-key-yang-aman
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### 1.4 Test Backend
```bash
cd backend
node server.js
```

Expected output:
```
✅ Server running on http://localhost:3001
✅ CORS enabled for: http://localhost:3000
✅ HttpOnly cookies enabled
```

### STEP 2: Test Backend dengan Postman/Thunder Client

#### 2.1 Test Register
```http
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

#### 2.2 Test Login
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Expected response:
```json
{
  "user": {
    "id": "123",
    "email": "test@example.com",
    "name": "Test User"
  },
  "csrfToken": "abc123..."
}
```

**IMPORTANT**: Check response headers, should contain:
```
Set-Cookie: auth_token=eyJhbG...; HttpOnly; Path=/; SameSite=Lax
```

#### 2.3 Test Protected Route
```http
GET http://localhost:3001/api/user/profile
Cookie: auth_token=<token-from-login-response>
X-CSRF-Token: <csrf-token-from-login-response>
```

Expected response:
```json
{
  "message": "Protected data",
  "userId": "123"
}
```

### STEP 3: Setup Frontend

#### 3.1 Update Frontend Files
```bash
# Di folder frontend
cp bestpractice-httpcookie/axios.js src/lib/
cp bestpractice-httpcookie/csrf.js src/lib/
cp bestpractice-httpcookie/AuthContext.jsx src/context/
cp bestpractice-httpcookie/LoginForm.jsx src/features/auth/login/components/
cp bestpractice-httpcookie/LogoutButton.jsx src/components/
```

#### 3.2 Configure Environment
Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3.3 Update Imports (jika ada yang berbeda)
Check semua import paths di file yang di-copy, pastikan sesuai dengan struktur project kamu.

### STEP 4: Test Full Flow

#### 4.1 Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 4.2 Test Register
1. Buka http://localhost:3000/register
2. Fill form register
3. Submit
4. Should redirect ke /login

#### 4.3 Test Login
1. Buka http://localhost:3000/login
2. Login dengan credentials yang baru didaftar
3. Open DevTools → Application → Cookies
4. **Check**: Should see `auth_token` cookie with:
   - ✅ HttpOnly flag enabled
   - ✅ Secure flag (if HTTPS)
   - ✅ SameSite: Lax/Strict

5. Open DevTools → Console
6. Try: `document.cookie`
7. **Check**: `auth_token` should NOT appear! (karena httpOnly)

#### 4.4 Test Authenticated Request
1. After login, open DevTools → Network
2. Make any API request (e.g., get profile)
3. **Check request headers**:
   - ✅ `Cookie: auth_token=...` (auto-sent by browser)
   - ✅ `X-CSRF-Token: ...` (added by axios)
4. **Check response**: Should return data successfully

#### 4.5 Test Logout
1. Click logout button
2. **Check**: Cookie should be cleared
3. Try access protected page
4. Should redirect to /login

### STEP 5: Debugging Common Issues

#### Issue 1: Cookie tidak tersimpan
**Symptom**: Login success tapi cookie tidak ada di browser

**Solutions**:
```javascript
// 1. Check CORS configuration di backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // ← MUST be true!
}));

// 2. Check axios configuration di frontend
const apiClient = axios.create({
  withCredentials: true  // ← MUST be true!
});

// 3. Check SameSite setting
// Jika frontend & backend beda domain, use SameSite: 'none' + Secure: true
```

#### Issue 2: CORS error
**Symptom**: `Access-Control-Allow-Origin` error di console

**Solutions**:
```javascript
// Backend - pastikan CORS origin match dengan frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL,  // Must match exactly!
  credentials: true
}));

// Check .env
FRONTEND_URL=http://localhost:3000  // No trailing slash!
```

#### Issue 3: CSRF token error
**Symptom**: 403 Forbidden dengan message "Invalid CSRF token"

**Solutions**:
```javascript
// 1. Check CSRF token stored after login
const csrfToken = sessionStorage.getItem('csrf_token');
console.log('CSRF Token:', csrfToken);

// 2. Check axios sending CSRF token
// Di axios interceptor, pastikan:
config.headers['X-CSRF-Token'] = csrfToken;

// 3. Backend validate CSRF
// Skip CSRF untuk GET requests:
if (req.method === 'GET') return next();
```

#### Issue 4: Cookie tidak dikirim di request
**Symptom**: Backend error "Authentication required"

**Solutions**:
```javascript
// 1. Check withCredentials di axios
withCredentials: true  // Must be true!

// 2. Check cookie domain
// Cookie hanya dikirim ke same domain/subdomain
// localhost:3000 → localhost:3001 ✅ OK
// localhost:3000 → 127.0.0.1:3001 ❌ FAIL (beda domain)

// 3. Check cookie path
// Cookie dengan path='/api' hanya dikirim ke /api/*
// Gunakan path='/' untuk all routes
```

### STEP 6: Production Deployment

#### 6.1 Environment Variables
```bash
# Backend .env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://yourdomain.com

# Frontend .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### 6.2 Cookie Configuration untuk Production
```javascript
const getCookieConfig = () => ({
  httpOnly: true,
  secure: true,  // ✅ HTTPS required
  sameSite: 'strict',  // ✅ Maximum security
  maxAge: 24 * 60 * 60 * 1000,
  domain: '.yourdomain.com',  // ✅ Share across subdomains
});
```

#### 6.3 HTTPS Required
- httpOnly cookies dengan `Secure` flag HANYA bekerja di HTTPS
- Development: disable `secure` flag
- Production: WAJIB HTTPS

## 🔄 Flow Comparison

### Before (LocalStorage)
```
Frontend                    Backend
   │                           │
   │  Login Request            │
   ├──────────────────────────>│
   │                           │
   │  {token, user}            │
   │<──────────────────────────┤
   │                           │
   │  localStorage.setItem()   │
   │  (token stored)           │
   │                           │
   │  Next Request             │
   │  + Auth header            │ ← Manual
   ├──────────────────────────>│
```

### After (HttpOnly Cookie)
```
Frontend                    Backend
   │                           │
   │  Login Request            │
   ├──────────────────────────>│
   │                           │
   │  Set-Cookie header        │
   │  {user, csrfToken}        │
   │<──────────────────────────┤
   │                           │
   │  (NO token storage!)      │
   │                           │
   │  Next Request             │
   │  + Cookie (automatic)     │ ← Browser auto-send!
   │  + CSRF header            │
   ├──────────────────────────>│
```

## 📊 Checklist

### Backend Setup
- [ ] Express server running
- [ ] CORS configured dengan `credentials: true`
- [ ] cookie-parser middleware added
- [ ] JWT secret configured
- [ ] Login endpoint returns user + csrfToken
- [ ] Login endpoint sets httpOnly cookie
- [ ] Logout endpoint clears cookie
- [ ] Auth middleware validates cookie
- [ ] CSRF middleware validates token

### Frontend Setup
- [ ] axios configured dengan `withCredentials: true`
- [ ] CSRF token management implemented
- [ ] LoginForm NOT storing token
- [ ] LoginForm storing CSRF token
- [ ] AuthContext NOT managing token
- [ ] Logout calls backend endpoint
- [ ] Protected routes working

### Testing
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Cookie visible di DevTools
- [ ] Cookie has httpOnly flag
- [ ] Cookie NOT accessible via `document.cookie`
- [ ] Authenticated requests working
- [ ] CSRF protection working
- [ ] Logout clears cookie
- [ ] Can't access protected routes after logout

### Production Ready
- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] Secure cookie flag enabled
- [ ] SameSite strict
- [ ] Rate limiting added
- [ ] Input validation
- [ ] Error logging
- [ ] Database connected (not mock data)

## 🎓 Key Learnings

### What Changed?
1. **Token Storage**: Backend (cookie) instead of Frontend (localStorage)
2. **Token Sending**: Automatic (browser) instead of Manual (axios)
3. **Security**: XSS protected, but need CSRF protection
4. **Logout**: Must call backend to clear cookie

### Why Better?
1. ✅ **XSS Protection**: JavaScript cannot access httpOnly cookie
2. ✅ **Automatic**: Browser handles cookie sending
3. ✅ **Secure**: HTTPS + SameSite + Secure flags
4. ⚠️ **Trade-off**: Need CSRF protection & backend changes

## 🚀 Next Steps

1. ✅ **Understand the flow** - Debug dan test sampai paham
2. ✅ **Add database** - Replace mock data dengan real database
3. ✅ **Add refresh token** - Untuk long-lived sessions
4. ✅ **Add rate limiting** - Prevent brute force
5. ✅ **Migrate to SuperTokens** - Production-ready solution

---

**Questions?** Check README.md atau debug dengan DevTools!
