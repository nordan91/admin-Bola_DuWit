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

export interface Transaction {
  id: string;
  date: string;
  umkmName: string;
  umkmId: string;
  customerName: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  items: TransactionItem[];
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