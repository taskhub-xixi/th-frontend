# Best Practice Auth Implementation (Tanpa Library)

File-file ini adalah implementasi auth dengan best practices **tanpa menggunakan library** seperti SuperTokens atau NextAuth.

## 📁 Files

1. **LoginForm.jsx** - Login form component yang sudah diperbaiki
2. **SignUpForm.jsx** - Register form component yang sudah diperbaiki
3. **axios.js** - Axios instance dengan proper interceptors
4. **AuthContext.jsx** - Auth context dengan SSR safety
5. **security-utils.js** - Utility functions untuk enkripsi token (optional)
6. **auth-middleware.js** - Middleware untuk protected routes

## ✅ Improvements dari kode original

### 1. Token Storage & Integration
- ✅ Token disimpan di localStorage setelah login
- ✅ User state di-update di AuthContext
- ✅ Proper synchronization antara localStorage dan context

### 2. Error Handling
- ✅ Fixed error message extraction: `error.response?.data?.message`
- ✅ Specific error handling berdasarkan status code
- ✅ Network error handling
- ✅ User-friendly error messages

### 3. Security Improvements
- ✅ SSR-safe localStorage access (check `typeof window`)
- ✅ Auto-redirect ke login saat 401 (unauthorized)
- ✅ Token cleanup saat logout
- ✅ Prevent infinite redirect loop

### 4. Code Quality
- ✅ Removed console.log di production code
- ✅ Added autocomplete attributes untuk accessibility
- ✅ Added id attributes untuk proper label association
- ✅ Consistent error handling pattern

### 5. UX Improvements
- ✅ Loading states
- ✅ Toast notifications
- ✅ Error displays
- ✅ Proper form validation

## 🔒 Security Considerations

### Current Approach (LocalStorage)
**Pros:**
- ✅ Simple implementation
- ✅ Works across tabs
- ✅ Persistent sessions

**Cons:**
- ❌ Vulnerable to XSS attacks
- ❌ Token accessible via JavaScript
- ❌ Manual token management

### Recommended Next Steps

#### Option 1: Token Encryption (Medium Security)
Enkripsi token sebelum simpan di localStorage:
```javascript
// See security-utils.js
const encryptedToken = encryptToken(token);
localStorage.setItem("auth_token", encryptedToken);
```

#### Option 2: HttpOnly Cookies (Better Security)
Backend set httpOnly cookie, frontend tidak perlu simpan token:
```javascript
// Backend
res.cookie("auth_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 3600000
});

// Frontend
// No localStorage needed!
// Just set withCredentials: true in axios
```

#### Option 3: SuperTokens (Best Security + Features)
Gunakan SuperTokens untuk production-ready auth system.

## 🚀 Usage

### Replace Files
1. Backup file original kamu
2. Copy file dari `bestpractice/` ke lokasi yang sesuai
3. Adjust import paths jika perlu

### Backend Response Format
Pastikan backend kamu return data dengan format:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Jika format berbeda, adjust di LoginForm.jsx line 42-43.

### Environment Variables
Pastikan `.env.local` sudah di-set:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 TODO Selanjutnya

1. **Protected Routes** - Implement route guards (lihat auth-middleware.js)
2. **Token Refresh** - Add refresh token mechanism
3. **Remember Me** - Add persistent login option
4. **Password Reset** - Implement forgot password flow
5. **Email Verification** - Add email verification
6. **2FA** - Add two-factor authentication

## 🔄 Migration ke SuperTokens

Setelah kamu paham konsep di atas, migrasi ke SuperTokens akan lebih mudah karena:
1. Kamu sudah paham flow auth
2. Kamu tahu error handling yang dibutuhkan
3. Kamu bisa compare security approach

SuperTokens akan handle semua ini secara otomatis dengan lebih secure.

## 📚 Resources

- [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [SuperTokens Docs](https://supertokens.com/docs)

---

**Last Updated:** 2025-12-07
