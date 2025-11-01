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
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
  useMockData?: boolean; // Flag to use mock data or API
}

export function AdminDashboard({ onLogout, useMockData = false }: AdminDashboardProps) {
  const [umkmAccounts, setUmkmAccounts] = useState<UMKMAccount[]>(mockUMKMAccounts);

  const handleApproveUMKM = (id: string) => {
    setUmkmAccounts(accounts =>
      accounts.map(account =>
        account.id === id
          ? { ...account, status: 'approved' as const, reviewedAt: new Date().toISOString() }
          : account
      )
    );
  };

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
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader onLogout={onLogout} />
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardOverview stats={mockDashboardStats} recentActivities={mockRecentActivities} />} />
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
            <Route path="/umkm-accounts" element={<UMKMAccountManagement />} />
            <Route path="/transactions" element={<TransactionManagement transactions={mockTransactions} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}