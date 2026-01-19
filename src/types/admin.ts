// Admin-related types

export interface UMKMAccount {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  description: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  accountStatus: 'active' | 'suspended';
  submittedAt: string;
  reviewedAt?: string;
  image: string;
}

// API Response types based on actual backend controller
export interface ApiUser {
  id: string;
  nama: string;
  email: string;
  nomor_hp: string | null;
  role: 'umkm' | 'guest' | 'admin';
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  created_at: string;
  updated_at: string | null;
  // Additional fields from getPendingUmkm response
  umkmProfile?: ApiUMKMProfile | null;
  has_profile?: boolean;
  profile_completed?: boolean;
}

export interface ApiUMKMProfile {
  id: string;
  nama_toko: string;
  deskripsi: string | null;
  alamat: string;
  lintang: number | null;
  bujur: number | null;
  kontak_wa: string | null;
  terverifikasi: boolean;
  status_toko: 'buka' | 'tutup';
  created_at: string;
  updated_at: string | null;
  user_id: string;
  // Additional field from getAllUmkmProfiles response
  user?: ApiUser;
}

// Response from getPendingUmkm - user with umkmProfile relation
export interface ApiPendingUMKMUser extends ApiUser {
  umkmProfile: ApiUMKMProfile | null;
  has_profile: boolean;
  profile_completed: boolean;
}

// Response from getAllUmkmProfiles - profile with user relation
export interface ApiUMKMProfileWithUser extends ApiUMKMProfile {
  user: ApiUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TransactionProduct {
  nama_produk: string;
  nama_umkm: string;
  umkm_name: string;
  umkm_owner: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  total_harga: number;
  metode_pembayaran: string;
  status_transaksi: 'menunggu' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';
  alamat_pengiriman: string;
  tanggal_transaksi: string;
  tanggal_diperbarui: string;
  nama_pembeli: string;
  nama_umkm: string;
  harga: number;
  status_pesanan: string;
  customer_name: string;
  customer_email: string;
  products: TransactionProduct[];
  product_name: string;
  umkm_name: string;
  umkm_owner: string;
  funds_held: boolean;
  can_release_funds: boolean;
}

// Interface for transactions with UMKM payment info (for payment management)
export interface PaymentTransaction {
  id: string;
  nama_pembeli: string;
  tanggal_transaksi: string;
  total_harga: number;
  status_transaksi: string;
  status_pembayaran: string;
  umkm_payment_info: UMKMPaymentInfo[];
}

export interface TransactionItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface DashboardStats {
  totalUMKM: number;
  pendingApprovals: number;
  activeUMKM: number;
  suspendedUMKM: number;
  totalTransactions: number;
  totalRevenue: number;
  todayTransactions: number;
  todayRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'umkm_approval' | 'umkm_rejection' | 'transaction' | 'new_umkm';
  description: string;
  timestamp: string;
}


export interface UMKMPaymentInfo {
  umkm_id: string;
  nama_toko: string;
  owner: string;
  nomor_rekening: string;
  nama_bank: string;
  total_pembayaran: number;
  status_pembayaran: 'belum_dibayarkan' | 'sudah_dibayarkan';
  tanggal_pembayaran: string | null;
  bukti_transfer_path: string | null;
  admin_pembayaran: string | null;
}

// Processed UMKM Payment data for UI display
export interface UMPayment {
  id: string;
  nama_toko: string;
  nomor_rekening: string;
  nama_bank: string;
  total_harga: number;
  total_pembayaran: number;
  status_pembayaran: 'belum_dibayarkan' | 'sudah_dibayarkan';
  status_pembayaran_umkm: 'belum_dibayarkan' | 'sudah_dibayarkan';
  tanggal_pembayaran_umkm: string | null;
  bukti_transfer_path: string | null;
  admin_pembayaran: string | null;
  transaction_id: string;
  umkm_id: string;
  owner: string;
  nama_pembeli: string;
  tanggal_transaksi: string;
}
