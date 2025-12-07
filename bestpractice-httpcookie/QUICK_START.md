# Quick Start - HttpOnly Cookie Auth

Panduan cepat untuk test implementasi httpOnly cookie dalam 10 menit.

## 🚀 Quick Setup (10 minutes)

### Step 1: Setup Backend (3 menit)

```bash
# 1. Create backend folder
mkdir auth-backend
cd auth-backend

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express cors bcryptjs jsonwebtoken cookie-parser dotenv

# 4. Copy backend code
cp ../bestpractice-httpcookie/backend-examples/express-auth.js server.js
cp ../bestpractice-httpcookie/backend-examples/.env.example .env

# 5. Edit .env
nano .env
# Set:
# PORT=3001
# JWT_SECRET=my-secret-key
# FRONTEND_URL=http://localhost:3000
# NODE_ENV=development

# 6. Start server
node server.js
```

Expected output:
```
✅ Server running on http://localhost:3001
✅ CORS enabled for: http://localhost:3000
✅ HttpOnly cookies enabled
```

### Step 2: Test Backend dengan curl (2 menit)

```bash
# Test Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -v

# Look for in response:
# Set-Cookie: auth_token=...; HttpOnly; Path=/; SameSite=Lax
```

### Step 3: Update Frontend (3 menit)

```bash
# Di folder frontend
cd th-frontend

# Copy files
cp bestpractice-httpcookie/axios.js src/lib/
cp bestpractice-httpcookie/csrf.js src/lib/
cp bestpractice-httpcookie/AuthContext.jsx src/context/
cp bestpractice-httpcookie/LoginForm.jsx src/features/auth/login/components/
cp bestpractice-httpcookie/LogoutButton.jsx src/components/

# Update .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" >> .env.local

# Start frontend
npm run dev
```

### Step 4: Test di Browser (2 menit)

1. **Login**:
   - Go to http://localhost:3000/login
   - Email: `test@example.com`
   - Password: `password123`
   - Click Login

2. **Check Cookie**:
   - Open DevTools (F12)
   - Application tab → Cookies → http://localhost:3000
   - Should see `auth_token` with:
     - ✅ HttpOnly: true
     - ✅ SameSite: Lax
     - ✅ Path: /

3. **Verify Protection**:
   ```javascript
   // In console
   document.cookie
   // Should NOT show auth_token! (because httpOnly)
   ```

4. **Test API Call**:
   - Network tab → Make any API request
   - Check request headers → Should auto-send cookie
   - Check response → Should work!

## 🔍 Debug Checklist

### Backend
- [ ] Server running on port 3001
- [ ] CORS enabled with `credentials: true`
- [ ] Login returns `{user, csrfToken}`
- [ ] Response header has `Set-Cookie`

### Frontend
- [ ] Running on port 3000
- [ ] `NEXT_PUBLIC_API_URL` set to `http://localhost:3001`
- [ ] axios has `withCredentials: true`
- [ ] Login doesn't save token to localStorage

### Browser
- [ ] Cookie visible in DevTools
- [ ] Cookie has HttpOnly flag
- [ ] `document.cookie` doesn't show token
- [ ] Requests auto-send cookie

## 🐛 Common Issues & Fixes

### 1. Cookie Tidak Tersimpan

**Check:**
```javascript
// Backend
app.use(cors({
  origin: 'http://localhost:3000',  // ← Must match exactly!
  credentials: true  // ← Must be true!
}));

// Frontend
const apiClient = axios.create({
  withCredentials: true  // ← Must be true!
});
```

### 2. CORS Error

**Error**: `Access-Control-Allow-Origin`

**Fix**:
```bash
# Backend .env
FRONTEND_URL=http://localhost:3000  # No trailing slash!

# Check browser console for actual URL
```

### 3. 401 Unauthorized

**Check**:
```javascript
// Backend middleware
const token = req.cookies.auth_token;  // ← Getting from cookies?
console.log('Token:', token);

// Frontend - is cookie being sent?
// Check Network tab → Request Headers → Cookie
```

### 4. CSRF Token Error

**Fix**:
```javascript
// Frontend - check CSRF stored
console.log('CSRF:', sessionStorage.getItem('csrf_token'));

// Backend - skip CSRF for GET
if (req.method === 'GET') return next();
```

## 📊 Visual Flow Test

```
┌──────────────────────────────────────────────────────┐
│ STEP 1: Login                                        │
├──────────────────────────────────────────────────────┤
│ Frontend → POST /api/auth/login                      │
│          → {email, password}                         │
│                                                      │
│ Backend  → Validate                                  │
│          → Generate JWT                              │
│          → Set-Cookie: auth_token=xxx; HttpOnly     │
│          → Response: {user, csrfToken}              │
│                                                      │
│ Frontend → Save user to context                      │
│          → Save csrfToken to sessionStorage         │
│          → NO token storage!                         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ STEP 2: Make Authenticated Request                   │
├──────────────────────────────────────────────────────┤
│ Frontend → GET /api/user/profile                     │
│          → Browser auto-send: Cookie: auth_token=xx │
│          → Axios add: X-CSRF-Token: abc123          │
│                                                      │
│ Backend  → Verify cookie JWT                         │
│          → Verify CSRF token                         │
│          → Response: {data}                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ STEP 3: Logout                                       │
├──────────────────────────────────────────────────────┤
│ Frontend → POST /api/auth/logout                     │
│          → Cookie auto-sent                          │
│                                                      │
│ Backend  → Clear cookie                              │
│          → Set-Cookie: auth_token=; expires=past    │
│                                                      │
│ Frontend → Clear user from context                   │
│          → Clear csrfToken                           │
│          → Redirect to /login                        │
└──────────────────────────────────────────────────────┘
```

## 🎯 Success Criteria

After setup, you should be able to:

- [x] Start backend server
- [x] Login successfully
- [x] See httpOnly cookie in browser
- [x] Cookie NOT visible in `document.cookie`
- [x] Make authenticated requests
- [x] Requests auto-send cookie
- [x] Logout clears cookie
- [x] Can't access protected routes after logout

## 📚 Next Steps

1. ✅ **Understood the flow?** → Read `IMPLEMENTATION_GUIDE.md`
2. ✅ **Want details?** → Read `README.md`
3. ✅ **Compare approaches?** → Read `COMPARISON.md`
4. ✅ **Ready for production?** → Look into SuperTokens

## 🎓 Key Takeaways

**What you learned:**
1. ✅ httpOnly cookies protect against XSS
2. ✅ Browser automatically sends cookies
3. ✅ Need CSRF protection for httpOnly cookies
4. ✅ Backend must set/clear cookies
5. ✅ More secure than localStorage

**What's next:**
- SuperTokens does all of this automatically
- Plus: session management, refresh tokens, social login, etc
- But now you understand HOW it works!

---

**Time spent**: ~10 minutes
**Knowledge gained**: Production-ready auth concepts! 🎉
