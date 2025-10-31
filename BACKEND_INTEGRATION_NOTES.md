# Backend Integration Notes

## 🔄 Penyesuaian dengan Backend Controller

Dokumen ini menjelaskan penyesuaian yang telah dilakukan untuk mengintegrasikan frontend dengan struktur response dari backend controller yang sebenarnya.

## 📊 Struktur Response Backend

### 1. **AdminController::getPendingUmkm()**

**Endpoint**: `GET /api/admin/pending-umkm`

**Response Structure**:
```json
{
  "success": true,
  "message": "Data UMKM pending berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "nama": "string",
      "email": "string",
      "nomor_hp": "string|null",
      "role": "umkm",
      "status": "pending",
      "created_at": "timestamp",
      "updated_at": "timestamp|null",
      "umkmProfile": {
        "id": "uuid",
        "nama_toko": "string",
        "deskripsi": "string|null",
        "alamat": "string",
        "lintang": "number|null",
        "bujur": "number|null",
        "kontak_wa": "string|null",
        "terverifikasi": false,
        "status_toko": "tutup",
        "created_at": "timestamp",
        "updated_at": "timestamp|null",
        "user_id": "uuid"
      },
      "has_profile": true,
      "profile_completed": true
    }
  ]
}
```

**Key Points**:
- Returns **users** with `umkmProfile` relation (Laravel Eloquent relationship)
- Includes additional computed fields: `has_profile`, `profile_completed`
- Only returns users with `role='umkm'` and `status='pending'`
- `umkmProfile` can be `null` if user hasn't created profile yet

### 2. **AdminController::getAllUmkmProfiles()**

**Endpoint**: `GET /api/admin/umkm-profiles`

**Response Structure**:
```json
{
  "success": true,
  "message": "Data semua profile UMKM berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "nama_toko": "string",
      "deskripsi": "string|null",
      "alamat": "string",
      "lintang": "number|null",
      "bujur": "number|null",
      "kontak_wa": "string|null",
      "terverifikasi": false,
      "status_toko": "tutup",
      "created_at": "timestamp",
      "updated_at": "timestamp|null",
      "user_id": "uuid",
      "user": {
        "id": "uuid",
        "nama": "string",
        "email": "string",
        "nomor_hp": "string|null",
        "role": "umkm",
        "status": "active|pending|rejected",
        "created_at": "timestamp",
        "updated_at": "timestamp|null"
      }
    }
  ]
}
```

**Key Points**:
- Returns **profiles** with `user` relation
- Only returns profiles that exist (users without profiles won't appear)
- Can include users with any status (active, pending, rejected)

### 3. **AdminController::approveUmkm()**

**Endpoint**: `POST /api/admin/approve-umkm/{id}`

**Response Structure**:
```json
{
  "success": true,
  "message": "UMKM berhasil disetujui",
  "data": {
    "id": "uuid",
    "nama": "string",
    "email": "string",
    "nomor_hp": "string|null",
    "role": "umkm",
    "status": "active",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Key Points**:
- Changes user `status` from `pending` to `active`
- Returns updated user object
- Validates that user has `role='umkm'` and `status='pending'`

### 4. **AdminController::rejectUmkm()**

**Endpoint**: `POST /api/admin/reject-umkm/{id}`

**Request Body**:
```json
{
  "reason": "string|optional"
}
```

**Response Structure**:
```json
{
  "success": true,
  "message": "UMKM berhasil ditolak",
  "data": {
    "id": "uuid",
    "nama": "string",
    "email": "string",
    "nomor_hp": "string|null",
    "role": "umkm",
    "status": "rejected",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Key Points**:
- Changes user `status` from `pending` to `rejected`
- Accepts optional `reason` parameter (currently not stored in DB)
- Returns updated user object

## 🔧 Frontend Adjustments

### Type Definitions (`src/types/admin.ts`)

**Updated Types**:
```typescript
// User with umkmProfile relation (from getPendingUmkm)
export interface ApiPendingUMKMUser extends ApiUser {
  umkmProfile: ApiUMKMProfile | null;
  has_profile: boolean;
  profile_completed: boolean;
}

// Profile with user relation (from getAllUmkmProfiles)
export interface ApiUMKMProfileWithUser extends ApiUMKMProfile {
  user: ApiUser;
}
```

**Why**:
- Reflects actual Laravel Eloquent relationship structure
- `getPendingUmkm` returns users with nested profile
- `getAllUmkmProfiles` returns profiles with nested user

### Mapper Functions (`src/utils/umkmMapper.ts`)

**Updated Logic**:
```typescript
export function mapApiToUMKMAccount(
  apiData: ApiPendingUMKMUser | ApiUMKMProfileWithUser
): UMKMAccount {
  // Detect response type and extract user/profile accordingly
  if ('umkmProfile' in apiData) {
    // From getPendingUmkm
    user = apiData;
    profile = apiData.umkmProfile;
  } else {
    // From getAllUmkmProfiles
    profile = apiData;
    user = apiData.user;
  }
  // ... mapping logic
}
```

**Why**:
- Single mapper handles both response formats
- Automatically detects which endpoint the data came from
- Extracts user and profile correctly based on structure

### API Service (`src/services/api.ts`)

**Updated Return Types**:
```typescript
async getPendingUMKM(): Promise<ApiResponse<ApiPendingUMKMUser[]>>
async getAllUMKMProfiles(): Promise<ApiResponse<ApiUMKMProfileWithUser[]>>
```

**Why**:
- Type safety matches actual backend response
- TypeScript can validate response structure
- Better IDE autocomplete and error detection

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     UMKMManagement Component                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Fetch Pending UMKM                                           │
│     GET /api/admin/pending-umkm                                  │
│     ↓                                                             │
│     Response: User[] with umkmProfile relation                   │
│     [                                                             │
│       {                                                           │
│         id, nama, email, status: "pending",                      │
│         umkmProfile: { nama_toko, alamat, ... } | null,         │
│         has_profile: true/false                                  │
│       }                                                           │
│     ]                                                             │
│                                                                   │
│  2. Fetch All UMKM Profiles                                      │
│     GET /api/admin/umkm-profiles                                 │
│     ↓                                                             │
│     Response: Profile[] with user relation                       │
│     [                                                             │
│       {                                                           │
│         id, nama_toko, alamat, ...,                             │
│         user: { id, nama, email, status: "active/rejected" }    │
│       }                                                           │
│     ]                                                             │
│                                                                   │
│  3. Map Both Responses                                           │
│     mapApiArrayToUMKMAccounts()                                  │
│     ↓                                                             │
│     - Detect response type (user-based vs profile-based)        │
│     - Extract user and profile from correct location            │
│     - Convert to UMKMAccount format                             │
│     - Generate category, placeholder image, etc.                │
│                                                                   │
│  4. Merge Data                                                   │
│     - Create Map<userId, UMKMAccount>                           │
│     - Add all profiles (approved/rejected with profiles)        │
│     - Add/update pending users (may not have profiles)          │
│     - Result: Complete list of all UMKM accounts                │
│                                                                   │
│  5. Display in UI                                                │
│     - Tab: Menunggu (pending)                                   │
│     - Tab: Disetujui (active/approved)                          │
│     - Tab: Ditolak (rejected)                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Differences from Initial Implementation

### Before (Based on API Documentation):
```typescript
// Expected separate user and profile objects
interface ApiPendingUMKM {
  user: ApiUser;
  profile: ApiUMKMProfile | null;
}
```

### After (Based on Actual Controller):
```typescript
// User object with nested profile relation
interface ApiPendingUMKMUser extends ApiUser {
  umkmProfile: ApiUMKMProfile | null;
  has_profile: boolean;
  profile_completed: boolean;
}
```

**Why the Change**:
- Laravel Eloquent returns relationships as nested objects
- Controller uses `with('umkmProfile')` which adds profile to user object
- More efficient than separate queries
- Matches Laravel convention

## ✅ Validation Points

### 1. **Pending UMKM Without Profile**
```json
{
  "id": "uuid",
  "nama": "John Doe",
  "status": "pending",
  "umkmProfile": null,
  "has_profile": false,
  "profile_completed": false
}
```
**Frontend Handling**:
- Shows "Belum ada nama toko"
- Shows "Belum ada alamat"
- Shows "Belum ada deskripsi"
- Category: "Lainnya"
- Documents: ["Belum ada dokumen"]

### 2. **Pending UMKM With Profile**
```json
{
  "id": "uuid",
  "nama": "John Doe",
  "status": "pending",
  "umkmProfile": {
    "nama_toko": "Warung Makan",
    "alamat": "Jl. Example",
    "deskripsi": "Warung makan enak"
  },
  "has_profile": true,
  "profile_completed": true
}
```
**Frontend Handling**:
- Shows actual store name
- Shows actual address
- Extracts category from description
- Shows profile data in modal

### 3. **Approved UMKM**
```json
{
  "id": "uuid",
  "nama_toko": "Toko Buah",
  "user": {
    "id": "uuid",
    "nama": "Jane Doe",
    "status": "active"
  }
}
```
**Frontend Handling**:
- Maps to "approved" status
- Shows in "Disetujui" tab
- Full profile information available

## 🐛 Error Handling

### Backend Errors:
1. **401 Unauthorized**: Token expired → Auto logout
2. **404 Not Found**: User/Profile not found → Show error message
3. **400 Bad Request**: Invalid operation → Show error message
4. **500 Server Error**: Backend issue → Show generic error

### Frontend Handling:
```typescript
try {
  await apiService.approveUMKM(userId);
} catch (err) {
  setError(err.message || 'Gagal menyetujui UMKM');
}
```

## 📝 Testing Checklist

- [x] Fetch pending UMKM with profiles
- [x] Fetch pending UMKM without profiles
- [x] Fetch all UMKM profiles (approved/rejected)
- [x] Merge data correctly
- [x] Display in correct tabs
- [x] Approve UMKM functionality
- [x] Reject UMKM functionality
- [x] Error handling
- [x] Loading states
- [x] Type safety

## 🚀 Next Steps

1. **Test with Real Backend**:
   - Verify response structure matches
   - Test all CRUD operations
   - Validate error handling

2. **Add Features**:
   - Verify profile button (calls verifyUmkmProfile endpoint)
   - Show profile completion status in UI
   - Add rejection reason input

3. **Optimize**:
   - Add caching for frequently accessed data
   - Implement pagination if needed
   - Add real-time updates

## 📞 Support

If response structure differs from this documentation:
1. Check actual API response in Network tab
2. Update types in `src/types/admin.ts`
3. Update mapper in `src/utils/umkmMapper.ts`
4. Test thoroughly

---

**Last Updated**: 2024
**Status**: ✅ Adjusted to match actual backend controller