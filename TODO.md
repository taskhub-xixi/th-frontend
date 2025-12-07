# TODO - Auth Feature Improvements

## ✅ Completed Today (2025-12-07)

### Backend Setup - HttpOnly Cookie Authentication
**Status: COMPLETED** ✅

Backend setup lengkap di `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/`:

1. **Dependencies Installed**:
   - ✅ bcryptjs (proper password hashing)
   - ✅ jsonwebtoken (JWT token generation)
   - ✅ cookie-parser (cookie management)

2. **Middleware Created**:
   - ✅ `middlewares/csrfMiddleware.js` - CSRF token generation & validation
   - ✅ `middlewares/authMiddleware.js` - JWT verification dari httpOnly cookie

3. **Controller Updated**:
   - ✅ `controllers/authController.js` - Implement bcrypt + JWT + httpOnly cookies
   - ✅ Register endpoint dengan bcrypt hashing
   - ✅ Login endpoint yang set httpOnly cookie + return CSRF token
   - ✅ Logout endpoint yang clear cookie
   - ✅ Me endpoint (get current user - protected)
   - ✅ CSRF token endpoint (protected)

4. **Server Configuration**:
   - ✅ `server.js` - Added cookie-parser middleware
   - ✅ CORS configured dengan `credentials: true`
   - ✅ Proper error handling

5. **Testing**:
   - ✅ Created `test-auth.js` - Node.js test script
   - ✅ Created `test-api.sh` - Bash test script
   - ✅ Backend tested dan berfungsi dengan benar

6. **Frontend Implementation** (bestpractice-httpcookie/):
   - ✅ `lib/axios.js` - Added `withCredentials: true`
   - ✅ `lib/csrf.js` - CSRF token management utilities
   - ✅ `context/AuthContext.jsx` - Updated tanpa token storage
   - ✅ `features/auth/login/components/LoginForm.jsx` - HttpOnly cookie flow
   - ✅ Request interceptor inject CSRF token untuk non-GET requests

### 🎯 Next Step:
**Test dari browser** - Start frontend (`npm run dev`) dan test login flow untuk verify cookies work di browser environment!

**Available Test User**:
- Email: `httpcookie@test.com`
- Password: `password123`

---

## 🔴 High Priority (Fix Now)

### 1. Fix Typo Environment Variable
- [ ] File: `src/lib/axios.js:4`
- [ ] Ubah `NEXT_PUBLIV_API_URL` menjadi `NEXT_PUBLIC_API_URL`
- [ ] Pastikan env variable sudah di set di `.env.local`

### 2. Fix Typo Parameter Error
- [ ] File: `src/lib/axios.js:22`
- [ ] Ubah `(erorr)` menjadi `(error)`

### 3. Fix Zod Email Validation
- [ ] File: `src/features/auth/login/form/login.js:4`
- [ ] Ubah `z.email()` menjadi `z.string().email()`
- [ ] File: `src/features/auth/register/form/register.js:5`
- [ ] Ubah `z.email()` menjadi `z.string().email()`

### 4. Simpan Token Setelah Login
- [ ] File: `src/features/auth/login/components/LoginForm.jsx:38`
- [ ] Extract token dari response: `const { token, user } = response.data`
- [ ] Simpan token: `localStorage.setItem("auth_token", token)`
- [ ] Simpan user: `localStorage.setItem("user", JSON.stringify(user))`

### 5. Integrasikan Login dengan AuthContext
- [ ] File: `src/features/auth/login/components/LoginForm.jsx`
- [ ] Import `useAuth` hook
- [ ] Panggil `setUser(user)` setelah login berhasil
- [ ] File: `src/features/auth/register/components/signUpForm.jsx`
- [ ] (Optional) Auto-login setelah register atau redirect ke login

### 6. Fix Error Message Extraction
- [ ] File: `src/features/auth/login/components/LoginForm.jsx:44`
- [ ] Ubah `error.response?.message` menjadi `error.response?.data?.message`
- [ ] File: `src/features/auth/register/components/signUpForm.jsx:42`
- [ ] Ubah `error.response?.message` menjadi `error.response?.data?.message`

### 7. Hapus Console.log di Production
- [ ] File: `src/lib/axios.js:18-19`
- [ ] Hapus atau ganti dengan proper logging library
- [ ] File: `src/lib/axios.js:36,38,40`
- [ ] Ganti console.log dengan proper error handling/logging

---

## 🟡 Medium Priority

### 8. Security: Pindah Token ke httpOnly Cookies ✅ COMPLETED
- [x] Research: Koordinasi dengan backend untuk set httpOnly cookie
- [x] Update `src/lib/axios.js`: Set `withCredentials: true`
- [x] Remove localStorage token storage
- [x] Update logout untuk clear cookies (backend endpoint)
- **Implementation**: Lihat folder `bestpractice-httpcookie/` dan backend di `th-backend/`

### 9. Add Protected Route Middleware
- [ ] Create: `src/middleware.js` atau `src/lib/auth-guard.js`
- [ ] Implement route protection untuk `/dashboard` dan routes lain yang butuh auth
- [ ] Redirect ke `/login` jika belum auth
- [ ] Handle loading state saat check auth

### 10. Implement Token Refresh Mechanism
- [ ] Add refresh token endpoint call di axios interceptor
- [ ] Handle 401 error dengan retry after refresh
- [ ] Implement refresh token storage
- [ ] Add token expiry check

### 11. Fix SSR/Hydration Issues
- [ ] File: `src/context/AuthContext.jsx:13`
- [ ] Add guard untuk localStorage access (check `typeof window !== 'undefined'`)
- [ ] Atau gunakan library seperti `use-local-storage-state`

### 12. Error Handling di Axios Interceptor
- [ ] File: `src/lib/axios.js:30`
- [ ] Add null check: `const status = error.response?.status`
- [ ] Handle network errors (no response)
- [ ] Add user-friendly error messages

### 13. Add Loading State di AuthContext
- [ ] Sudah ada `isLoading`, tapi perlu digunakan di login/register
- [ ] Prevent multiple submissions
- [ ] Show loading indicator

---

## 🟢 Low Priority

### 14. Code Refactoring: Extract Duplicate Code
- [ ] Create reusable hook: `src/hooks/useAuthForm.jsx`
- [ ] Extract common form logic dari LoginForm & SignupForm
- [ ] Extract common error handling

### 15. Improve Code Consistency
- [ ] Unify naming convention: `onSubmit` vs `signupUser` → pilih satu
- [ ] Unify language: Indonesian or English for user messages
- [ ] Consistent error message format

### 16. Add TypeScript
- [ ] Rename files: `.jsx` → `.tsx`, `.js` → `.ts`
- [ ] Add type definitions untuk API responses
- [ ] Add type definitions untuk form data
- [ ] Add type safety untuk AuthContext

### 17. UX Improvements
- [ ] Add "Remember Me" feature
- [ ] Add email verification flow
- [ ] Add password strength indicator
- [ ] Add "Show/Hide Password" toggle
- [ ] Add better error messages (field-specific)

### 18. Testing
- [ ] Add unit tests untuk form validation
- [ ] Add integration tests untuk auth flow
- [ ] Add E2E tests untuk login/register

### 19. Performance Optimization
- [ ] Lazy load auth forms
- [ ] Add proper loading skeletons
- [ ] Optimize re-renders di AuthContext

### 20. Documentation
- [ ] Add JSDoc comments
- [ ] Document auth flow
- [ ] Add README untuk auth feature

---

## 📝 Notes

- Backend API response structure perlu dikonfirmasi (format token, user data, dll)
- Pastikan CORS settings di backend sudah benar jika pakai withCredentials
- Perlu diskusi dengan backend tentang refresh token strategy
- Pertimbangkan gunakan library seperti `react-query` atau `swr` untuk data fetching

---

## 🎯 Suggested Order

1. Fix semua bugs (Items 1-7) → Biar aplikasi berfungsi dengan benar
2. Security improvements (Item 8) → Protect user data
3. Protected routes (Item 9) → Prevent unauthorized access
4. Code quality (Items 11-15) → Maintainability
5. Advanced features (Items 16-20) → Enhancement

---

## 📚 Additional Resources Created Today

### Backend Documentation:
- `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/HTTP-Request-Frontend.md` - Frontend integration guide
- `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/PETUNJUK_API.md` - API usage instructions (Bahasa)
- `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/SETUP_GUIDE.md` - Complete setup guide
- `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/test-auth.js` - Automated test script
- `/home/saken/Documents/frontend_stuff/project/taskhub/th-backend/test-api.sh` - Shell test script

### Backend Endpoints:
```
✅ POST   /api/auth/register     - Register new user
✅ POST   /api/auth/login        - Login (sets httpOnly cookie + returns CSRF)
✅ POST   /api/auth/logout       - Logout (clears cookie) [protected]
✅ GET    /api/auth/me           - Get current user [protected]
✅ GET    /api/auth/csrf-token   - Get/refresh CSRF token [protected]
✅ GET    /api/health            - Health check
✅ GET    /                      - List all users (testing only)
```

### Environment Configuration:
Backend `.env` configured dengan:
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRES_IN` - Token expiration (1h)
- `FRONTEND_URL` - CORS origin (http://localhost:3000)
- `PORT` - Server port (5000)

---

**Last Updated:** 2025-12-07 (Backend implementation completed)
