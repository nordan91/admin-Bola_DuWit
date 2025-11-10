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

### Transaksi Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Primary key | Primary, UUID |
| jumlah | INTEGER | Quantity | Default: 1, Min: 1 |
| total_harga | DECIMAL(12,2) | Total price | Required |
| metode_pembayaran | ENUM | Payment method | Required (COD, Midtrans) |
| status_transaksi | ENUM | Transaction status | Required (menunggu, diproses, dikirim, selesai, dibatalkan) |
| alamat_pengiriman | VARCHAR(255) | Shipping address | Required |
| tanggal_transaksi | TIMESTAMP | Transaction date | Auto |
| tanggal_diperbarui | TIMESTAMP | Last update date | Nullable |
| user_id | UUID | Foreign key to users | Foreign key, Cascade delete |
| produk_id | UUID | Foreign key to produk | Foreign key, Cascade delete |

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
- **Response**: User data with authentication token

#### Get All Users (Admin)
**GET** `https://bola-duwit.my.id/api/users`
- **Description**: Get all users (admin only)
- **Auth**: Bearer token (admin role)
- **Response**: List of all users

### Guest User Endpoints

#### Get User Transactions
**GET** `https://bola-duwit.my.id/api/transaksi`
- **Description**: Get user's transaction history
- **Auth**: Bearer token (guest role)
- **Response**: List of user's transactions

#### Create Transaction
**POST** `https://bola-duwit.my.id/api/transaksi`
- **Description**: Create a new transaction
- **Auth**: Bearer token (guest role)
- **Middleware**: store_status (checks if store is open)
- **Request Body**:
  ```json
  {
    "produk_id": "uuid (required, exists in produk)",
    "jumlah": "integer (required, min:1)",
    "alamat_pengiriman": "string (required, max:255)",
    "metode_pembayaran": "string (required, enum: COD,Midtrans)"
  }
  ```
- **Response**: Created transaction data

#### Get Transaction Detail
**GET** `https://bola-duwit.my.id/api/transaksi/{id}`
- **Description**: Get specific transaction details
- **Auth**: Bearer token (guest role)
- **Parameters**: id (UUID)
- **Response**: Transaction details

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
- **Request Body**:
  ```json
  {
    "nama_toko": "string (required, max:100)",
    "deskripsi": "string (nullable, max:255)",
    "alamat": "string (required, max:255)",
    "lintang": "number (nullable, -90 to 90)",
    "bujur": "number (nullable, -180 to 180)",
    "kontak_wa": "string (nullable, max:30)"
  }
  ```
- **Response**: Created profile data

#### Update UMKM Profile
**PUT** `https://bola-duwit.my.id/api/umkm/profile`
- **Description**: Update UMKM profile
- **Auth**: Bearer token (umkm role)
- **Request Body**: Same as create, all fields optional
- **Response**: Updated profile data

#### Toggle Store Status
**POST** `https://bola-duwit.my.id/api/umkm/toggle-store`
- **Description**: Toggle store open/close status
- **Auth**: Bearer token (umkm role, active status)
- **Response**: Updated profile with new status

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
- **Request Body**:
  ```json
  {
    "nama_produk": "string (required, max:100)",
    "deskripsi": "string (nullable, max:255)",
    "harga": "number (required, min:0)",
    "stok": "integer (required, min:0)",
    "kategori": "string (nullable, max:50)",
    "url_foto": "string (nullable, max:255)",
    "url_video": "string (nullable, max:255)"
  }
  ```
- **Response**: Created product data

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
- **Parameters**: id (UUID)
- **Request Body**: Same as create, all fields optional except when specified
- **Response**: Updated product data

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
**GET** ` `
- **Description**: Get all UMKM profiles
- **Auth**: Bearer token (admin role)
- **Response**: List of all UMKM profiles with user data

#### Verify UMKM Profile
**POST** `https://bola-duwit.my.id/api/admin/verify-profile/{id}`
- **Description**: Verify UMKM profile
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Response**: Updated profile data

#### Suspend UMKM User
**POST** `https://bola-duwit.my.id/api/admin/suspend-umkm/{id}`
- **Description**: Suspend UMKM user account
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Request Body**:
  ```json
  {
    "reason": "string (required, max:500)",
    "duration_days": "integer (nullable, min:1, max:365)"
  }
  ```
- **Response**: Updated user data with suspension details

#### Unsuspend UMKM User
**POST** `https://bola-duwit.my.id/api/admin/unsuspend-umkm/{id}`
- **Description**: Restore suspended UMKM user to active status
- **Auth**: Bearer token (admin role)
- **Parameters**: id (UUID)
- **Response**: Updated user data

#### Get Suspended UMKM Users
**GET** `https://bola-duwit.my.id/api/admin/suspended-umkm`
- **Description**: Get all suspended UMKM users with suspension details
- **Auth**: Bearer token (admin role)
- **Response**: List of suspended UMKM users with suspension information

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
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error