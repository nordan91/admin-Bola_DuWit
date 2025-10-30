import type { UMKMAccount, Transaction, DashboardStats, RecentActivity } from '../types/admin';

export const mockUMKMAccounts: UMKMAccount[] = [
  {
    id: 'umkm-001',
    name: 'Warung Makan Bu Siti',
    owner: 'Siti Nurhaliza',
    email: 'siti@warungbusiti.com',
    phone: '+62 812-3456-7890',
    location: 'Jl. Raya Duren Sawit No. 123, Jakarta Timur',
    category: 'Makanan & Minuman',
    description: 'Warung makan tradisional dengan menu nusantara yang lezat dan harga terjangkau',
    documents: ['KTP', 'NPWP', 'Surat Izin Usaha'],
    status: 'pending' as const,
    submittedAt: '2024-01-15T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
  },
  {
    id: 'umkm-002',
    name: 'Toko Kue Manis',
    owner: 'Ahmad Bakri',
    email: 'ahmad@kueemanis.com',
    phone: '+62 813-9876-5432',
    location: 'Jl. Matraman Raya No. 45, Jakarta Timur',
    category: 'Kue & Bakery',
    description: 'Toko kue dengan berbagai macam kue tradisional dan modern',
    documents: ['KTP', 'NPWP', 'Sertifikat Halal'],
    status: 'pending' as const,
    submittedAt: '2024-01-16T14:20:00Z',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
  },
  {
    id: 'umkm-003',
    name: 'Laundry Express',
    owner: 'Dewi Lestari',
    email: 'dewi@laundryexpress.com',
    phone: '+62 821-5555-6666',
    location: 'Jl. Pondok Kelapa No. 78, Jakarta Timur',
    category: 'Jasa Laundry',
    description: 'Layanan laundry cepat dan bersih dengan harga kompetitif',
    documents: ['KTP', 'NPWP'],
    status: 'pending' as const,
    submittedAt: '2024-01-17T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400'
  },
  {
    id: 'umkm-004',
    name: 'Toko Buah Segar',
    owner: 'Budi Santoso',
    email: 'budi@buahsegar.com',
    phone: '+62 822-7777-8888',
    location: 'Jl. Cipinang Besar No. 12, Jakarta Timur',
    category: 'Buah & Sayur',
    description: 'Menjual buah-buahan segar langsung dari petani',
    documents: ['KTP', 'NPWP', 'Surat Izin Usaha'],
    status: 'approved' as const,
    submittedAt: '2024-01-10T08:00:00Z',
    reviewedAt: '2024-01-11T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'
  },
  {
    id: 'umkm-005',
    name: 'Bengkel Motor Jaya',
    owner: 'Joko Widodo',
    email: 'joko@bengkeljaya.com',
    phone: '+62 823-4444-3333',
    location: 'Jl. Raya Bekasi No. 234, Jakarta Timur',
    category: 'Jasa Bengkel',
    description: 'Bengkel motor dengan mekanik berpengalaman',
    documents: ['KTP', 'NPWP'],
    status: 'approved' as const,
    submittedAt: '2024-01-08T11:00:00Z',
    reviewedAt: '2024-01-09T15:00:00Z',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
  },
  {
    id: 'umkm-006',
    name: 'Warung Kopi Nikmat',
    owner: 'Rina Susanti',
    email: 'rina@kopinikmat.com',
    phone: '+62 824-1111-2222',
    location: 'Jl. Kalimalang No. 56, Jakarta Timur',
    category: 'Kafe & Minuman',
    description: 'Warung kopi dengan suasana nyaman dan kopi berkualitas',
    documents: ['KTP'],
    status: 'rejected' as const,
    submittedAt: '2024-01-12T13:30:00Z',
    reviewedAt: '2024-01-13T16:00:00Z',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TRX-2024-001',
    date: '2024-01-18T10:30:00Z',
    umkmName: 'Toko Buah Segar',
    umkmId: 'umkm-004',
    customerName: 'Andi Wijaya',
    customerId: 'cust-001',
    amount: 125000,
    status: 'completed' as const,
    paymentMethod: 'E-Wallet',
    items: [
      { productName: 'Apel Fuji', quantity: 2, price: 50000 },
      { productName: 'Jeruk Mandarin', quantity: 3, price: 75000 }
    ]
  },
  {
    id: 'TRX-2024-002',
    date: '2024-01-18T11:15:00Z',
    umkmName: 'Warung Makan Bu Siti',
    umkmId: 'umkm-001',
    customerName: 'Sari Indah',
    customerId: 'cust-002',
    amount: 85000,
    status: 'completed' as const,
    paymentMethod: 'Cash',
    items: [
      { productName: 'Nasi Goreng Spesial', quantity: 2, price: 35000 },
      { productName: 'Es Teh Manis', quantity: 2, price: 15000 }
    ]
  },
  {
    id: 'TRX-2024-003',
    date: '2024-01-18T12:00:00Z',
    umkmName: 'Toko Kue Manis',
    umkmId: 'umkm-002',
    customerName: 'Bambang Sutrisno',
    customerId: 'cust-003',
    amount: 150000,
    status: 'pending' as const,
    paymentMethod: 'Transfer Bank',
    items: [
      { productName: 'Kue Lapis', quantity: 1, price: 75000 },
      { productName: 'Brownies', quantity: 1, price: 75000 }
    ]
  },
  {
    id: 'TRX-2024-004',
    date: '2024-01-18T13:30:00Z',
    umkmName: 'Laundry Express',
    umkmId: 'umkm-003',
    customerName: 'Fitri Handayani',
    customerId: 'cust-004',
    amount: 45000,
    status: 'completed' as const,
    paymentMethod: 'E-Wallet',
    items: [
      { productName: 'Cuci + Setrika (5kg)', quantity: 1, price: 45000 }
    ]
  },
  {
    id: 'TRX-2024-005',
    date: '2024-01-18T14:45:00Z',
    umkmName: 'Bengkel Motor Jaya',
    umkmId: 'umkm-005',
    customerName: 'Rudi Hartono',
    customerId: 'cust-005',
    amount: 250000,
    status: 'completed' as const,
    paymentMethod: 'Cash',
    items: [
      { productName: 'Ganti Oli + Filter', quantity: 1, price: 150000 },
      { productName: 'Tune Up', quantity: 1, price: 100000 }
    ]
  },
  {
    id: 'TRX-2024-006',
    date: '2024-01-17T16:20:00Z',
    umkmName: 'Toko Buah Segar',
    umkmId: 'umkm-004',
    customerName: 'Linda Permata',
    customerId: 'cust-006',
    amount: 95000,
    status: 'cancelled' as const,
    paymentMethod: 'E-Wallet',
    items: [
      { productName: 'Mangga Harum Manis', quantity: 2, price: 95000 }
    ]
  },
  {
    id: 'TRX-2024-007',
    date: '2024-01-17T09:30:00Z',
    umkmName: 'Warung Makan Bu Siti',
    umkmId: 'umkm-001',
    customerName: 'Agus Salim',
    customerId: 'cust-007',
    amount: 120000,
    status: 'completed' as const,
    paymentMethod: 'Cash',
    items: [
      { productName: 'Paket Nasi Uduk', quantity: 3, price: 40000 }
    ]
  },
  {
    id: 'TRX-2024-008',
    date: '2024-01-17T11:00:00Z',
    umkmName: 'Toko Kue Manis',
    umkmId: 'umkm-002',
    customerName: 'Maya Sari',
    customerId: 'cust-008',
    amount: 200000,
    status: 'completed' as const,
    paymentMethod: 'Transfer Bank',
    items: [
      { productName: 'Kue Ulang Tahun Custom', quantity: 1, price: 200000 }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  totalUMKM: 5,
  pendingApprovals: 3,
  totalTransactions: 8,
  totalRevenue: 1070000,
  todayTransactions: 5,
  todayRevenue: 655000
};

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'act-001',
    type: 'transaction' as const,
    description: 'Transaksi baru dari Rudi Hartono di Bengkel Motor Jaya - Rp 250.000',
    timestamp: '2024-01-18T14:45:00Z'
  },
  {
    id: 'act-002',
    type: 'transaction' as const,
    description: 'Transaksi baru dari Fitri Handayani di Laundry Express - Rp 45.000',
    timestamp: '2024-01-18T13:30:00Z'
  },
  {
    id: 'act-003',
    type: 'new_umkm' as const,
    description: 'Pendaftaran UMKM baru: Laundry Express',
    timestamp: '2024-01-17T09:15:00Z'
  },
  {
    id: 'act-004',
    type: 'new_umkm' as const,
    description: 'Pendaftaran UMKM baru: Toko Kue Manis',
    timestamp: '2024-01-16T14:20:00Z'
  },
  {
    id: 'act-005',
    type: 'new_umkm' as const,
    description: 'Pendaftaran UMKM baru: Warung Makan Bu Siti',
    timestamp: '2024-01-15T10:30:00Z'
  }
];