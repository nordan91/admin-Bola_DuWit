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
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  image: string;
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