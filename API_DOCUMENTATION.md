# API Documentation - Bola Duwit

Base URL: `https://bola-duwit.my.id/api/`

## Authentication
All protected endpoints require Bearer token authentication using Laravel Sanctum.

## Tables and Fields

### Users Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| nama | VARCHAR(100) | User name | Required |
| email | VARCHAR(45) | User email | Required, Unique |
| kata_sandi | VARCHAR(255) | Hashed password | Required |
| nomor_hp | VARCHAR(20) | Phone number | Nullable |
| role | ENUM | User role | Required (umkm, guest, admin) |
| status | ENUM | Account status | Required (pending, active, rejected, suspended) |
| suspension_reason | TEXT | Reason for suspension | Nullable |
| suspended_at | TIMESTAMP | Suspension start date | Nullable |
| suspension_end_date | TIMESTAMP | Suspension end date | Nullable |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Nullable |

### UMKM Profiles Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| nama_toko | VARCHAR(100) | Store name | Required |
| deskripsi | VARCHAR(255) | Store description | Nullable |
| alamat | VARCHAR(255) | Store address | Required |
| lintang | DECIMAL(10,7) | Latitude coordinate | Nullable, -90 to 90 |
| bujur | DECIMAL(10,7) | Longitude coordinate | Nullable, -180 to 180 |
| kontak_wa | VARCHAR(30) | WhatsApp contact | Nullable |
| nomor_rekening | VARCHAR(50) | Bank account number | Nullable |
| nama_bank | VARCHAR(50) | Bank name | Nullable |
| url_foto_ktp | VARCHAR(255) | KTP photo URL | Nullable |
| terverifikasi | BOOLEAN | Verification status | Default: false |
| status_toko | ENUM | Store status | Default: tutup (buka, tutup) |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Nullable |
| user_id | UUID | Foreign key to users | Foreign key, Cascade delete |

### Produk Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| nama_produk | VARCHAR(100) | Product name | Required |
| deskripsi | VARCHAR(255) | Product description | Nullable |
| harga | DECIMAL(12,2) | Product price | Required, Min: 0 |
| stok | INTEGER | Stock quantity | Default: 0, Min: 0 |
| kategori | VARCHAR(50) | Product category | Nullable |
| url_foto | VARCHAR(255) | Photo URL | Nullable |
| url_video | VARCHAR(255) | Video URL | Nullable |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Nullable |
| umkm_id | UUID | Foreign key to umkm_profiles | Foreign key, Cascade delete |

### Carts Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| user_id | UUID | Foreign key to users | Foreign key, Cascade delete |
| produk_id | UUID | Foreign key to produk | Foreign key, Cascade delete |
| quantity | INTEGER | Product quantity in cart | Default: 1, Min: 1 |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Auto |

### Transaksi Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| total_harga | DECIMAL(12,2) | Total price | Required |
| metode_pembayaran | ENUM | Payment method | Required (COD, Midtrans) |
| status_transaksi | ENUM | Transaction status | Required (menunggu, diproses, dikirim, selesai, dibatalkan) |
| alamat_pengiriman | VARCHAR(255) | Shipping address | Required |
| tanggal_transaksi | TIMESTAMP | Transaction date | Auto |
| tanggal_diperbarui | TIMESTAMP | Last update date | Nullable |
| user_id | UUID | Foreign key to users | Foreign key, Cascade delete |
| snap_token | VARCHAR(255) | Midtrans payment token | Nullable |
| status_pembayaran_umkm | ENUM | UMKM payment status | Default: belum_dibayarkan (belum_dibayarkan, sudah_dibayarkan) |
| bukti_transfer_path | VARCHAR(255) | Payment proof file path | Nullable |
| tanggal_pembayaran_umkm | TIMESTAMP | UMKM payment date | Nullable |
| admin_pembayaran_id | UUID | Foreign key to admin who made payment | Foreign key, Set null on delete |

### Transaksi Details Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| transaksi_id | UUID | Foreign key to transaksi | Foreign key, Cascade delete |
| produk_id | UUID | Foreign key to produk | Foreign key, Cascade delete |
| jumlah | INTEGER | Product quantity | Required, Min: 1 |
| harga_satuan | DECIMAL(12,2) | Unit price at time of purchase | Required |
| subtotal | DECIMAL(12,2) | Line item total (jumlah × harga_satuan) | Required |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Auto |

### UMKM Payments Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| transaksi_id | UUID | Foreign key to transaksi | Foreign key, Cascade delete |
| umkm_id | UUID | Foreign key to umkm_profiles | Foreign key, Cascade delete |
| jumlah_pembayaran | DECIMAL(12,2) | Payment amount for this UMKM | Required |
| status_pembayaran | ENUM | Payment status | Default: belum_dibayarkan (belum_dibayarkan, sudah_dibayarkan) |
| bukti_transfer_path | VARCHAR(255) | Payment proof file path | Nullable |
| tanggal_pembayaran | TIMESTAMP | Payment date | Nullable |
| admin_pembayaran_id | UUID | Foreign key to admin who made payment | Foreign key, Set null on delete |
| created_at | TIMESTAMP | Creation timestamp | Auto |
| updated_at | TIMESTAMP | Update timestamp | Auto |

## API Endpoints

### Public Endpoints

#### User Registration
**POST** `https://bola-duwit.my.id/api/users`
- **Description**: Register a new user
- **Auth**: None
- **Request Body**:
  ```json
  {
    "nama": "string (required, max:100)",
    "email": "string (required, email, unique, max:45)",
    "kata_sandi": "string (required, min:8)",
    "nomor_hp": "string (nullable, max:20)",
    "role": "string (required, enum: guest,umkm)"
  }
  ```
- **Response**: User data with authentication token

#### User Login
**POST** `https://bola-duwit.my.id/api/users/login`
- **Description**: Authenticate user and get token
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, email)",
    "kata_sandi": "string (required)"
  }
  ```
- **Success Response**: User data with authentication token
- **Error Responses**:
  - **Invalid Credentials (401)**:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```
  - **Account Pending Approval (403)**:
    ```json
    {
      "error": "Akun sedang menunggu persetujuan admin. Silakan tunggu persetujuan admin."
    }
    ```
  - **Account Rejected (403)**:
    ```json
    {
      "error": "Akun telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut."
    }
    ```
  - **Account Suspended (403)**:
    ```json
    {
      "error": "Akun telah ditangguhkan.",
      "suspension_reason": "string (alasan penangguhan)",
      "suspended_at": "timestamp",
      "suspension_end_date": "timestamp (nullable)",
      "message": "Silakan hubungi admin untuk informasi lebih lanjut."
    }
    ```
  - **Account Inactive (403)**:
    ```json
    {
      "error": "Akun tidak aktif."
    }
    ```

#### Forgot Password
**POST** `https://bola-duwit.my.id/api/users/forgot-password`
- **Description**: Request password reset link via email
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, email, exists in users table)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reset password link has been sent to your email"
  }
  ```
- **Email Content**: User receives an email with a secure reset link that expires in 1 hour

#### Reset Password
**POST** `https://bola-duwit.my.id/api/users/reset-password`
- **Description**: Reset password using reset token
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, email, exists in users table)",
    "reset_token": "string (required)",
    "new_password": "string (required, min:8)",
    "new_password_confirmation": "string (required, must match new_password)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

#### Get All Users (Admin)
**GET** `https://bola-duwit.my.id/api/users`
- **Description**: Get all users (admin only)
- **Auth**: Bearer token (admin role)
- **Response**: List of all users

### User Profile Endpoints

#### Get User Profile
**GET** `https://bola-duwit.my.id/api/user/profile`
- **Description**: Get current authenticated user's profile information
- **Auth**: Bearer token (any role: guest, umkm, admin)
- **Response**: Current user profile data including name, email, phone, role, and status

#### Update User Profile
**PUT** `https://bola-duwit.my.id/api/user/profile`
- **Description**: Update current authenticated user's profile information
- **Auth**: Bearer token (any role: guest, umkm, admin)
- **Request Body**:
  ```json
  {
    "nama": "string (optional, max:100)",
    "nomor_hp": "string (optional, max:20)",
    "current_password": "string (required when changing password)",
    "new_password": "string (optional, min:8)",
    "new_password_confirmation": "string (required if new_password provided)"
  }
  ```
- **Password Change**: To change password, provide `current_password` and `new_password` with confirmation
- **Response**: Updated user profile data
- **Notes**: Email cannot be changed. Only name and phone number can be updated.


### Guest User Endpoints

#### Get User Transactions
**GET** `https://bola-duwit.my.id/api/transaksi`
- **Description**: Get user's transaction history
- **Auth**: Bearer token (guest role)
- **Response**: List of user's transactions

#### Create Transaction (Checkout)
**POST** `https://bola-duwit.my.id/api/transaksi`
- **Description**: Create a new transaction from cart items (checkout process)
- **Auth**: Bearer token (guest role)
- **Middleware**: store_status (checks if store is open)
- **Process**: Converts all items in user's cart into transaction details
- **Requirements**: User must have items in cart
- **Request Body**:
  ```json
  {
    "alamat_pengiriman": "string (required, max:255)",
    "metode_pembayaran": "string (required, enum: COD,Midtrans)"
  }
  ```
- **Automatic Actions**:
  - Creates transaction with all cart items as transaction details
  - Calculates total price from cart items
  - Generates Midtrans snap token if payment method is Midtrans
  - Clears user's cart after successful transaction creation
- **Response**: Created transaction data with details
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Transaksi berhasil dibuat",
    "data": {
      "id": "uuid",
      "user_id": "uuid",
      "alamat_pengiriman": "Jl. Sudirman No. 123",
      "metode_pembayaran": "COD",
      "status_transaksi": "menunggu",
      "total_harga": 75000,
      "snap_token": "string (only if Midtrans payment)",
      "tanggal_transaksi": "2025-11-30T14:30:00.000000Z",
      "details": [
        {
          "id": "uuid",
          "transaksi_id": "uuid",
          "produk_id": "uuid",
          "jumlah": 2,
          "harga_satuan": 25000,
          "subtotal": 50000,
          "produk": {
            "nama_produk": "Kerajinan Bambu",
            "harga": 25000
          }
        }
      ]
    }
  }
  ```

#### Get Transaction Detail
**GET** `https://bola-duwit.my.id/api/transaksi/{id}`
- **Description**: Get specific transaction details
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID)
- **Response**: Transaction details

#### Update Guest Transaction Status
**PUT** `https://bola-duwit.my.id/api/transaksi/{id}/status`
- **Description**: Update transaction status for customer's own orders
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID of transaction)
- **Request Body**:
  ```json
  {
    "status_transaksi": "string (required, enum: selesai,dibatalkan)"
  }
  ```
- **Allowed Status Transitions**:
  - dikirim → selesai (complete order after delivery)
  - menunggu → dibatalkan (cancel pending order)
- **Response**: Updated transaction data
- **Error Responses**:
  - **400 Bad Request**: Invalid status transition
  - **404 Not Found**: Transaction not found or doesn't belong to user

#### Get WhatsApp Contact Links
**GET** `https://bola-duwit.my.id/api/transaksi/{id}/whatsapp`
- **Description**: Get WhatsApp contact links for UMKM sellers to discuss order delivery
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID of transaction)
- **Response**: Array of WhatsApp links grouped by UMKM
- **Response Format**:
  ```json
  {
    "success": true,
    "data": [
      {
        "umkm_id": "uuid",
        "nama_toko": "Toko Bambu Lestari",
        "whatsapp_url": "https://wa.me/6281234567890?text=Halo%20Toko%20Bambu%20Lestari%2C%20saya%20ingin%20mendiskusikan%20pengiriman%20untuk%20pesanan%20via%20Bola%20Duwit.%0AID%20Transaksi%3A%20uuid-here%0A%0ADetail%20Pesanan%3A%0A-%20Kerajinan%20Bambu%20(2x)%0A%0ATotal%20Belanja%20di%20Toko%20Ini%3A%20Rp%2050.000%0AAlamat%20Pengiriman%3A%20Jl.%20Sudirman%20No.%20123"
      }
    ]
  }
  ```
- **Purpose**: Allows customers to contact UMKM sellers directly via WhatsApp to coordinate delivery

#### Midtrans Payment Webhook
**POST** `https://bola-duwit.my.id/api/midtrans/webhook`
- **Description**: Handle Midtrans payment notifications and automatically update transaction status
- **Auth**: None (called by Midtrans)
- **Request Body**: Midtrans notification payload
- **Automatic Actions**:
  - Payment successful (capture/settlement): Update status to 'diproses'
  - Payment failed/expired/cancelled (deny/cancel/expire/failure): Update status to 'dibatalkan'
- **Response**: `{"status": "OK"}`
- **Purpose**: Automatically handle payment status changes from Midtrans

#### Get Cart Items
**GET** `https://bola-duwit.my.id/api/cart`
- **Description**: Get all items in user's shopping cart
- **Auth**: Bearer token (guest role)
- **Response**: List of cart items with product details and total price
- **Response Format**:
  ```json
  {
    "status": "success",
    "data": {
      "items": [
        {
          "id": "uuid",
          "user_id": "uuid",
          "produk_id": "uuid",
          "quantity": 2,
          "created_at": "timestamp",
          "updated_at": "timestamp",
          "produk": {
            "id": "uuid",
            "nama_produk": "Kerajinan Bambu",
            "harga": 25000,
            // ... other product fields
          }
        }
      ],
      "total": 50000
    }
  }
  ```

#### Add to Cart
**POST** `https://bola-duwit.my.id/api/cart`
- **Description**: Add a product to the shopping cart
- **Auth**: Bearer token (guest role)
- **Request Body**:
  ```json
  {
    "produk_id": "uuid (required, exists in produk table)",
    "quantity": "integer (required, min:1)"
  }
  ```
- **Behavior**: If product already exists in cart, quantity will be added to existing item
- **Response**: Cart item data
- **Response Format**:
  ```json
  {
    "status": "success",
    "message": "Produk berhasil ditambahkan ke keranjang",
    "data": {
      "id": "uuid",
      "user_id": "uuid",
      "produk_id": "uuid",
      "quantity": 3,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```

#### Update Cart Item
**PATCH** `https://bola-duwit.my.id/api/cart/{id}`
- **Description**: Update quantity of a specific cart item
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID of cart item)
- **Request Body**:
  ```json
  {
    "quantity": "integer (required, min:1)"
  }
  ```
- **Response**: Updated cart item data
- **Response Format**:
  ```json
  {
    "status": "success",
    "message": "Keranjang berhasil diperbarui",
    "data": {
      "id": "uuid",
      "user_id": "uuid",
      "produk_id": "uuid",
      "quantity": 5,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```

#### Remove from Cart
**DELETE** `https://bola-duwit.my.id/api/cart/{id}`
- **Description**: Remove a specific item from the shopping cart
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID of cart item)
- **Response**: Success message
- **Response Format**:
  ```json
  {
    "status": "success",
    "message": "Produk dihapus dari keranjang"
  }
  ```

### UMKM User Endpoints

#### Get UMKM Profile
**GET** `https://bola-duwit.my.id/api/umkm/profile`
- **Description**: Get current user's UMKM profile
- **Auth**: Bearer token (umkm role)
- **Response**: UMKM profile data

#### Create UMKM Profile
**POST** `https://bola-duwit.my.id/api/umkm/profile`
- **Description**: Create UMKM profile
- **Auth**: Bearer token (umkm role)
- **Content-Type**: `multipart/form-data` (for KTP photo upload)
- **Request Body** (Form Data):
  ```form
  nama_toko: "Toko Bambu Lestari" (required, max:100)
  deskripsi: "Deskripsi toko" (nullable, max:255)
  alamat: "Jl. Sudirman No. 123" (required, max:255)
  lintang: -6.2088 (nullable, -90 to 90)
  bujur: 106.8456 (nullable, -180 to 180)
  kontak_wa: "081234567890" (nullable, max:30)
  nomor_rekening: "1234567890" (nullable, max:50)
  nama_bank: "BCA" (nullable, max:50)
  url_foto_ktp: [file] (nullable, file, max:4096KB/4MB, formats: jpeg,png,jpg,gif)
  ```
- **File Upload**: Send `url_foto_ktp` as a file upload field, not a string URL
- **Response**: Created profile data with full KTP image URL (e.g., `https://bola-duwit.my.id/storage/ktp/filename.jpg`)

#### Update UMKM Profile
**PUT** `https://bola-duwit.my.id/api/umkm/profile`
- **Description**: Update UMKM profile
- **Auth**: Bearer token (umkm role)
- **Content-Type**: `multipart/form-data` (for KTP photo upload)
- **Request Body** (Form Data): Same as create, all fields optional
- **File Upload**: Send `url_foto_ktp` as a file upload field to replace existing KTP image (old image will be automatically deleted)
- **File Size Limit**: Same as create - max 4096KB/4MB, formats: jpeg,png,jpg,gif
- **Response**: Updated profile data with full KTP image URL if uploaded

#### Toggle Store Status
**POST** `https://bola-duwit.my.id/api/umkm/toggle-store`
- **Description**: Toggle store open/close status
- **Auth**: Bearer token (umkm role, active status)
- **Response**: Updated profile with new status

#### Get UMKM Orders
**GET** `https://bola-duwit.my.id/api/umkm/orders`
- **Description**: Get incoming orders/transactions for UMKM products
- **Auth**: Bearer token (umkm role, active status)
- **Response**: List of transactions where UMKM products were purchased, including customer details
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Data transaksi UMKM berhasil diambil",
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "alamat_pengiriman": "Jl. Sudirman No. 123",
        "metode_pembayaran": "COD",
        "status_transaksi": "menunggu",
        "total_harga": 75000,
        "tanggal_transaksi": "2025-11-30T14:30:00.000000Z",
        "user": {
          "nama": "John Doe",
          "email": "john@example.com",
          "nomor_hp": "081234567890"
        },
        "details": [
          {
            "id": "uuid",
            "transaksi_id": "uuid",
            "produk_id": "uuid",
            "jumlah": 2,
            "harga_satuan": 25000,
            "subtotal": 50000,
            "produk": {
              "nama_produk": "Kerajinan Bambu",
              "harga": 25000
            }
          }
        ]
      }
    ]
  }
  ```

#### Update UMKM Order Status
**PUT** `https://bola-duwit.my.id/api/umkm/orders/{id}/status`
- **Description**: Update transaction status for orders belonging to UMKM (UMKM can only change status from menunggu→diproses or diproses→dikirim)
- **Auth**: Bearer token (umkm role, active status)
- **Parameters**: id (UUID of transaction)
- **Request Body**:
  ```json
  {
    "status_transaksi": "string (required, enum: diproses,dikirim)"
  }
  ```
- **Allowed Status Transitions**:
  - menunggu → diproses
  - diproses → dikirim
- **Restrictions**: UMKM cannot set status to 'selesai' or 'dibatalkan' (admin only)
- **Response**: Updated transaction data
- **Error Responses**:
  - **400 Bad Request**: Invalid status transition
  - **404 Not Found**: Transaction not found or doesn't belong to UMKM

#### Get UMKM Payment Proofs
**GET** `https://bola-duwit.my.id/api/umkm/payment-proofs`
- **Description**: Get all payment proofs for transactions where UMKM's products were sold
- **Auth**: Bearer token (umkm role, active status)
- **Response**: List of payment proofs with transaction details and payment information
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Data bukti pembayaran berhasil diambil",
    "data": [
      {
        "transaction_id": "uuid",
        "tanggal_transaksi": "2025-12-01T10:00:00.000000Z",
        "tanggal_pembayaran": "2025-12-05T03:20:00.000000Z",
        "total_pembayaran": 75000,
        "bukti_transfer_path": "payment_proofs/payment_proof_uuid_1733368800.jpg",
        "bukti_transfer_url": "https://bola-duwit.my.id/storage/payment_proofs/payment_proof_uuid_1733368800.jpg",
        "admin_pembayaran": "Admin Name",
        "customer_name": "John Doe",
        "products": [
          {
            "nama_produk": "Kerajinan Bambu",
            "jumlah": 3,
            "harga_satuan": 25000,
            "subtotal": 75000
          }
        ]
      }
    ]
  }
  ```

#### Get Products
**GET** `https://bola-duwit.my.id/api/produk`
- **Description**: Get products (UMKM: own products, Guest: products from verified UMKM with open stores)
- **Auth**: Bearer token (umkm or guest role)
- **Query Parameters**:
  - `umkm_id` (optional, UUID): Filter products by specific UMKM ID
- **Response**: List of products

#### Create Product
**POST** `https://bola-duwit.my.id/api/produk`
- **Description**: Create a new product (UMKM only)
- **Auth**: Bearer token (umkm role)
- **Content-Type**: `multipart/form-data` (for file uploads)
- **Request Body** (Form Data)**:
  ```form
  nama_produk: "Kerajinan Bambu" (required, max:100)
  deskripsi: "Kerajinan tangan dari bambu" (nullable, max:255)
  harga: 50000 (required, min:0)
  stok: 10 (required, min:0)
  kategori: "Kerajinan" (nullable, max:50)
  url_foto: [file] (nullable, file, max:4096KB/4MB, formats: jpeg,png,jpg,gif)
  url_video: "https://youtube.com/watch?v=..." (nullable, max:255)
  ```
- **File Upload**: Send `url_foto` as a file upload field, not a string URL
- **Response**: Created product data with full image URL (e.g., `https://bola-duwit.my.id/storage/products/filename.jpg`)

#### Get Product Detail
**GET** `https://bola-duwit.my.id/api/produk/{id}`
- **Description**: Get specific product details (UMKM: own products, Guest: products from verified UMKM with open stores)
- **Auth**: Bearer token (umkm or guest role)
- **Parameters**: id (UUID)
- **Response**: Product details

#### Update Product
**PUT** `https://bola-duwit.my.id/api/produk/{id}`
- **Description**: Update product (UMKM only)
- **Auth**: Bearer token (umkm role)
- **Content-Type**: `multipart/form-data` (for file uploads)
- **Parameters**: id (UUID)
- **Request Body** (Form Data)**: Same as create, all fields optional except when specified
- **File Upload**: Send `url_foto` as a file upload field to replace existing image (old image will be automatically deleted)
- **File Size Limit**: Same as create - max 4096KB/4MB, formats: jpeg,png,jpg,gif
- **Response**: Updated product data with full image URL if uploaded (e.g., `https://bola-duwit.my.id/storage/products/filename.jpg`)

#### Delete Product
**DELETE** `https://bola-duwit.my.id/api/produk/{id}`
- **Description**: Delete product (UMKM only)
- **Auth**: Bearer token (umkm role)
- **Parameters**: id (UUID)
- **Response**: Success message

### Admin Endpoints

#### Get Pending UMKM
**GET** `https://bola-duwit.my.id/api/admin/pending-umkm`
- **Description**: Get all pending UMKM users for approval
- **Auth**: Bearer token (admin role)
- **Response**: List of pending UMKM users with profile status

#### Approve UMKM
**POST** `https://bola-duwit.my.id/api/admin/approve-umkm/{id}`
- **Description**: Approve pending UMKM user
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Response**: Updated user data

#### Reject UMKM
**POST** `https://bola-duwit.my.id/api/admin/reject-umkm/{id}`
- **Description**: Reject pending UMKM user
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Request Body**:
  ```json
  {
    "reason": "string (nullable, max:255)"
  }
  ```
- **Response**: Updated user data

#### Get All Users
**GET** `https://bola-duwit.my.id/api/admin/users`
- **Description**: Get all users with their status
- **Auth**: Bearer token (admin role)
- **Response**: List of all users

#### Get All UMKM Profiles
**GET** `https://bola-duwit.my.id/api/admin/umkm-profiles`
- **Description**: Get all UMKM profiles
- **Auth**: Bearer token (admin role)
- **Response**: List of all UMKM profiles with user data

#### Get Approved UMKM Users
**GET** `https://bola-duwit.my.id/api/admin/approved-umkm`
- **Description**: Get all approved/active UMKM users with their profiles and status information
- **Auth**: Bearer token (admin role)
- **Response**: List of approved UMKM users with additional status flags
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Data UMKM yang sudah disetujui berhasil diambil",
    "data": [
      {
        "id": "uuid",
        "nama": "John Doe",
        "email": "john@example.com",
        "role": "umkm",
        "status": "active",
        "is_approved": true,
        "can_add_products": true,
        "profile_verified": false,
        "never_suspended": true,
        "umkm_profile": {
          "id": "uuid",
          "nama_toko": "Toko Bambu",
          "alamat": "Jl. Sudirman",
          "terverifikasi": false,
          "status_toko": "buka"
        }
      }
    ]
  }
  ```

#### Verify UMKM Profile
**POST** `https://bola-duwit.my.id/api/admin/verify-profile/{id}`
- **Description**: Verify UMKM profile after reviewing submitted documents (KTP photo and bank account details)
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID of UMKM profile)
- **Requirements**: UMKM must have submitted nomor_rekening and url_foto_ktp
- **Effects**: Sets terverifikasi = true, allows UMKM to add products and receive orders
- **Response**: Updated profile data with verification status

#### Suspend UMKM User
**POST** `https://bola-duwit.my.id/api/admin/suspend-umkm/{id}`
- **Description**: Suspend UMKM user account and automatically close their store
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Request Body**:
  ```json
  {
    "reason": "string (required, max:500)",
    "duration_days": "integer (nullable, min:1, max:365)"
  }
  ```
- **Effects**:
  - User status changed to 'suspended'
  - Store status automatically changed to 'tutup'
  - User cannot login or access UMKM features
  - Products become unavailable for purchase
- **Response**: Updated user data with suspension details

#### Unsuspend UMKM User
**POST** `https://bola-duwit.my.id/api/admin/unsuspend-umkm/{id}`
- **Description**: Restore suspended UMKM user to active status and reopen their store
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Effects**:
  - User status changed back to 'active'
  - Store status automatically changed to 'buka'
  - User can login and access UMKM features again
  - Products become available for purchase
- **Response**: Updated user data

#### Get Suspended UMKM Users
**GET** `https://bola-duwit.my.id/api/admin/suspended-umkm`
- **Description**: Get all suspended UMKM users with suspension details
- **Auth**: Bearer token (admin role)
- **Response**: List of suspended UMKM users with suspension information

#### Get All Transactions
**GET** `https://bola-duwit.my.id/api/admin/transactions`
- **Description**: Get all transactions for admin management with customer, product, and UMKM details
- **Auth**: Bearer token (admin role)
- **Response**: List of all transactions with additional admin information:
  ```json
  {
    "success": true,
    "message": "Data semua transaksi berhasil diambil",
    "data": [
      {
        "id": "uuid",
        "total_harga": 50000.00,
        "metode_pembayaran": "COD",
        "status_transaksi": "dikirim",
        "alamat_pengiriman": "Jl. Sudirman No. 123",
        "tanggal_transaksi": "2025-11-10T08:00:00.000000Z",
        "tanggal_diperbarui": "2025-11-10T10:30:00.000000Z",
        "nama_pembeli": "John Doe",
        "nama_umkm": "Toko Bambu Lestari",
        "harga": 50000.00,
        "status_pesanan": "dikirim",
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "products": [
          {
            "nama_produk": "Kerajinan Bambu",
            "nama_umkm": "Toko Bambu Lestari",
            "umkm_name": "Toko Bambu Lestari",
            "umkm_owner": "Jane Smith",
            "jumlah": 2,
            "harga_satuan": 25000,
            "subtotal": 50000
          }
        ],
        "product_name": "Kerajinan Bambu",
        "umkm_name": "Toko Bambu Lestari",
        "umkm_owner": "Jane Smith",
        "funds_held": true,
        "can_release_funds": true
      }
    ]
  }
  ```

#### Get Transactions by Status
**GET** `https://bola-duwit.my.id/api/admin/transactions/status/{status}`
- **Description**: Get transactions filtered by specific status
- **Auth**: Bearer token (admin role)
- **Parameters**: status (enum: menunggu, diproses, dikirim, selesai, dibatalkan)
- **Response**: List of transactions with the specified status, including detailed product information
- **Response Format**: Same as Get All Transactions but filtered by status

#### Update Transaction Status
**PUT** `https://bola-duwit.my.id/api/admin/transactions/{id}/status`
- **Description**: Update transaction status (admin only)
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Request Body**:
  ```json
  {
    "status_transaksi": "string (required, enum: menunggu,diproses,dikirim,selesai,dibatalkan)"
  }
  ```
- **Response**: Updated transaction data with relationships loaded

#### Release Funds to UMKM
**POST** `https://bola-duwit.my.id/api/admin/transactions/{id}/release-funds`
- **Description**: Release held funds to UMKM after confirming product delivery completion
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Requirements**: Transaction status must be 'dikirim'
- **Effects**:
  - Transaction status changed to 'selesai'
  - Funds are released to UMKM (manual transfer by admin)
  - Transaction marked as completed
- **Response**: Updated transaction data

#### Get Completed Transactions for Payment
**GET** `https://bola-duwit.my.id/api/admin/payments/completed-transactions`
- **Description**: Get all completed transactions that need UMKM payment with detailed UMKM banking information
- **Auth**: Bearer token (admin role)
- **Response**: List of completed transactions with per-UMKM payment status and banking details
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Data transaksi selesai untuk pembayaran UMKM berhasil diambil",
    "data": [
      {
        "id": "uuid",
        "total_harga": 75000.00,
        "status_transaksi": "selesai",
        "status_pembayaran": "belum_dibayarkan", // Overall status (all UMKM paid or not)
        "tanggal_transaksi": "2025-12-01T10:00:00.000000Z",
        "nama_pembeli": "John Doe",
        "umkm_payment_info": [
          {
            "umkm_id": "uuid-umkm-a",
            "nama_toko": "Toko Bambu Lestari",
            "owner": "Jane Smith",
            "nomor_rekening": "1234567890",
            "nama_bank": "BCA",
            "total_pembayaran": 50000,
            "status_pembayaran": "sudah_dibayarkan",
            "tanggal_pembayaran": "2025-12-05T03:20:00.000000Z",
            "bukti_transfer_path": "payment_proofs/payment_proof_uuid.jpg",
            "admin_pembayaran": "Admin Name"
          },
          {
            "umkm_id": "uuid-umkm-b",
            "nama_toko": "Toko Keramik Indah",
            "owner": "Bob Wilson",
            "nomor_rekening": "0987654321",
            "nama_bank": "Mandiri",
            "total_pembayaran": 25000,
            "status_pembayaran": "belum_dibayarkan",
            "tanggal_pembayaran": null,
            "bukti_transfer_path": null,
            "admin_pembayaran": null
          }
        ]
      }
    ]
  }
  ```

#### Upload Payment Proof for Specific UMKM
**POST** `https://bola-duwit.my.id/api/admin/payments/{transaction_id}/umkm/{umkm_id}/upload-proof`
- **Description**: Upload payment proof for a specific UMKM in a transaction
- **Auth**: Bearer token (admin role)
- **Parameters**:
  - transaction_id (UUID of transaction)
  - umkm_id (UUID of UMKM)
- **Content-Type**: `multipart/form-data`
- **Request Body** (Form Data):
  ```form
  bukti_transfer: [file] (required, image, max:2048KB, formats: jpeg,png,jpg,gif)
  ```
- **Requirements**:
  - Transaction status must be 'selesai'
  - UMKM must be involved in the transaction
- **Effects**:
  - Creates/updates record in `umkm_payments` table
  - Payment status for this UMKM changed to 'sudah_dibayarkan'
  - Payment proof file uploaded to `storage/app/public/payment_proofs/`
  - Payment date and admin ID recorded
- **Response**:
  ```json
  {
    "success": true,
    "message": "Bukti pembayaran berhasil diupload",
    "data": {
      "transaction_id": "uuid",
      "umkm_id": "uuid",
      "bukti_transfer_path": "payment_proofs/filename.jpg",
      "status_pembayaran": "sudah_dibayarkan",
      "tanggal_pembayaran": "2025-12-05T03:20:00.000000Z",
      "jumlah_pembayaran": 50000
    }
  }
  ```

#### Legacy Upload Payment Proof (Deprecated)
**POST** `https://bola-duwit.my.id/api/admin/payments/{id}/upload-proof`
- **Description**: Legacy endpoint for bulk payment upload (deprecated)
- **Status**: 410 Gone - Use the new per-UMKM endpoint instead

#### Forgot Password
**POST** `https://bola-duwit.my.id/api/users/forgot-password`
- **Description**: Request password reset link via email
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, email, exists in users table)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reset password link has been sent to your email"
  }
  ```
- **Email Content**: User receives an email with a secure reset link that expires in 1 hour

#### Reset Password (API)
**POST** `https://bola-duwit.my.id/api/users/reset-password`
- **Description**: Reset password using reset token
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "string (required, email, exists in users table)",
    "reset_token": "string (required)",
    "new_password": "string (required, min:8)",
    "new_password_confirmation": "string (required, must match new_password)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

#### Reset Password (Web Page)
**GET** `https://bola-duwit.my.id/reset-password`
- **Description**: Display password reset form (when accessed with token parameters)
- **Auth**: None
- **Query Parameters**:
  - `token` (required): Reset token from email
  - `email` (required): User email
- **Response**: HTML form for password reset

**POST** `https://bola-duwit.my.id/reset-password`
- **Description**: Process password reset form submission
- **Auth**: None
- **Request Body**: Form data (email, reset_token, new_password, new_password_confirmation)
- **Response**: Success/error message with redirect


#### Test Image Access
**GET** `https://bola-duwit.my.id/api/test-image/{filename}`
- **Description**: Test endpoint to verify uploaded product images are accessible
- **Auth**: None
- **Parameters**: filename (string): The image filename from the products storage
- **Example**: `GET /api/test-image/1762848959_uuid.jpg`
- **Response**: Returns the image file if it exists, or 404 error if not found
- **Purpose**: Debugging tool to verify file upload and storage link functionality

## Transaction Flow and Escrow System

### Payment Methods
- **COD (Cash on Delivery)**: Customer pays upon product delivery
- **Midtrans**: Online payment gateway integration

### Transaction Status Flow
1. **menunggu**: Order placed, waiting for processing
2. **diproses**: Order being prepared/processed
3. **dikirim**: Product shipped to customer
4. **selesai**: Product delivered, funds released to UMKM
5. **dibatalkan**: Order cancelled

### Escrow System
- **Fund Holding**: All payments (COD/Midtrans) are held by admin until product delivery is confirmed
- **Fund Release**: Admin manually releases funds to UMKM only after transaction status becomes 'selesai'
- **Per-UMKM Payments**: For transactions with multiple UMKM, admin can pay each UMKM individually
- **Payment Proof**: Admin uploads payment proof (screenshot/photo) for each UMKM payment
- **Payment Tracking**: System tracks payment status per UMKM (belum_dibayarkan/sudah_dibayarkan) in `umkm_payments` table
- **Granular Control**: Admin can see payment status for each UMKM in a transaction and pay them separately
- **Security**: Protects both customers (ensures delivery) and UMKM (ensures payment)

### Admin Responsibilities
- Monitor all transactions
- Update transaction statuses as orders progress
- Confirm product delivery completion
- Manually transfer funds to UMKM bank accounts (per UMKM for multi-UMKM transactions)
- Upload payment proof for each UMKM payment individually
- Track payment status per UMKM in transactions with multiple sellers
- Handle disputes and cancellations
- Provide payment transparency to UMKM through detailed payment records

## API Integration Notes
- All API responses follow the same JSON structure: `{success: boolean, message: string, data: object|array|null}`
- Use `Authorization: Bearer {token}` header for authenticated requests
- Handle both success and error responses in your client application
- For file uploads, use `multipart/form-data` content type
- Password reset links redirect to web forms, not API endpoints

## File Upload Guide

### Product Image Upload
Products support image uploads with the following specifications:

- **Allowed Formats**: JPEG, PNG, JPG, GIF
- **Maximum Size**: 4MB (4096 KB) per image
- **Validation Rule**: `'url_foto' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:4096'`
- **Storage**: Images are stored in `storage/app/public/products/`
- **Public Access**: Images are accessible via full URL (e.g., `https://bola-duwit.my.id/storage/products/filename.jpg`)
- **Automatic Naming**: Files are renamed with timestamp + product ID for uniqueness

### Payment Proof Upload
Payment proofs (screenshots/photos of bank transfers) support image uploads with the following specifications:

- **Allowed Formats**: JPEG, PNG, JPG, GIF
- **Maximum Size**: 2MB (2048 KB) per image
- **Validation Rule**: `'bukti_transfer' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'`
- **Storage**: Images are stored in `storage/app/public/payment_proofs/`
- **Public Access**: Images are accessible via full URL (e.g., `https://bola-duwit.my.id/storage/payment_proofs/filename.jpg`)
- **Automatic Naming**: Files are renamed with "payment_proof_" + transaction ID + timestamp for uniqueness
- **Usage**: Admin uploads proof after manually transferring funds to UMKM bank accounts

### Upload Process
1. **Create/Update Product**: Send `url_foto` as a file upload field (not string URL)
2. **Content-Type**: `multipart/form-data` (set automatically by FormData)
3. **File Field**: Name the file input field as `url_foto`
4. **Type Casting**: Numeric fields (harga, stok) are automatically cast from strings
5. **Directory Creation**: Storage directories are created automatically if they don't exist
6. **Response**: Server returns the product with `url_foto` containing the public URL



### Storage Link
The storage link has been created to make uploaded files publicly accessible. Images are served from:
```
https://bola-duwit.my.id/storage/products/filename.jpg
```

## Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "message": "string",
  "data": object|array|null
}
```

## Error Responses
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## Troubleshooting

### File Upload Issues

#### ✅ FIXED: API Now Returns Full URLs
**Update (November 2025):** The API now returns full URLs instead of relative paths:
- **Before:** `"url_foto": "/storage/products/filename.jpg"`
- **After:** `"url_foto": "https://bola-duwit.my.id/storage/products/filename.jpg"`

This change ensures frontend compatibility across all platforms (Mobile, Web, Desktop).

**Implementation:** Uses `url('storage/products/filename')` helper to generate full URLs based on APP_URL configuration.

#### Problem: Image uploaded successfully but not displaying in frontend
**Symptoms:**
- Database shows path: `/storage/products/filename.jpg` or full URL
- Frontend shows broken image or 404 error
- File may or may not exist in `storage/app/public/products/` directory

**Solutions:**
1. **Check Storage Link:**
   ```bash
   cd Bola_Duwit_admin
   php artisan storage:link
   ls -la public/storage  # Should point to storage/app/public
   ```

2. **Verify File Exists:**
   ```bash
   ls -la storage/app/public/products/
   ```

3. **Test Direct Access:**
   ```
   GET https://bola-duwit.my.id/api/test-image/filename.jpg
   GET https://bola-duwit.my.id/storage/products/filename.jpg
   ```

4. **Check Permissions:**
   ```bash
   chmod -R 755 storage/
   chmod -R 755 public/storage/
   chown -R www-data:www-data storage/  # or your web server user
   ```

5. **Clear Laravel Cache (Important!):**
    ```bash
    cd Bola_Duwit_admin
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    ```
    **Why?** Laravel caches configuration. Changes to APP_URL or helper functions won't take effect until cache is cleared.

6. **Verify API Returns Full URL:**
    - API should return: `https://bola-duwit.my.id/storage/products/filename.jpg`
    - Not relative path: `/storage/products/filename.jpg`
    - If still returning relative path, check that `url()` helper is used in controller

7. **Check Laravel URL Configuration:**
    ```php
    // In .env file
    APP_URL=https://bola-duwit.my.id
    ```
    Then run: `php artisan config:cache` to apply changes

7. **Browser Network Tab:**
   - Check if image request shows 404, CORS error, or network failure
   - Verify the exact URL being requested by frontend

#### Problem: File size exceeds 4MB limit
**Error Message:**
```json
{
  "success": false,
  "message": "The url_foto must not be greater than 4096 kilobytes.",
  "errors": {
    "url_foto": ["The url_foto must not be greater than 4096 kilobytes."]
  }
}
```

**Solutions:**
- Compress your image to under 4MB
- Resize image dimensions (recommended: max 1920x1080px)
- Use image optimization tools (TinyPNG, ImageOptim)
- Convert to more efficient format (JPEG instead of PNG for photos)

#### Problem: 500 Internal Server Error during upload
**Check Laravel Logs:**
```bash
tail -f storage/logs/laravel.log
```

**Common Causes:**
- Invalid file type or size
- Storage directory not writable
- Missing storage link
- Type casting issues with numeric fields

#### Problem: Image URL shows but image doesn't load
**Check Network Tab in Browser:**
- Verify the full URL is correct
- Check if CORS headers are blocking the request
- Ensure the file actually exists on the server

### Database Connection Issues
If you get database connection errors:
1. Verify `.env` database credentials
2. Check if MySQL/MariaDB is running
3. Ensure database exists and user has proper permissions

### Email Not Sending
1. Check `.env` mail configuration
2. Verify SMTP credentials
3. Check Laravel logs for mail errors
4. Test with Mailtrap for development

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error