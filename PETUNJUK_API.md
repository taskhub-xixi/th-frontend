# 📚 Petunjuk Lengkap: Memahami dan Membuat API

## 📖 Daftar Isi
1. [Apa itu API?](#apa-itu-api)
2. [Konsep Dasar](#konsep-dasar)
3. [Struktur HTTP Request](#struktur-http-request)
4. [Alur Pembuatan API](#alur-pembuatan-api)
5. [Pattern yang Harus Diingat](#pattern-yang-harus-diingat)
6. [Apa itu .env dan Mengapa Penting](#apa-itu-env-dan-mengapa-penting)
7. [Langkah Demi Langkah Membuat API Baru](#langkah-demi-langkah-membuat-api-baru)
8. [Praktik Terbaik](#praktik-terbaik)

---

## Apa itu API?

### Definisi Sederhana
API (Application Programming Interface) adalah **"jembatan komunikasi"** antara frontend dan backend.

### Analogi Dunia Nyata
Bayangkan seperti ini:

```
┌─────────────────┐        ┌──────────────────┐
│   FRONTEND      │        │     BACKEND      │
│  (Aplikasi)     │───────▶│   (Database)     │
│                 │◀───────│                  │
└─────────────────┘        └──────────────────┘
      FORM               API (Jembatan)
   "Kirim data"      "Proses data"
   "Minta data"      "Simpan data"
```

### Contoh Konkret
1. User mengisi form login di frontend
2. Frontend mengirim email & password ke **API** di backend
3. Backend menerima, validasi, cek database
4. Backend kirim response (berhasil/gagal)
5. Frontend terima response dan tampilkan hasilnya

---

## Konsep Dasar

### 1. Request & Response

Setiap komunikasi API terdiri dari 2 bagian:

```javascript
// FRONTEND (Mengirim Request)
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',           // ← Tipe request
  headers: {                // ← Metadata
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({    // ← Data yang dikirim
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(response => response.json())  // ← Menerima response
.then(data => console.log(data))    // ← Data dari backend
```

### 2. HTTP Methods (Jenis Request)

Ada 4 method utama yang harus kamu ingat:

| Method | Kegunaan | Analogi |
|--------|----------|---------|
| **GET** | Mengambil data | "Ambilkan data dari tabel ini" |
| **POST** | Membuat data baru | "Tambahkan baris baru ke tabel" |
| **PUT** | Mengubah semua data | "Ganti seluruh isi baris ini" |
| **DELETE** | Menghapus data | "Hapus baris ini" |

### 3. Status Codes (Kode Respons)

Backend akan mengembalikan kode yang menunjukkan status:

| Kode | Arti | Contoh |
|------|------|--------|
| **200** | ✅ Berhasil | Login berhasil |
| **201** | ✅ Dibuat | User baru terdaftar |
| **400** | ❌ Request salah | Email tidak valid |
| **401** | ❌ Tidak authorized | Password salah |
| **404** | ❌ Tidak ditemukan | User tidak ada |
| **500** | ❌ Error server | Database error |

---

## Struktur HTTP Request

### Anatomi Lengkap Request

```javascript
fetch('http://localhost:5000/api/auth/login', {
  //        └─ DOMAIN: Di mana backend berjalan
  //           └─ PATH: Route/endpoint API
  
  method: 'POST',
  //└─ METHOD: Jenis request (GET, POST, PUT, DELETE)
  
  headers: {
    'Content-Type': 'application/json',
    // ↑ Katakan ke server bahwa data dalam format JSON
    
    'Authorization': 'Bearer token123'
    // ↑ Opsional: Untuk request yang perlu login
  },
  
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
  // ↑ DATA: Data yang dikirim ke backend (hanya untuk POST, PUT, PATCH)
})
```

### Contoh GET Request (Tanpa Body)

```javascript
// GET: Ambil data user dengan ID 1
fetch('http://localhost:5000/api/users/1', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer token123'
  }
  // ← Tidak ada body karena GET tidak perlu mengirim data besar
})
```

### Response Structure

Backend akan balik response seperti ini:

```javascript
{
  "success": true,           // Status: berhasil atau gagal
  "message": "Login berhasil",
  "user": {                  // DATA yang diminta
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Alur Pembuatan API

### Urutan Tahapan (PENTING!)

API yang baik dibuat dengan urutan ini:

```
┌──────────────────────────────────────────────────────┐
│  1. DESIGN                                           │
│     - Apa yang mau dibuat?                           │
│     - Input apa yang dibutuhkan?                     │
│     - Output apa yang akan dikembalikan?             │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  2. DATABASE                                         │
│     - Buat table di MySQL                            │
│     - Design struktur kolom                          │
│     - Tentukan primary key, index, dll               │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  3. MODEL                                            │
│     - Buat file model (User.js, Product.js, etc)     │
│     - Tulis function untuk query database            │
│     - Test koneksi ke database                       │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  4. CONTROLLER                                       │
│     - Buat file controller (authController.js)       │
│     - Tulis logic untuk handle request               │
│     - Tambah validasi input                          │
│     - Format response                                │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  5. ROUTES                                           │
│     - Buat file routes (auth.js)                     │
│     - Hubungkan path ke controller function          │
│     - Tentukan HTTP method (GET, POST, etc)          │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  6. TEST                                             │
│     - Test dengan curl atau Postman                  │
│     - Coba berbagai scenario (success, error)        │
│     - Verifikasi response                            │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│  7. INTEGRATE FRONTEND                               │
│     - Gunakan fetch di component                     │
│     - Handle response dan error                      │
│     - Update UI sesuai response                      │
└──────────────────────────────────────────────────────┘
```

---

## Pattern yang Harus Diingat

### Pattern 1: File Structure di Backend

Selalu gunakan struktur folder ini:

```
backend/
├── config/
│   └── database.js          ← Konfigurasi database
├── models/
│   ├── User.js              ← Query database untuk users
│   ├── Product.js           ← Query database untuk products
│   └── Order.js             ← Query database untuk orders
├── controllers/
│   ├── authController.js    ← Logic untuk auth (register, login)
│   ├── productController.js ← Logic untuk products
│   └── orderController.js   ← Logic untuk orders
├── routes/
│   ├── auth.js              ← Route untuk auth
│   ├── products.js          ← Route untuk products
│   └── orders.js            ← Route untuk orders
├── server.js                ← Main entry point
└── .env                     ← Konfigurasi sensitif
```

**Kenapa struktur ini?**
- **Separation of Concerns**: Setiap file punya tanggung jawab satu
- **Mudah Dipelihara**: Kalau ada bug di user, cari di models/User.js
- **Scalable**: Mudah tambah fitur baru tanpa berantakan

### Pattern 2: Alur Data dalam API

```
Request dari Frontend
        ↓
   ┌────────────────────┐
   │   ROUTES (auth.js) │  ← Tangkap request di path mana
   │                    │     POST /api/auth/login
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │  CONTROLLER        │  ← Proses logic
   │  authController.js │     1. Validasi input
   │                    │     2. Cek database
   │                    │     3. Format response
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │    MODEL           │  ← Query database
   │    User.js         │     SELECT * FROM users WHERE email = ?
   │                    │
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │    DATABASE        │  ← Simpan/ambil data
   │    MySQL           │
   │                    │
   └────────────────────┘
        ↓
Response kembali ke Frontend
```

### Pattern 3: Response Format yang Konsisten

**SELALU** kembalikan response dalam format yang sama:

```javascript
// ✅ BENAR: Konsisten
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John"
  }
}

// ✅ BENAR: Konsisten (error juga sama format)
{
  "success": false,
  "message": "Email sudah terdaftar",
  "data": null
}

// ❌ SALAH: Tidak konsisten
{
  "message": "Success",
  "user": { ... }
}
```

### Pattern 4: Error Handling

Selalu handle error dengan baik:

```javascript
// Di Controller
try {
  // Proses logic di sini
  const result = await User.findByEmail(email);
} catch (error) {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
}
```

---

## Apa itu .env dan Mengapa Penting?

### Pengertian Sederhana

`.env` adalah file untuk **menyimpan informasi sensitif** yang tidak boleh dilihat publik.

### Analogi

```
Bayangkan .env seperti kotak harta karun:

┌─────────────────────────────────┐
│  KOTAK HARTA KARUN (.env)       │
├─────────────────────────────────┤
│ PASSWORD_DATABASE = haha123     │
│ API_SECRET_KEY = abc123xyz      │
│ DATABASE_URL = localhost:3306   │
└─────────────────────────────────┘

Anda TIDAK ingin orang tahu:
❌ Password database (bisa hack)
❌ Secret key (bisa bikin token palsu)
❌ URL database internal (info keamanan)
```

### Contoh .env di Project Kita

```bash
# th-backend/.env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rahasia123
DB_NAME=taskhub_db
NODE_ENV=development
```

### Kapan Harus Digunakan?

**Gunakan .env untuk:**
- ✅ Password database
- ✅ Secret keys / API keys
- ✅ URLs yang bisa berubah (localhost dev, production server)
- ✅ Email credentials
- ✅ Third-party API keys

**JANGAN gunakan .env untuk:**
- ❌ Hardcode di dalam kode
- ❌ Push ke GitHub/versi control

### Kenapa HARUS Menggunakan .env?

#### 1. **Security (Keamanan)**
```
❌ JANGAN LAKUKAN INI:
// server.js
const password = 'rahasia123'; // Semua orang bisa lihat!

✅ LAKUKAN INI:
// server.js
const password = process.env.DB_PASSWORD;
```

#### 2. **Flexibility (Fleksibilitas)**
```
Saat development:
DB_HOST=localhost

Saat production (live):
DB_HOST=192.168.1.100

Ganti cukup di .env, kode tetap sama!
```

#### 3. **Prevent Accidents (Cegah Kecelakaan)**
```
Jika password di kode dan kamu push ke GitHub:
- SEMUA orang bisa lihat password
- Hacker bisa langsung masuk database
- Data bisa hilang/diretas

Dengan .env:
- .env di .gitignore (tidak pernah push)
- Aman dari hacker
```

### Penting: .gitignore

File `.gitignore` memberitahu Git file mana yang TIDAK boleh di-commit:

```bash
# th-backend/.gitignore
node_modules/
.env           # ← PENTING! .env tidak boleh di-commit
.env.local
.DS_Store
```

**Kenapa?**
Karena .env berisi password dan info sensitif. Kalau di-push ke GitHub, SEMUA ORANG bisa lihat password kamu!

### Cara Mengakses .env di Backend

```javascript
// Harus require di awal file
require('dotenv').config();

// Kemudian akses dengan process.env
const port = process.env.PORT;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

console.log(`Database connecting to ${dbHost}...`);
console.log(`Server running on port ${port}`);
```

---

## Langkah Demi Langkah Membuat API Baru

Saya akan buat contoh API baru: **GET Products List**

### Scenario
Kamu ingin membuat API untuk mengambil daftar semua produk dari database.

```
GET /api/products

Response:
{
  "success": true,
  "data": [
    { "id": 1, "name": "Laptop", "price": 5000000 },
    { "id": 2, "name": "Mouse", "price": 50000 }
  ]
}
```

### Step 1: Design & Planning

```
Pertanyaan yang harus dijawab:
Q: Apa nama API?        A: /api/products
Q: HTTP method apa?     A: GET (hanya ambil data)
Q: Input apa?           A: Tidak ada (ambil semua produk)
Q: Output apa?          A: Array of products
Q: Error apa saja?      A: Database error
Q: Butuh login?         A: Tidak perlu (public)
```

### Step 2: Buat Table di Database

```sql
-- Di MySQL
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO products (name, description, price, stock) VALUES
('Laptop Dell', 'High performance laptop', 5000000, 10),
('Mouse Logitech', 'Wireless mouse', 50000, 50),
('Keyboard Mechanical', 'RGB mechanical keyboard', 200000, 25);
```

### Step 3: Buat Model (models/Product.js)

```javascript
// th-backend/models/Product.js

const pool = require('../config/database');

class Product {
  // Ambil semua produk
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, description, price, stock FROM products'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Ambil 1 produk berdasarkan ID
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }
}

module.exports = Product;
```

### Step 4: Buat Controller (controllers/productController.js)

```javascript
// th-backend/controllers/productController.js

const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};
```

### Step 5: Buat Routes (routes/products.js)

```javascript
// th-backend/routes/products.js

const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Ambil semua produk
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Ambil 1 produk
router.get('/:id', productController.getProductById);

module.exports = router;
```

### Step 6: Register Routes di server.js

```javascript
// th-backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); // ← Tambah ini

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // ← Tambah ini

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 7: Test dengan curl

```bash
# Test 1: Ambil semua produk
curl http://localhost:5000/api/products

# Response:
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    { "id": 1, "name": "Laptop Dell", "description": "High performance laptop", "price": "5000000.00", "stock": 10 },
    { "id": 2, "name": "Mouse Logitech", "description": "Wireless mouse", "price": "50000.00", "stock": 50 }
  ]
}

# Test 2: Ambil 1 produk
curl http://localhost:5000/api/products/1

# Response:
{
  "success": true,
  "data": { "id": 1, "name": "Laptop Dell", ... }
}

# Test 3: Ambil produk yang tidak ada
curl http://localhost:5000/api/products/999

# Response:
{
  "success": false,
  "message": "Product not found"
}
```

### Step 8: Integrate ke Frontend

```javascript
// th-frontend/src/components/ProductList.jsx
"use client";

import { useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Gagal mengambil produk');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Daftar Produk</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong>
            <p>Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
            <p>Stok: {product.stock}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Praktik Terbaik

### 1. Selalu Validasi Input di Backend

```javascript
// ❌ JANGAN: Percaya frontend
exports.createProduct = async (req, res) => {
  const { name, price } = req.body;
  // Langsung create tanpa validasi
};

// ✅ LAKUKAN: Validasi di backend
exports.createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  
  // Validasi
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Nama produk tidak boleh kosong'
    });
  }
  
  if (price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Harga harus lebih dari 0'
    });
  }
  
  // Baru create
  // ...
};
```

**Kenapa?** Frontend bisa dimanipulasi user. Backend HARUS validasi lagi.

### 2. Gunakan Meaningful Error Messages

```javascript
// ❌ JANGAN: Error generic
{
  "success": false,
  "message": "Error"
}

// ✅ LAKUKAN: Pesan jelas
{
  "success": false,
  "message": "Email sudah terdaftar. Gunakan email lain atau lakukan login."
}
```

### 3. Logging untuk Debugging

```javascript
// Selalu log error
try {
  // ...
} catch (error) {
  console.error('[ProductController] Error getting products:', error);
  // ↑ Dengan prefix supaya tahu error dari mana
}
```

### 4. Gunakan Environment Variables

```javascript
// ❌ JANGAN
const API_URL = 'http://localhost:5000';

// ✅ LAKUKAN
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

### 5. Handle Network Errors

```javascript
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    
    // Cek apakah response OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setProducts(data.data);
  } catch (error) {
    // Handle berbagai jenis error
    if (error instanceof TypeError) {
      // Network error (backend tidak running)
      setError('Tidak bisa connect ke server. Pastikan backend berjalan di http://localhost:5000');
    } else {
      setError(error.message);
    }
  }
};
```

### 6. Timeout untuk Request

```javascript
// Frontend: Set timeout agar tidak menunggu selamanya
const fetchProductsWithTimeout = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 detik

  try {
    const response = await fetch('http://localhost:5000/api/products', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    // Handle response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request timeout');
    }
  }
};
```

---

## Checklist: Sebelum Deploy API ke Production

- [ ] Semua validasi input sudah ada
- [ ] Error handling lengkap
- [ ] Logging untuk debugging
- [ ] Password hashing dengan bcrypt (bukan base64)
- [ ] JWT tokens untuk authentication (bukan localStorage)
- [ ] CORS diatur dengan benar
- [ ] Environment variables terenkripsi
- [ ] Database backup
- [ ] Rate limiting (cegah spam requests)
- [ ] Testing lengkap
- [ ] Dokumentasi API (OpenAPI/Swagger)

---

## Summary & Kesimpulan

### Yang Harus Diingat:

1. **API adalah jembatan** antara frontend dan backend
2. **Urutan pembuatan**: Design → Database → Model → Controller → Routes → Test → Frontend
3. **Pattern penting**: 
   - Struktur folder yang rapi
   - Response format yang konsisten
   - Error handling yang baik
4. **.env sangat penting** untuk keamanan (password, secret keys)
5. **Validasi di backend** adalah WAJIB (jangan percaya frontend)

### Cara Belajar:

1. **Pahami** konsep di dokumentasi ini
2. **Praktik** membuat API baru (ikuti Step 1-8)
3. **Debug** jika ada error (cek console backend & frontend)
4. **Improve** dengan menambah validasi & error handling
5. **Repeat** sampai terbiasa

---

## Referensi & Resources

### Tools untuk Test API:
- **curl**: Command line tool
- **Postman**: GUI yang mudah
- **Insomnia**: Alternatif Postman

### Dokumentasi:
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Express.js](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Video Pembelajaran:
- Rest API fundamentals
- Express.js tutorial
- MySQL basics

---

## Pertanyaan yang Sering Ditanyakan (FAQ)

**Q: Apakah frontend perlu validasi kalau backend juga validasi?**
A: Ya, frontend perlu untuk UX (feedback langsung). Backend validasi untuk keamanan.

**Q: Bisakah saya pakai API orang lain?**
A: Ya, semua prinsip ini sama (Google API, Twitter API, dll).

**Q: Bagaimana kalau saya butuh authentication token?**
A: Gunakan JWT. Ceritanya panjang, akan dibuat dokumentasi terpisah.

**Q: Database saya crash, data hilang?**
A: Harus ada backup strategy. Backup database secara berkala!

**Q: Bagaimana deployment ke production?**
A: Ada banyak cara (Vercel, Heroku, AWS, dll). Akan dibahas kemudian.

