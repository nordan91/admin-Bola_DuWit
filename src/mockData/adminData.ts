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
    date: '2024-01-20T15:30:00Z',
    umkmName: 'Warung Makmur',
    umkmId: '1',
    customerName: 'Budi Santoso',
    customerId: 'cust-001',
    amount: 75000,
    status: 'completed',
    paymentMethod: 'Transfer Bank',
    items: [
      {
        productName: 'Ayam Goreng',
        quantity: 2,
        price: 25000
      },
      {
        productName: 'Nasi Uduk',
        quantity: 2,
        price: 12500
      }
    ]
  },
  {
    id: 'txn-002',
    date: '2024-01-19T12:15:00Z',
    umkmName: 'Toko Elektronik Jaya',
    umkmId: '2',
    customerName: 'Ani Wijaya',
    customerId: 'cust-002',
    amount: 1250000,
    status: 'pending',
    paymentMethod: 'E-Wallet',
    items: [
      {
        productName: 'Smartphone Samsung',
        quantity: 1,
        price: 1250000
      }
    ]
  },
  {
    id: 'txn-003',
    date: '2024-01-21T14:20:00Z',
    umkmName: 'Butik Fashion Cantik',
    umkmId: '3',
    customerName: 'Dewi Lestari',
    customerId: 'cust-004',
    amount: 350000,
    status: 'processing',
    paymentMethod: 'Kartu Kredit',
    items: [
      {
        productName: 'Dress Floral',
        quantity: 1,
        price: 350000
      }
    ]
  },
  {
    id: 'txn-004',
    date: '2024-01-22T10:15:00Z',
    umkmName: 'Warung Makmur',
    umkmId: '1',
    customerName: 'Rudi Hartono',
    customerId: 'cust-005',
    amount: 120000,
    status: 'shipped',
    paymentMethod: 'Transfer Bank',
    items: [
      {
        productName: 'Paket Nasi Kotak',
        quantity: 5,
        price: 24000
      }
    ]
  },
  {
    id: 'txn-005',
    date: '2024-01-18T09:45:00Z',
    umkmName: 'Warung Makmur',
    umkmId: '1',
    customerName: 'Dedi Kurniawan',
    customerId: 'cust-003',
    amount: 50000,
    status: 'completed',
    paymentMethod: 'Cash',
    items: [
      {
        productName: 'Nasi Uduk Special',
        quantity: 2,
        price: 25000
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