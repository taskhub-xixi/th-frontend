# TaskHub Setup Guide - Frontend & Backend

## 📁 Struktur Folder

```
taskhub/
├── th-frontend/          # Next.js Frontend
│   └── src/
│       ├── app/
│       ├── components/ui/
│       ├── context/
│       │   └── AuthContext.jsx     # State management untuk auth
│       └── features/
│           └── auth/
│               ├── login/
│               │   ├── components/LoginForm.jsx
│               │   └── form/login.js
│               └── register/
│                   └── components/signUpForm.jsx
│
└── th-backend/           # Express.js Backend
    ├── config/
    │   └── database.js     # MySQL connection
    ├── controllers/
    │   └── authController.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── auth.js
    ├── server.js
    ├── database.sql
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### 1. Setup Backend (th-backend)

#### Step 1: Setup Database MySQL

```bash
# Buka MySQL client
mysql -u root -p

# Jalankan SQL untuk membuat database dan tabel
source /path/to/th-backend/database.sql

# Atau copy-paste langsung:
CREATE DATABASE IF NOT EXISTS taskhub_db;
USE taskhub_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Step 2: Konfigurasi .env

Edit file `th-backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Sesuaikan dengan password MySQL kamu
DB_NAME=taskhub_db
NODE_ENV=development
```

#### Step 3: Jalankan Backend

```bash
cd th-backend
npm install
npm start
# Backend akan berjalan di http://localhost:5000
```

---

### 2. Setup Frontend (th-frontend)

```bash
cd th-frontend
npm install
npm run dev
# Frontend akan berjalan di http://localhost:3000
```

---

## 🔗 API Endpoints

### Register
**POST** `http://localhost:5000/api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "repeatPassword": "password123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "userId": 1
}
```

Response (Error):
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

### Login
**POST** `http://localhost:5000/api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Response (Error):
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

## 🎯 Fitur yang Sudah Diimplementasi

### Frontend (Next.js)
✅ **LoginForm** - Form login dengan validasi Zod
✅ **SignupForm** - Form registrasi dengan validasi password
✅ **AuthContext** - State management untuk user
✅ **Fetch API** - Komunikasi dengan backend
✅ **Error Handling** - Alert untuk error messages
✅ **Navigation** - Routing setelah login/register berhasil

### Backend (Express.js)
✅ **User Model** - Database queries untuk users
✅ **Auth Controller** - Logika register dan login
✅ **Auth Routes** - Endpoints `/api/auth/register` dan `/api/auth/login`
✅ **CORS** - Cross-origin requests dari frontend
✅ **Validation** - Input validation di backend
✅ **Password Hashing** - Simple base64 hashing (gunakan bcrypt di production!)

---

## 📝 Cara Menggunakan Auth

### Di Component (Client-side)

```javascript
"use client";

import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## ⚠️ Important Notes

1. **Password Hashing**: Backend saat ini menggunakan simple base64. Untuk production, gunakan bcrypt:
   ```bash
   npm install bcrypt
   ```

2. **CORS**: Backend hanya menerima request dari `http://localhost:3000`. Edit di `server.js` jika perlu mengubah

3. **localStorage**: User data disimpan di localStorage setelah login. Ini bukan secure untuk production - gunakan JWT tokens

4. **Validasi**: Frontend dan backend punya validasi terpisah. Pastikan keduanya konsisten

---

## 🧪 Testing

### Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "repeatPassword": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL server sudah berjalan
- Check username, password, dan database name di `.env`
- Pastikan database `taskhub_db` sudah dibuat

### Frontend tidak bisa connect ke backend
- Pastikan backend berjalan di `http://localhost:5000`
- Check CORS di `server.js` (harus allow `http://localhost:3000`)
- Cek browser console untuk error messages

### "Email sudah terdaftar" error
- Database sudah punya record dengan email itu
- Gunakan email yang berbeda atau hapus data dari database

---

## 📚 Next Steps

1. Implementasi JWT authentication (lebih aman dari localStorage)
2. Tambah forgot password functionality
3. Implementasi email verification
4. Tambah user profile page
5. Implementasi logout properly dengan token cleanup
