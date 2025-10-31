# Panduan Integrasi API UMKM Management

## Overview
Dokumen ini menjelaskan bagaimana UMKMManagement.tsx telah dihubungkan dengan API backend sesuai dengan API_DOCUMENTATION.md dan README_UMKM_WORKFLOW.md.

## Perubahan yang Dilakukan

### 1. **Update Types (`src/types/admin.ts`)**
Menambahkan interface baru yang sesuai dengan response API:
- `ApiUser`: Struktur user dari API
- `ApiUMKMProfile`: Struktur profil UMKM dari API
- `ApiPendingUMKM`: Struktur data pending UMKM
- `ApiResponse<T>`: Generic response wrapper dari API

### 2. **Extend API Service (`src/services/api.ts`)**
Menambahkan method baru untuk admin UMKM management:
- `getPendingUMKM()`: Mengambil daftar UMKM yang menunggu approval
- `getAllUMKMProfiles()`: Mengambil semua profil UMKM (approved, pending, rejected)
- `approveUMKM(userId)`: Menyetujui UMKM
- `rejectUMKM(userId, reason)`: Menolak UMKM dengan alasan
- `verifyUMKMProfile(profileId)`: Memverifikasi profil UMKM

### 3. **Utility Mapper (`src/utils/umkmMapper.ts`)** ⭐ NEW FILE
File utility untuk mengkonversi data API ke format yang digunakan komponen UI:
- `mapApiToUMKMAccount()`: Konversi single API response ke UMKMAccount
- `mapApiArrayToUMKMAccounts()`: Konversi array API responses ke UMKMAccount[]

**Fitur Mapping:**
- Otomatis mendeteksi kategori dari deskripsi
- Generate placeholder image berdasarkan kategori
- Map status API (`pending`, `active`, `rejected`) ke status UI (`pending`, `approved`, `rejected`)
- Handle data yang null/undefined dengan fallback values

### 4. **Update UMKMManagement Component (`src/components/Admin/UMKMManagement.tsx`)**
Komponen sekarang mendukung dua mode:
- **Mock Data Mode**: Menggunakan data dari props (backward compatible)
- **API Mode**: Fetch data langsung dari API

**Perubahan:**
- Props sekarang optional untuk mendukung API mode
- Menambahkan state management untuk loading dan error
- Implementasi `useEffect` untuk fetch data dari API
- Update handlers (`handleApprove`, `handleReject`) untuk call API
- Menambahkan UI feedback untuk loading dan error states

### 5. **Update AdminDashboard (`src/components/Admin/AdminDashboard.tsx`)**
Menambahkan prop `useMockData` untuk toggle antara mock data dan API:
```tsx
<AdminDashboard onLogout={handleLogout} useMockData={false} />
```

## Cara Penggunaan

### Mode 1: Menggunakan API (Recommended)
```tsx
// Di App.tsx atau parent component
<AdminDashboard onLogout={handleLogout} useMockData={false} />

// Atau langsung di route
<Route path="/admin/umkm" element={<UMKMManagement />} />
```

### Mode 2: Menggunakan Mock Data (Development/Testing)
```tsx
<AdminDashboard onLogout={handleLogout} useMockData={true} />

// Atau dengan explicit props
<UMKMManagement
  accounts={mockUMKMAccounts}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    UMKMManagement Component                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useEffect (on mount)                                        │
│    │                                                          │
│    ├─> apiService.getPendingUMKM()                          │
│    │     └─> GET /api/admin/pending-umkm                    │
│    │                                                          │
│    └─> apiService.getAllUMKMProfiles()                      │
│          └─> GET /api/admin/umkm-profiles                   │
│                                                               │
│  ┌──────────────────────────────────────────┐               │
│  │   mapApiArrayToUMKMAccounts()            │               │
│  │   - Convert API format to UI format      │               │
│  │   - Extract category from description    │               │
│  │   - Map status (active → approved)       │               │
│  │   - Generate placeholder images          │               │
│  └──────────────────────────────────────────┘               │
│                                                               │
│  User Actions:                                               │
│    │                                                          │
│    ├─> handleApprove()                                      │
│    │     └─> apiService.approveUMKM(userId)                │
│    │           └─> POST /api/admin/approve-umkm/{id}       │
│    │                                                          │
│    └─> handleReject()                                       │
│          └─> apiService.rejectUMKM(userId, reason)         │
│                └─> POST /api/admin/reject-umkm/{id}        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Mapping

### API Response → UI Component

| API Field | UI Field | Notes |
|-----------|----------|-------|
| `user.id` | `id` | UUID dari user |
| `profile.nama_toko` | `name` | Fallback: "Belum ada nama toko" |
| `user.nama` | `owner` | Nama pemilik |
| `user.email` | `email` | Email user |
| `user.nomor_hp` | `phone` | Fallback: "-" |
| `profile.alamat` | `location` | Fallback: "Belum ada alamat" |
| `profile.deskripsi` | `category` | Extracted dari keywords |
| `profile.deskripsi` | `description` | Fallback: "Belum ada deskripsi" |
| `user.status` | `status` | active→approved, pending→pending, rejected→rejected |
| `user.created_at` | `submittedAt` | ISO timestamp |
| `user.updated_at` | `reviewedAt` | Optional |

## Error Handling

Komponen menangani berbagai error scenarios:
1. **Network Error**: Menampilkan pesan "Tidak dapat terhubung ke server"
2. **401 Unauthorized**: Auto logout dan redirect ke login
3. **API Error**: Menampilkan error message dari server
4. **Loading State**: Menampilkan loading indicator

## Best Practices yang Diterapkan

1. ✅ **Backward Compatibility**: Props masih bisa digunakan untuk mock data
2. ✅ **Type Safety**: Semua API responses memiliki proper TypeScript types
3. ✅ **Error Handling**: Comprehensive error handling dengan user feedback
4. ✅ **Loading States**: Clear loading indicators untuk UX yang baik
5. ✅ **Separation of Concerns**: 
   - API calls di `api.ts`
   - Data mapping di `umkmMapper.ts`
   - UI logic di component
6. ✅ **Reusability**: Mapper functions dapat digunakan di komponen lain
7. ✅ **Maintainability**: Kode terstruktur dan mudah di-maintain

## Testing

### Manual Testing Steps:
1. Login sebagai admin
2. Navigate ke halaman Kelola UMKM
3. Verify data loading dari API
4. Test approve UMKM
5. Test reject UMKM
6. Test search functionality
7. Test tab switching (Menunggu, Disetujui, Ditolak)

### Test dengan Mock Data:
```tsx
// Set useMockData={true} di AdminDashboard
<AdminDashboard onLogout={handleLogout} useMockData={true} />
```

## Troubleshooting

### Issue: Data tidak muncul
**Solution**: 
- Check console untuk error messages
- Verify token tersimpan di localStorage
- Check network tab untuk API calls

### Issue: 401 Unauthorized
**Solution**:
- Login ulang untuk mendapatkan token baru
- Verify role user adalah 'admin'

### Issue: CORS Error
**Solution**:
- Pastikan backend sudah setup CORS dengan benar
- Check API base URL di `api.ts`

## Future Improvements

1. **Pagination**: Implement pagination untuk list UMKM yang banyak
2. **Real-time Updates**: WebSocket untuk real-time status updates
3. **Bulk Actions**: Approve/reject multiple UMKM sekaligus
4. **Advanced Filters**: Filter berdasarkan kategori, lokasi, dll
5. **Export Data**: Export UMKM list ke CSV/Excel
6. **Image Upload**: Support upload gambar UMKM dari admin panel

## Kontak

Jika ada pertanyaan atau issue, silakan hubungi tim development.