# HttpOnly Cookie Implementation - Best Practice Auth

Implementasi authentication menggunakan **httpOnly cookies** untuk keamanan maksimal.

## 🔒 Mengapa HttpOnly Cookie?

### LocalStorage (Before)
```javascript
// ❌ JavaScript bisa akses token
const token = localStorage.getItem("auth_token");
console.log(token); // Hacker bisa baca via XSS!
```

### HttpOnly Cookie (Now)
```javascript
// ✅ JavaScript TIDAK BISA akses cookie
document.cookie; // "auth_token" tidak muncul!
// Cookie hanya dikirim otomatis oleh browser
```

## 🎯 Key Concepts

### 1. Backend Set Cookie (Bukan Frontend)
```javascript
// Backend response header:
Set-Cookie: auth_token=eyJhbG...; HttpOnly; Secure; SameSite=Strict
```

### 2. Browser Auto-Send Cookie
```javascript
// Frontend tidak perlu manual add Authorization header
// Browser automatically send cookie di setiap request ke same domain
```

### 3. CSRF Protection Needed
```javascript
// Karena cookie auto-send, butuh CSRF token
// untuk prevent CSRF attacks
```

## 📊 Security Comparison

| Attack Type | LocalStorage | HttpOnly Cookie |
|-------------|--------------|-----------------|
| XSS (Cross-Site Scripting) | ❌ Vulnerable | ✅ Protected |
| CSRF (Cross-Site Request Forgery) | ✅ Protected | ❌ Vulnerable (need CSRF token) |
| Man-in-the-Middle | ⚠️ Depends | ✅ Protected (with Secure flag) |

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                           │
└─────────────────────────────────────────────────────────────┘

Frontend                         Backend
   │                                │
   │  POST /api/auth/login          │
   │  { email, password }           │
   ├───────────────────────────────>│
   │                                │ Validate credentials
   │                                │ Generate JWT token
   │                                │
   │  Set-Cookie: auth_token=xxx    │
   │  HttpOnly; Secure; SameSite    │
   │<───────────────────────────────┤
   │                                │
   │  { user: {...} }               │
   │<───────────────────────────────┤
   │                                │
   │  Save user to state/context    │
   │  (NO token storage!)           │
   │                                │

┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED REQUEST                     │
└─────────────────────────────────────────────────────────────┘

Frontend                         Backend
   │                                │
   │  GET /api/user/profile         │
   │  Cookie: auth_token=xxx        │ ← Browser auto-send!
   │  X-CSRF-Token: abc123          │
   ├───────────────────────────────>│
   │                                │ Validate cookie
   │                                │ Validate CSRF token
   │                                │
   │  { user: {...} }               │
   │<───────────────────────────────┤
   │                                │

┌─────────────────────────────────────────────────────────────┐
│                         LOGOUT FLOW                          │
└─────────────────────────────────────────────────────────────┘

Frontend                         Backend
   │                                │
   │  POST /api/auth/logout         │
   │  Cookie: auth_token=xxx        │
   ├───────────────────────────────>│
   │                                │
   │  Set-Cookie: auth_token=;      │
   │  expires=Thu, 01 Jan 1970      │ ← Clear cookie
   │<───────────────────────────────┤
   │                                │
   │  Clear user from state         │
   │                                │
```

## 🚀 Implementation Files

### Frontend (`/bestpractice-httpcookie/`)
1. **LoginForm.jsx** - Login form (no token storage)
2. **SignUpForm.jsx** - Register form
3. **axios.js** - Axios with `withCredentials: true`
4. **AuthContext.jsx** - Auth context (no token management)
5. **csrf.js** - CSRF token management

### Backend (`/backend-examples/`)
1. **express-auth.js** - Express.js implementation
2. **nestjs-auth.controller.ts** - NestJS implementation
3. **middleware.js** - Auth middleware
4. **csrf-middleware.js** - CSRF protection

## ⚙️ Setup Requirements

### Frontend (Next.js)
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (Express/NestJS)
```bash
# .env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

## 🔧 CORS Configuration

Sangat penting! Backend harus allow credentials:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,                // ← WAJIB!
}));
```

## 📝 Key Differences dari LocalStorage

| Aspect | LocalStorage | HttpOnly Cookie |
|--------|--------------|-----------------|
| Token Storage | Frontend (`localStorage`) | Backend (`Set-Cookie` header) |
| Token Access | JavaScript bisa baca | JavaScript tidak bisa baca |
| Send Token | Manual (`Authorization` header) | Otomatis (browser send cookie) |
| CSRF Protection | Tidak perlu | **WAJIB** |
| CORS Config | Simple | Need `credentials: true` |
| Backend Changes | Minimal | **Required** |

## ⚠️ Important Notes

1. **Cookie Domain**: Cookie hanya dikirim ke same domain/subdomain
2. **HTTPS Required**: `Secure` flag butuh HTTPS (disable di development)
3. **SameSite**:
   - `Strict` = Paling aman, tapi break OAuth redirects
   - `Lax` = Balance security & usability
   - `None` = Perlu `Secure` flag
4. **CSRF**: Wajib implement CSRF protection!

## 🎯 Next Steps

1. ✅ Baca flow diagram di atas
2. ✅ Setup backend dengan contoh code di `backend-examples/`
3. ✅ Test login flow di Postman/Thunder Client
4. ✅ Implement frontend code
5. ✅ Test di browser
6. ✅ Migrate ke SuperTokens (optional)

---

**Ready?** Lanjut ke `IMPLEMENTATION_GUIDE.md` untuk step-by-step! 🚀
