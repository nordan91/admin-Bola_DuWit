import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './DashboardOverview';
import { UMKMManagement } from './UMKMManagement';
import { UMKMAccountManagement } from './UMKMAccountManagement';
import { TransactionManagement } from './TransactionManagement';
import { mockUMKMAccounts, mockTransactions, mockDashboardStats, mockRecentActivities } from '../../mockData/adminData';
import type { UMKMAccount } from '../../types/admin';
import { NotFoundPage } from '../../pages/NotFoundPage';
import '../../styles/AdminDashboard.css';

// Interface untuk props yang diterima oleh komponen AdminDashboard
interface AdminDashboardProps {
  onLogout: () => void;       // Fungsi yang dipanggil saat user logout
  useMockData?: boolean;      // Flag untuk menentukan apakah menggunakan data mock atau API
}

// Komponen utama untuk dashboard admin
// Menangani routing dan state management untuk halaman admin
export function AdminDashboard({ onLogout, useMockData = false }: AdminDashboardProps) {
  // State untuk menyimpan daftar akun UMKM
  const [umkmAccounts, setUmkmAccounts] = useState<UMKMAccount[]>(mockUMKMAccounts);

  // Fungsi untuk menangani persetujuan akun UMKM
  const handleApproveUMKM = (id: string) => {
    setUmkmAccounts(accounts =>
      accounts.map(account =>
        account.id === id
          ? { ...account, status: 'approved' as const, reviewedAt: new Date().toISOString() }
          : account
      )
    );
  };

  // Fungsi untuk menangani penolakan akun UMKM
  const handleRejectUMKM = (id: string) => {
    setUmkmAccounts(accounts =>
      accounts.map(account =>
        account.id === id
          ? { ...account, status: 'rejected' as const, reviewedAt: new Date().toISOString() }
          : account
      )
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Komponen sidebar untuk navigasi */}
      <AdminSidebar />
      <div className="admin-main">
        {/* Komponen header dengan tombol logout */}
        <AdminHeader onLogout={onLogout} />
        {/* Area konten utama */}
        <main className="admin-content">
          {/* Konfigurasi routing untuk halaman admin */}
          <Routes>
            {/* Redirect dari root ke dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            {/* Halaman dashboard overview dengan statistik dan aktivitas terbaru */}
            <Route path="/dashboard" element={<DashboardOverview stats={mockDashboardStats} recentActivities={mockRecentActivities} />} />
            {/* Halaman manajemen UMKM dengan conditional rendering untuk mock data */}
            <Route path="/umkm" element={
              useMockData ? (
                <UMKMManagement
                  accounts={umkmAccounts}
                  onApprove={handleApproveUMKM}
                  onReject={handleRejectUMKM}
                />
              ) : (
                <UMKMManagement />
              )
            } />
            {/* Halaman manajemen akun UMKM */}
            <Route path="/umkm-accounts" element={<UMKMAccountManagement />} />
            {/* Halaman manajemen transaksi */}
            <Route path="/transactions" element={<TransactionManagement transactions={mockTransactions} />} />
            {/* Halaman 404 untuk route yang tidak ditemukan */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}