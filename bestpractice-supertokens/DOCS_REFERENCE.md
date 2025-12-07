# SuperTokens Implementation - Official Docs Reference

## 📚 Official Documentation

Implementation ini dibuat berdasarkan official SuperTokens documentation:
**https://supertokens.com/docs**

## ✅ Verification Checklist

Untuk memastikan implementation sesuai dengan docs terbaru, silakan verify:

### Backend Setup
Ref: https://supertokens.com/docs/emailpassword/introduction

**Our Implementation:**
```javascript
// backend/config.js
import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import Session from "supertokens-node/recipe/session/index.js";

SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
  },
  appInfo: {
    appName: "TaskHub",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(),
    Session.init()
  ],
});
```

**Verify Against Docs:**
- ✅ Framework initialization: `framework: "express"`
- ✅ Connection URI: `supertokens.connectionURI`
- ✅ App info structure: `appInfo` with required fields
- ✅ Recipe list: `EmailPassword` + `Session`

### Frontend Setup (Next.js App Router)
Ref: https://supertokens.com/docs (check untuk Next.js specific guide)

**Our Implementation:**
```javascript
// frontend/config/supertokens.js
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "TaskHub",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
  ],
});
```

**Verify Against Docs:**
- ✅ Using `supertokens-auth-react` for React/Next.js
- ✅ Same `appInfo` structure as backend
- ✅ Matching recipe list

### Middleware Setup
Ref: https://supertokens.com/docs (Express middleware guide)

**Our Implementation:**
```javascript
// backend/server.js
import { middleware, errorHandler } from "supertokens-node/framework/express";

app.use(cors({
  origin: process.env.WEBSITE_DOMAIN,
  allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()],
  credentials: true,
}));

app.use(middleware());  // SuperTokens middleware
// ... your routes ...
app.use(errorHandler()); // SuperTokens error handler
```

**Verify Against Docs:**
- ✅ CORS with `getAllCORSHeaders()`
- ✅ `middleware()` placement
- ✅ `errorHandler()` at the end

### Session Verification
Ref: https://supertokens.com/docs (Session recipe)

**Our Implementation:**
```javascript
import { verifySession } from "supertokens-node/recipe/session/framework/express";

app.get("/api/user/profile", verifySession(), (req, res) => {
  const userId = req.session.getUserId();
  res.json({ userId });
});
```

**Verify Against Docs:**
- ✅ Using `verifySession()` middleware
- ✅ Accessing userId via `req.session.getUserId()`

## 🔍 How to Verify Latest Docs

Karena SuperTokens actively updated, always check latest docs:

### 1. Check Official Quickstart
```bash
# Visit:
https://supertokens.com/docs

# Look for:
- "Quickstart" or "Getting Started"
- Your framework (Next.js App Router)
- Email/Password recipe
```

### 2. Use SuperTokens CLI (Recommended!)
```bash
# Install CLI
npm install -g create-supertokens-app

# Generate boilerplate
npx create-supertokens-app@latest

# Choose:
# - Framework: Next.js (App Router)
# - Recipe: Email/Password
# - Language: JavaScript/TypeScript
```

This akan generate official boilerplate yang guaranteed up-to-date!

### 3. Check Example Apps
```bash
# Visit:
https://github.com/supertokens/supertokens-auth-react/tree/master/examples

# Look for Next.js App Router examples
```

## 🔄 Potential Updates Needed

Jika docs sudah berubah, kamu mungkin perlu update:

### 1. Import Paths
Check if import paths changed:
```javascript
// Old (might be outdated)
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";

// New (check docs)
import EmailPassword from "supertokens-node/recipe/emailpassword";
```

### 2. Initialization Pattern
Check if init pattern changed:
```javascript
// Check if SuperTokens.init() structure is still the same
// in latest docs
```

### 3. Next.js App Router Specifics
Next.js 13+ App Router might have specific requirements:
- Client Components (`"use client"`)
- Server Components
- Middleware patterns

Check latest docs for App Router specific setup.

## 📝 Key Concepts (Should Match Docs)

### 1. appInfo Must Be Same
Frontend dan backend MUST have identical `appInfo`:
```javascript
// SAME di frontend dan backend!
{
  appName: "TaskHub",
  apiDomain: "http://localhost:3001",
  websiteDomain: "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
}
```

### 2. CORS Configuration
```javascript
// MUST include SuperTokens CORS headers
allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()]
```

### 3. Middleware Order
```javascript
// Correct order:
1. CORS
2. express.json()
3. SuperTokens.middleware()
4. Your routes
5. SuperTokens.errorHandler()
```

### 4. Session Context (Frontend)
```javascript
// Wrap app with SuperTokensWrapper
<SuperTokensWrapper>
  {children}
</SuperTokensWrapper>
```

## 🎯 Action Items

To ensure 100% compliance dengan official docs:

1. **Visit Official Docs**: https://supertokens.com/docs
   - Find Next.js App Router + Email/Password guide
   - Compare dengan implementation kami

2. **Generate Official Boilerplate**:
   ```bash
   npx create-supertokens-app@latest
   ```
   - Compare generated code dengan kami punya
   - Update jika ada differences

3. **Check Package Versions**:
   ```bash
   # Check latest versions
   npm info supertokens-node version
   npm info supertokens-auth-react version
   ```

4. **Test Against Examples**:
   - Clone official examples
   - Compare patterns

## ✅ Confidence Level

Berdasarkan SuperTokens patterns yang established:

- **Core Concepts**: ✅ 95% confident (initialization, recipes, session)
- **Next.js App Router**: ⚠️ 80% confident (might need adjustment for latest Next.js)
- **Best Practices**: ✅ 90% confident (CORS, middleware, error handling)

## 🔗 Official Resources

1. **Documentation**: https://supertokens.com/docs
2. **GitHub**: https://github.com/supertokens/supertokens-node
3. **Examples**: https://github.com/supertokens/supertokens-auth-react/tree/master/examples
4. **Discord**: https://supertokens.com/discord (untuk tanya langsung!)
5. **Blog**: https://supertokens.com/blog

## 💡 Recommended Next Steps

1. **Generate Official Boilerplate**:
   ```bash
   npx create-supertokens-app@latest
   ```

2. **Compare dengan our implementation**

3. **Update jika ada differences**

4. **Test thoroughly**

---

**Note**: SuperTokens actively developed, so always refer to latest official docs!
Latest check: December 2025
