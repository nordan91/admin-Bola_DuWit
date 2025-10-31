# API Integration - UMKM Management

## 📋 Ringkasan Perubahan

File `UMKMManagement.tsx` telah berhasil dihubungkan dengan API backend sesuai dengan dokumentasi `API_DOCUMENTATION.md` dan `README_UMKM_WORKFLOW.md`.

## 🎯 Fitur yang Diimplementasikan

### ✅ Fetch Data UMKM
- Mengambil data pending UMKM dari endpoint `/api/admin/pending-umkm`
- Mengambil semua profil UMKM dari endpoint `/api/admin/umkm-profiles`
- Menggabungkan data untuk menampilkan status lengkap (pending, approved, rejected)

### ✅ Approve UMKM
- Endpoint: `POST /api/admin/approve-umkm/{id}`
- Update status user menjadi "active"
- Update UI secara real-time setelah approval

### ✅ Reject UMKM
- Endpoint: `POST /api/admin/reject-umkm/{id}`
- Kirim alasan penolakan ke backend
- Update UI secara real-time setelah rejection

### ✅ Data Mapping
- Konversi otomatis dari format API ke format UI
- Deteksi kategori otomatis dari deskripsi
- Generate placeholder images berdasarkan kategori
- Handle missing data dengan fallback values

## 📁 File yang Dibuat/Dimodifikasi

### File Baru:
1. **`src/utils/umkmMapper.ts`** - Utility untuk mapping data API ke UI format
2. **`INTEGRATION_GUIDE.md`** - Dokumentasi lengkap integrasi
3. **`README_API_INTEGRATION.md`** - File ini

### File yang Dimodifikasi:
1. **`src/types/admin.ts`** - Menambahkan types untuk API responses
2. **`src/services/api.ts`** - Menambahkan methods untuk UMKM management
3. **`src/components/Admin/UMKMManagement.tsx`** - Implementasi API calls
4. **`src/components/Admin/AdminDashboard.tsx`** - Support API mode

## 🚀 Cara Menggunakan

### Opsi 1: Mode API (Production)

```tsx
// Di App.tsx atau routing
import { AdminDashboard } from './components/Admin/AdminDashboard';

function App() {
  return (
    <AdminDashboard 
      onLogout={handleLogout} 
      useMockData={false}  // Gunakan API
    />
  );
}
```

### Opsi 2: Mode Mock Data (Development/Testing)

```tsx
// Untuk testing dengan data mock
<AdminDashboard 
  onLogout={handleLogout} 
  useMockData={true}  // Gunakan mock data
/>
```

### Opsi 3: Direct Component Usage

```tsx
// Langsung gunakan UMKMManagement tanpa props
// Otomatis akan fetch dari API
<UMKMManagement />
```

## 🔧 Konfigurasi

### Base URL API
Pastikan base URL sudah benar di `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://bola-duwit.my.id/api';
```

### Authentication
Komponen otomatis menggunakan token dari localStorage:
```typescript
// Token disimpan saat login
localStorage.setItem('authToken', token);

// Token digunakan di header setiap request
Authorization: Bearer {token}
```

## 📊 Alur Data

```
1. Component Mount
   ↓
2. Fetch Data dari API
   - GET /api/admin/pending-umkm
   - GET /api/admin/umkm-profiles
   ↓
3. Map Data API → UI Format
   - umkmMapper.ts
   ↓
4. Display di UI
   - Tab: Menunggu (3)
   - Tab: Disetujui (2)
   - Tab: Ditolak (1)
   ↓
5. User Action (Approve/Reject)
   ↓
6. API Call
   - POST /api/admin/approve-umkm/{id}
   - POST /api/admin/reject-umkm/{id}
   ↓
7. Update Local State
   ↓
8. Re-render UI
```

## 🎨 UI Features

### Loading State
```tsx
{loading && (
  <div>Memuat data UMKM...</div>
)}
```

### Error State
```tsx
{error && (
  <div className="error">
    Error: {error}
  </div>
)}
```

### Empty State
```tsx
{filteredAccounts.length === 0 && (
  <div>Tidak ada UMKM dengan status {activeTab}</div>
)}
```

## 🔍 Mapping Details

### Status Mapping
| API Status | UI Status |
|------------|-----------|
| `pending` | `pending` (Menunggu) |
| `active` | `approved` (Disetujui) |
| `rejected` | `rejected` (Ditolak) |

### Category Detection
Kategori otomatis terdeteksi dari deskripsi menggunakan keywords:
- **Makanan & Minuman**: makanan, makan, warung, restoran, kuliner
- **Kue & Bakery**: kue, bakery, roti, cake
- **Jasa Laundry**: laundry, cuci
- **Buah & Sayur**: buah, sayur, segar
- **Jasa Bengkel**: bengkel, motor, mobil, service
- **Kafe & Minuman**: kopi, kafe, cafe, minuman

### Placeholder Images
Setiap kategori memiliki placeholder image yang sesuai:
```typescript
const categoryImages = {
  'Makanan & Minuman': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
  'Kue & Bakery': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
  // ... dll
};
```

## ⚠️ Error Handling

### Network Errors
```typescript
try {
  await apiService.getPendingUMKM();
} catch (error) {
  setError('Tidak dapat terhubung ke server');
}
```

### Authentication Errors
```typescript
if (response.status === 401) {
  apiService.logout();
  // Redirect to login
}
```

### Validation Errors
```typescript
if (!response.ok) {
  throw new Error(errorData.message || 'Terjadi kesalahan');
}
```

## 🧪 Testing

### Test Scenario 1: Load Data
1. Login sebagai admin
2. Navigate ke "Kelola UMKM"
3. Verify data muncul dari API
4. Check console untuk API calls

### Test Scenario 2: Approve UMKM
1. Pilih UMKM dengan status "Menunggu"
2. Click "Lihat Detail"
3. Click "Setujui"
4. Verify UMKM pindah ke tab "Disetujui"

### Test Scenario 3: Reject UMKM
1. Pilih UMKM dengan status "Menunggu"
2. Click "Lihat Detail"
3. Click "Tolak"
4. Verify UMKM pindah ke tab "Ditolak"

### Test Scenario 4: Search
1. Type di search box
2. Verify filtering works
3. Test dengan nama toko, pemilik, kategori

## 🔐 Security

### Token Management
- Token disimpan di localStorage
- Token dikirim di header setiap request
- Auto logout jika token expired (401)

### Role-based Access
- Hanya admin yang bisa akses endpoints
- Backend memvalidasi role di setiap request

## 📱 Responsive Design

UI tetap menggunakan CSS yang sudah ada (`UMKMManagement.css`), sehingga:
- ✅ Tampilan tidak berubah
- ✅ Responsive design tetap berfungsi
- ✅ Styling konsisten dengan design sebelumnya

## 🐛 Known Issues & Limitations

1. **Pagination**: Belum ada pagination, semua data di-load sekaligus
2. **Real-time Updates**: Tidak ada auto-refresh, perlu manual refresh
3. **Bulk Actions**: Belum support approve/reject multiple UMKM
4. **Image Upload**: Belum ada fitur upload gambar dari admin panel

## 🚀 Future Enhancements

1. [ ] Implement pagination untuk performa lebih baik
2. [ ] Add real-time updates dengan WebSocket
3. [ ] Support bulk approve/reject
4. [ ] Add advanced filtering (by category, location, date)
5. [ ] Export data to CSV/Excel
6. [ ] Upload dan manage UMKM images
7. [ ] Add activity logs untuk audit trail

## 📞 Support

Jika mengalami masalah:
1. Check console untuk error messages
2. Verify API base URL sudah benar
3. Check token di localStorage
4. Verify backend API sudah running
5. Check network tab di DevTools

## 📚 Dokumentasi Terkait

- `API_DOCUMENTATION.md` - Dokumentasi lengkap API endpoints
- `README_UMKM_WORKFLOW.md` - Workflow UMKM registration & approval
- `INTEGRATION_GUIDE.md` - Panduan teknis integrasi
- `src/utils/umkmMapper.ts` - Source code mapping logic

---

**Status**: ✅ Completed & Ready for Production

**Last Updated**: 2024
**Version**: 1.0.0