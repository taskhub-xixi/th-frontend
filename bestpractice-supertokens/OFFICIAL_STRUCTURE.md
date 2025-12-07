# Official SuperTokens Structure for Next.js App Directory

Based on official docs: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory

## 📁 File Structure (Official)

```
app/
├── config/
│   ├── appInfo.ts              ⭐ Shared config (frontend + backend)
│   ├── backend.ts              ⭐ Backend SuperTokens init
│   └── frontend.ts             ⭐ Frontend SuperTokens init
│
├── components/
│   ├── supertokensProvider.tsx ⭐ Wrapper component
│   ├── tryRefreshClientComponent.tsx ⭐ Session refresh handler
│   └── signOutButton.tsx       - Sign out button
│
├── api/
│   └── auth/
│       └── [...path]/
│           └── route.ts        ⭐ API route handler
│
├── auth/
│   └── [[...path]]/
│       └── page.tsx            ⭐ Auth UI page
│
├── dashboard/
│   └── page.tsx                - Protected page example
│
├── sessionUtils.ts             ⭐ SSR session utilities
├── layout.tsx                  ⭐ Root layout
└── page.tsx                    - Home page
```

## 🆚 Comparison: My Implementation vs Official

| Aspect | My Original | Official Docs | Status |
|--------|-------------|---------------|---------|
| **File Structure** |
| Config location | `/frontend/config/` | `/app/config/` | ✅ Fixed |
| Separate backend config | ❌ Single file | ✅ Separate `backend.ts` | ✅ Fixed |
| Provider component | ❌ Inline | ✅ Separate component | ✅ Fixed |
| **API Routes** |
| Route structure | ✅ Correct | ✅ `api/auth/[...path]` | ✅ Match |
| Handler method | ✅ getAppDirRequestHandler | ✅ Same | ✅ Match |
| **Session Management** |
| SSR utilities | ❌ Missing | ✅ `sessionUtils.ts` | ✅ Fixed |
| Try refresh component | ❌ Missing | ✅ Included | ✅ Fixed |
| **Frontend Config** |
| Window handler | ❌ Missing | ✅ Custom window handler | ✅ Fixed |
| Type annotations | ❌ JavaScript | ✅ TypeScript | ✅ Fixed |

## ⭐ Key Differences Found

### 1. File Organization
**Official**: Separate `backend.ts` and `frontend.ts`
```
app/config/
├── appInfo.ts     ← Shared
├── backend.ts     ← Backend only
└── frontend.ts    ← Frontend only
```

**Why**: Better separation, clearer imports

### 2. API Route Location
**Official**: Backend init happens in API route file
```typescript
// app/api/auth/[...path]/route.ts
import { backendConfig } from "@/app/config/backend";
SuperTokens.init(backendConfig());
```

**Why**: Next.js App Directory pattern, init per request

### 3. SuperTokensProvider Component
**Official**: Separate component file
```typescript
// app/components/supertokensProvider.tsx
"use client";
```

**Why**: Cleaner separation of client/server code

### 4. Session Utils for SSR
**Official**: `sessionUtils.ts` with helpers
```typescript
export async function getSSRSession() {
  // Using PreParsedRequest and CollectingResponse
}

export function withSession(handler) {
  // HOC for API routes
}
```

**Why**: Properly handle SSR with Next.js App Directory

### 5. TryRefresh Component
**Official**: Handle session refresh gracefully
```typescript
Session.attemptRefreshingSession()
  .then((hasSession) => {
    if (hasSession) router.refresh();
    else redirectToAuth();
  });
```

**Why**: Better UX when session expires

## 📦 Updated Implementation

Saya sudah create folder baru: `frontend-official/` dengan structure yang match official docs!

### Quick Comparison:

| Folder | Based On | Status |
|--------|----------|--------|
| `frontend/` | My original understanding | ⚠️ Working tapi not official structure |
| `frontend-official/` | Official docs | ✅ Matches official structure |

## 🚀 Which One to Use?

### Use `frontend-official/` if:
- ✅ You want official structure
- ✅ Following SuperTokens docs
- ✅ Team collaboration (others know the structure)
- ✅ Easier to get support

### Use `frontend/` (original) if:
- ✅ Simpler structure preferred
- ✅ Already working
- ✅ Solo project

**Recommendation**: **Use `frontend-official/`** untuk production!

## 🔧 Migration Steps (Original → Official)

If you want to migrate:

1. **Move config files**:
   ```bash
   mv src/config/supertokens.js app/config/frontend.ts
   mv src/config/appInfo.js app/config/appInfo.ts
   # Create new backend.ts
   ```

2. **Create SuperTokensProvider component**:
   ```bash
   cp frontend-official/app/components/supertokensProvider.tsx app/components/
   ```

3. **Add session utilities**:
   ```bash
   cp frontend-official/app/sessionUtils.ts app/
   cp frontend-official/app/components/tryRefreshClientComponent.tsx app/components/
   ```

4. **Update layout.tsx**:
   ```tsx
   import { SuperTokensProvider } from "./components/supertokensProvider";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <SuperTokensProvider>{children}</SuperTokensProvider>
         </body>
       </html>
     );
   }
   ```

5. **Update API route** (should already be correct):
   ```
   app/api/auth/[...path]/route.ts
   ```

## ✅ Verification Checklist

Compare your implementation dengan official:

- [x] Config split into 3 files (appInfo, backend, frontend)
- [x] SuperTokensProvider is separate component
- [x] API route at `app/api/auth/[...path]/route.ts`
- [x] Uses `getAppDirRequestHandler`
- [x] Has `sessionUtils.ts` for SSR
- [x] Has `tryRefreshClientComponent.tsx`
- [x] Window handler configured in frontend config
- [x] Backend init in API route (not in separate server)
- [x] Uses TypeScript (recommended)

## 🎯 Summary

**Main Takeaway**: Official structure more organized dengan:
1. Clearer file separation (3 config files)
2. Proper SSR handling (sessionUtils)
3. Better session refresh (TryRefresh component)
4. Next.js App Directory best practices

**Your Options**:
1. **Quickest**: Use `npx create-supertokens-app@latest`
2. **Learn**: Use `frontend-official/` folder saya buat
3. **Simple**: Stick dengan `frontend/` (works tapi not official)

---

**Sources**:
- [Adding login to Next.js App Directory](https://supertokens.com/blog/adding-login-to-your-nextjs-app-using-the-app-directory-and-supertokens)
- [SuperTokens Docs](https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/init)
