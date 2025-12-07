# 📡 HTTP Request di Frontend - Fetch vs Axios vs React Query

## 📖 Daftar Isi
1. [Apa itu HTTP Request?](#apa-itu-http-request)
2. [Fetch API](#1-fetch-api)
3. [Axios](#2-axios)
4. [React Query](#3-react-query)
5. [Perbandingan](#perbandingan)
6. [Rekomendasi](#rekomendasi)
7. [Praktik Terbaik](#praktik-terbaik)

---

## Apa itu HTTP Request?

**HTTP Request** adalah cara frontend **mengirim dan menerima data** dari backend.

### Alur Lengkap:

```
Frontend                Backend
   │                      │
   │  1. Send Request     │
   ├─────────────────────▶│
   │  POST /api/register  │
   │  {name, email, pwd}  │
   │                      │
   │                  2. Process
   │                      │
   │                      │ Query DB
   │                      ├─▶ Save data
   │                      │
   │  3. Send Response    │
   │◀─────────────────────┤
   │  {success, userId}   │
   │                      │
```

---

## 1. FETCH API

Fetch API adalah **HTTP client built-in** di browser. Tidak perlu install, langsung bisa pakai.

### Sintaks Dasar:

```javascript
// GET request
const response = await fetch('http://localhost:5000/api/users/1');
const data = await response.json();

// POST request
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (response.ok) {
  console.log('Success:', data);
} else {
  console.log('Error:', data.message);
}
```

### Lengkap dengan Error Handling:

```javascript
"use client";

import { useState } from 'react';
import { toast } from 'sonner';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (formData) => {
    setIsLoading(true);

    try {
      console.log("Sending data:", formData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse JSON dari response
      const result = await response.json();

      console.log("Response status:", response.status);
      console.log("Response body:", result);

      // Check jika HTTP error (400, 500, dll)
      if (!response.ok) {
        toast.error(result.message || "Error");
        return;
      }

      // Check jika business logic error
      if (!result.success) {
        toast.error(result.message || "Registration failed");
        return;
      }

      // Success!
      toast.success(result.message || "Registration successful");
      
    } catch (error) {
      console.error("Network error:", error);
      
      if (error instanceof TypeError) {
        toast.error("Cannot connect to server. Make sure backend is running.");
      } else {
        toast.error(error.message || "Something went wrong");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={() => handleRegister(data)} disabled={isLoading}>
      {isLoading ? "Loading..." : "Register"}
    </button>
  );
}
```

### Kelebihan & Kekurangan:

✅ **Kelebihan:**
- Built-in, tidak perlu install
- Modern syntax dengan async/await
- Lightweight
- Standard

❌ **Kekurangan:**
- Verbose (banyak boilerplate)
- Manual error handling
- Tidak ada timeout default
- Tidak auto-parse error response

---

## 2. AXIOS

Axios adalah **HTTP client library** yang lebih convenient daripada Fetch.

### Setup (Install dulu):

```bash
npm install axios
```

### Membuat Axios Instance:

```javascript
// src/lib/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',  // Base URL
  timeout: 5000,                          // Timeout 5 detik
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk error handling global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Menggunakan Axios di Component:

```javascript
"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (formData) => {
    setIsLoading(true);

    try {
      console.log("Sending data:", formData);

      // Langsung pakai axios
      const response = await apiClient.post('/auth/register', formData);

      console.log("Response:", response.data);

      // Axios otomatis throw error jika status >= 400
      toast.success(response.data.message || "Registration successful");
      // Redirect atau update state
      
    } catch (error) {
      console.error("Error:", error);

      // Axios error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === 'Network Error') {
        toast.error("Cannot connect to server");
      } else {
        toast.error(error.message || "Something went wrong");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={() => handleRegister(data)} disabled={isLoading}>
      {isLoading ? "Loading..." : "Register"}
    </button>
  );
}
```

### Axios Methods:

```javascript
// GET
const data = await apiClient.get('/users/1');

// POST
const data = await apiClient.post('/auth/register', formData);

// PUT (update semua field)
const data = await apiClient.put('/users/1', updatedData);

// PATCH (update beberapa field)
const data = await apiClient.patch('/users/1', partialData);

// DELETE
const data = await apiClient.delete('/users/1');
```

### Kelebihan & Kekurangan:

✅ **Kelebihan:**
- Clean & simple syntax
- Auto JSON parsing
- Better error handling
- Interceptors (middleware)
- Timeout built-in
- Request/response transform

❌ **Kekurangan:**
- Perlu install (~13kb bundle)
- Setup lebih banyak

---

## 3. REACT QUERY

React Query (sekarang TanStack Query) adalah **data fetching library** untuk manage API requests dengan caching & background sync.

### Setup:

```bash
npm install @tanstack/react-query
```

### Setup di Root Layout:

```javascript
// src/app/layout.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Menggunakan React Query:

```javascript
"use client";

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export function RegisterForm() {
  // useMutation untuk POST/PUT/DELETE operations
  const { mutate: register, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post('/auth/register', formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registration successful");
      // Redirect atau update state
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    },
  });

  return (
    <button onClick={() => register(formData)} disabled={isPending}>
      {isPending ? "Loading..." : "Register"}
    </button>
  );
}
```

### Contoh dengan useQuery (untuk GET):

```javascript
"use client";

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['users', userId],  // Cache key
    queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

### Kelebihan & Kekurangan:

✅ **Kelebihan:**
- Automatic caching
- Background refetch
- State management built-in
- DevTools untuk debugging
- Error retry logic
- Very clean syntax

❌ **Kekurangan:**
- Learning curve tinggi
- Setup lebih kompleks
- Overkill untuk simple projects
- Bundle size lebih besar

---

## Perbandingan

| Aspek | Fetch | Axios | React Query |
|-------|-------|-------|-------------|
| **Install** | Built-in ✅ | npm ❌ | npm ❌ |
| **Bundle Size** | Small | Medium (~13kb) | Large (~30kb) |
| **Syntax** | Verbose | Clean | Very Clean |
| **Error Handling** | Manual | Auto | Auto |
| **Timeout** | ❌ | ✅ | ✅ |
| **Interceptors** | ❌ | ✅ | ✅ |
| **Caching** | ❌ | ❌ | ✅ |
| **Retry Logic** | Manual | Optional | Built-in |
| **Learning Curve** | Easy | Easy | Hard |
| **Best For** | Simple | Medium | Complex |

---

## Rekomendasi

### Gunakan **FETCH** jika:
- ✅ Project sederhana, sedikit API calls
- ✅ Ingin minimal dependencies
- ✅ Tidak perlu advanced features
- ✅ Contoh: Small frontend app

### Gunakan **AXIOS** jika:
- ✅ Project medium-scale
- ✅ Banyak API calls dengan error handling yang konsisten
- ✅ Perlu interceptors (global error handling, auth tokens)
- ✅ Want modern best practices
- ✅ Contoh: Dashboard, Admin panel, E-commerce

### Gunakan **REACT QUERY** jika:
- ✅ Project besar dengan complex data fetching
- ✅ Banyak API calls dengan caching
- ✅ Background sync & refetch diperlukan
- ✅ Global state management untuk API data
- ✅ Contoh: Large-scale SaaS, Social media

---

## Praktik Terbaik

### 1. Separate API Layer

**Jangan:** Tulis fetch langsung di component

```javascript
// ❌ DON'T
export function Component() {
  const handleClick = async () => {
    const response = await fetch('http://localhost:5000/api/users');
    const data = await response.json();
  };
}
```

**Lakukan:** Buat service file terpisah

```javascript
// ✅ DO
// src/services/userService.js
import apiClient from '@/lib/axios';

export const userService = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};
```

```javascript
// Di component
import { userService } from '@/services/userService';

export function Component() {
  const handleClick = async () => {
    const response = await userService.getAll();
  };
}
```

### 2. Global Error Handling

Setup interceptor untuk handle error di satu tempat:

```javascript
// src/lib/axios.js
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    
    // Log ke monitoring service (Sentry, LogRocket, dll)
    console.error('[API Error]', message);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Access denied
      window.location.href = '/forbidden';
    }
    
    return Promise.reject(error);
  }
);
```

### 3. Timeout Management

```javascript
// Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

### 4. Loading States

```javascript
// ✅ DO: Show loading indicator
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (data) => {
  setIsLoading(true);
  try {
    await apiClient.post('/users', data);
  } finally {
    setIsLoading(false);  // Always reset
  }
};
```

### 5. Validasi Input

```javascript
// ✅ DO: Validate before sending
const handleSubmit = async (data) => {
  // Frontend validation
  if (!data.email || !isValidEmail(data.email)) {
    toast.error('Invalid email');
    return;
  }

  try {
    // Backend validation (jangan hanya rely on frontend)
    const response = await apiClient.post('/users', data);
  } catch (error) {
    // Backend error message
    toast.error(error.response?.data?.message);
  }
};
```

---

## Contoh Real-World: Authentication Flow

### Setup dengan Axios:

```javascript
// src/lib/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear and redirect
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Menggunakan di Component:

```javascript
// src/services/authService.js
import apiClient from '@/lib/axios';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    return user;
  },

  register: async (name, email, password, repeatPassword) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      repeatPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};
```

```javascript
// src/features/auth/register/components/signUpForm.jsx
import { authService } from '@/services/authService';

export function SignupForm() {
  const router = useRouter();

  const handleRegister = async (data) => {
    try {
      const user = await authService.register(
        data.name,
        data.email,
        data.password,
        data.repeatPassword
      );
      toast.success('Registration successful');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    // Form JSX
  );
}
```

---

## Summary

| Pilihan | Waktu | Kompleksitas | Scalability |
|---------|-------|--------------|-------------|
| **Fetch** | 5 menit | Low | Medium |
| **Axios** | 10 menit | Low | High |
| **React Query** | 30 menit | High | Very High |

**Rekomendasi untuk project kamu:** Mulai dengan **Axios** (sweet spot antara simplicity & features). Upgrade ke **React Query** nanti kalau project berkembang besar.

---

## Resources

- [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios - Official Docs](https://axios-http.com)
- [React Query - Official Docs](https://tanstack.com/query/latest)
- [HTTP Methods - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [HTTP Status Codes - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

