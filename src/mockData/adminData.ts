import type { UMKMAccount, Transaction, DashboardStats, RecentActivity } from '../types/admin';

// Mock data untuk akun UMKM
export const mockUMKMAccounts: UMKMAccount[] = [
  {
    id: '1',
    name: 'Warung Makmur',
    owner: 'Ahmad Surya',
    email: 'ahmad@example.com',
    phone: '+6281234567890',
    location: 'Jakarta Selatan',
    category: 'Makanan',
    description: 'Warung makan tradisional dengan menu ayam goreng dan nasi uduk',
    documents: ['KTP', 'Surat Izin Usaha', 'Foto Toko'],
    status: 'pending',
    accountStatus: 'active',
    submittedAt: '2024-01-15T10:30:00Z',
    reviewedAt: undefined,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Toko Elektronik Jaya',
    owner: 'Siti Nurhaliza',
    email: 'siti@example.com',
    phone: '+6289876543210',
    location: 'Bandung',
    category: 'Elektronik',
    description: 'Toko elektronik dengan berbagai macam gadget dan aksesoris',
    documents: ['KTP', 'NPWP', 'Surat Izin Usaha'],
    status: 'approved',
    accountStatus: 'active',
    submittedAt: '2024-01-10T14:20:00Z',
    reviewedAt: '2024-01-12T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Butik Fashion Cantik',
    owner: 'Maya Sari',
    email: 'maya@example.com',
    phone: '+6285678901234',
    location: 'Surabaya',
    category: 'Fashion',
    description: 'Butik fashion dengan koleksi pakaian wanita modern',
    documents: ['KTP', 'Surat Izin Usaha'],
    status: 'rejected',
    accountStatus: 'active',
    submittedAt: '2024-01-08T16:45:00Z',
    reviewedAt: '2024-01-11T11:30:00Z',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  }
];

// Mock data untuk transaksi
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    tanggal_transaksi: '2024-01-20T15:30:00Z',
    tanggal_diperbarui: '2024-01-20T15:30:00Z',
    nama_umkm: 'Warung Makmur',
    umkm_name: 'Warung Makmur',
    umkm_owner: 'Pemilik Warung',
    nama_pembeli: 'Budi Santoso',
    customer_name: 'Budi Santoso',
    customer_email: 'budi@example.com',
    total_harga: 75000,
    harga: 75000,
    metode_pembayaran: 'Transfer Bank',
    status_transaksi: 'selesai',
    status_pesanan: 'completed',
    alamat_pengiriman: 'Alamat Pengiriman',
    funds_held: false,
    can_release_funds: true,
    product_name: 'Ayam Goreng',
    products: [
      {
        nama_produk: 'Ayam Goreng',
        nama_umkm: 'Warung Makmur',
        umkm_name: 'Warung Makmur',
        umkm_owner: 'Pemilik Warung',
        jumlah: 2,
        harga_satuan: 25000,
        subtotal: 50000
      },
      {
        nama_produk: 'Nasi Uduk',
        nama_umkm: 'Warung Makmur',
        umkm_name: 'Warung Makmur',
        umkm_owner: 'Pemilik Warung',
        jumlah: 2,
        harga_satuan: 12500,
        subtotal: 25000
      }
    ]
  },
  {
    id: 'txn-002',
    tanggal_transaksi: '2024-01-19T12:15:00Z',
    tanggal_diperbarui: '2024-01-19T12:15:00Z',
    nama_umkm: 'Toko Elektronik Jaya',
    umkm_name: 'Toko Elektronik Jaya',
    umkm_owner: 'Pemilik Toko',
    nama_pembeli: 'Ani Wijaya',
    customer_name: 'Ani Wijaya',
    customer_email: 'ani@example.com',
    total_harga: 1250000,
    harga: 1250000,
    metode_pembayaran: 'E-Wallet',
    status_transaksi: 'menunggu',
    status_pesanan: 'pending',
    alamat_pengiriman: 'Alamat Pengiriman',
    funds_held: true,
    can_release_funds: false,
    product_name: 'Smartphone Samsung',
    products: [
      {
        nama_produk: 'Smartphone Samsung',
        nama_umkm: 'Toko Elektronik Jaya',
        umkm_name: 'Toko Elektronik Jaya',
        umkm_owner: 'Pemilik Toko',
        jumlah: 1,
        harga_satuan: 1250000,
        subtotal: 1250000
      }
    ]
  },
  {
    id: 'txn-003',
    tanggal_transaksi: '2024-01-21T14:20:00Z',
    tanggal_diperbarui: '2024-01-21T14:20:00Z',
    nama_umkm: 'Butik Fashion Cantik',
    umkm_name: 'Butik Fashion Cantik',
    umkm_owner: 'Pemilik Butik',
    nama_pembeli: 'Dewi Lestari',
    customer_name: 'Dewi Lestari',
    customer_email: 'dewi@example.com',
    total_harga: 350000,
    harga: 350000,
    metode_pembayaran: 'Kartu Kredit',
    status_transaksi: 'diproses',
    status_pesanan: 'processing',
    alamat_pengiriman: 'Alamat Pengiriman',
    funds_held: true,
    can_release_funds: false,
    product_name: 'Dress Floral',
    products: [
      {
        nama_produk: 'Dress Floral',
        nama_umkm: 'Butik Fashion Cantik',
        umkm_name: 'Butik Fashion Cantik',
        umkm_owner: 'Pemilik Butik',
        jumlah: 1,
        harga_satuan: 350000,
        subtotal: 350000
      }
    ]
  },
  {
    id: 'txn-004',
    tanggal_transaksi: '2024-01-22T10:15:00Z',
    tanggal_diperbarui: '2024-01-22T10:15:00Z',
    nama_umkm: 'Warung Makmur',
    umkm_name: 'Warung Makmur',
    umkm_owner: 'Pemilik Warung',
    nama_pembeli: 'Rudi Hartono',
    customer_name: 'Rudi Hartono',
    customer_email: 'rudi@example.com',
    total_harga: 120000,
    harga: 120000,
    metode_pembayaran: 'Transfer Bank',
    status_transaksi: 'dikirim',
    status_pesanan: 'shipped',
    alamat_pengiriman: 'Alamat Pengiriman',
    funds_held: true,
    can_release_funds: false,
    product_name: 'Paket Nasi Kotak',
    products: [
      {
        nama_produk: 'Paket Nasi Kotak',
        nama_umkm: 'Warung Makmur',
        umkm_name: 'Warung Makmur',
        umkm_owner: 'Pemilik Warung',
        jumlah: 5,
        harga_satuan: 24000,
        subtotal: 120000
      }
    ]
  },
  {
    id: 'txn-005',
    tanggal_transaksi: '2024-01-18T09:45:00Z',
    tanggal_diperbarui: '2024-01-18T09:45:00Z',
    nama_umkm: 'Warung Makmur',
    umkm_name: 'Warung Makmur',
    umkm_owner: 'Pemilik Warung',
    nama_pembeli: 'Dedi Kurniawan',
    customer_name: 'Dedi Kurniawan',
    customer_email: 'dedi@example.com',
    total_harga: 50000,
    harga: 50000,
    metode_pembayaran: 'Cash',
    status_transaksi: 'selesai',
    status_pesanan: 'completed',
    alamat_pengiriman: 'Alamat Pengiriman',
    funds_held: false,
    can_release_funds: true,
    product_name: 'Nasi Uduk Special',
    products: [
      {
        nama_produk: 'Nasi Uduk Special',
        nama_umkm: 'Warung Makmur',
        umkm_name: 'Warung Makmur',
        umkm_owner: 'Pemilik Warung',
        jumlah: 2,
        harga_satuan: 25000,
        subtotal: 50000
      }
    ]
  }
];

// Mock data untuk statistik dashboard
export const mockDashboardStats: DashboardStats = {
  totalUMKM: 45,
  pendingApprovals: 8,
  activeUMKM: 35,
  suspendedUMKM: 2,
  totalTransactions: 1250,
  totalRevenue: 87500000,
  todayTransactions: 23,
  todayRevenue: 1850000
};

// Mock data untuk aktivitas terbaru
export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'act-001',
    type: 'umkm_approval',
    description: 'UMKM "Warung Makmur" telah disetujui',
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: 'act-002',
    type: 'transaction',
    description: 'Transaksi baru dari Toko Elektronik Jaya - Rp 1.250.000',
    timestamp: '2024-01-20T09:15:00Z'
  },
  {
    id: 'act-003',
    type: 'new_umkm',
    description: 'UMKM baru "Kafe Nusantara" mendaftar',
    timestamp: '2024-01-19T16:45:00Z'
  },
  {
    id: 'act-004',
    type: 'umkm_rejection',
    description: 'UMKM "Butik Fashion Cantik" ditolak',
    timestamp: '2024-01-19T14:20:00Z'
  },
  {
    id: 'act-005',
    type: 'transaction',
    description: 'Transaksi baru dari Warung Makmur - Rp 75.000',
    timestamp: '2024-01-19T12:30:00Z'
  }
];