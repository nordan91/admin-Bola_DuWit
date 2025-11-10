import { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import type { DashboardStats, RecentActivity } from '../../types/admin';
import { apiService } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import '../../styles/DashboardOverview.css';

// Interface untuk props yang diterima oleh komponen DashboardOverview
interface DashboardOverviewProps {
  stats?: DashboardStats;              // Data statistik yang akan ditampilkan (opsional)
  recentActivities: RecentActivity[]; // Daftar aktivitas terbaru
}

// Komponen untuk menampilkan ringkasan dashboard admin
// Menampilkan statistik dan aktivitas terbaru
export function DashboardOverview({ recentActivities, stats: initialStats }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats || {
    totalUMKM: 0,
    pendingApprovals: 0,
    activeUMKM: 0,
    suspendedUMKM: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    todayTransactions: 0,
    todayRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUMKMStats = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllUMKMProfiles();
        
        if (response.success && response.data) {
          const profiles = response.data;
          const totalUMKM = profiles.length;
          const pendingApprovals = profiles.filter(p => p.user.status === 'pending').length;
          const activeUMKM = profiles.filter(p => p.user.status === 'active').length;
          const suspendedUMKM = profiles.filter(p => p.user.status === 'suspended').length;
          
          setStats({
            totalUMKM,
            pendingApprovals,
            activeUMKM,
            suspendedUMKM,
            totalTransactions: 0, // You can update these with actual transaction data
            totalRevenue: 0,     // You can update these with actual revenue data
            todayTransactions: 0, // You can update these with actual today's data
            todayRevenue: 0       // You can update these with actual today's data
          });
        } else {
          throw new Error(response.message || 'Gagal memuat statistik UMKM');
        }
      } catch (err) {
        console.error('Error fetching UMKM stats:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat statistik');
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      {/* Grid untuk menampilkan statistik utama */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total UMKM"
          value={stats.totalUMKM}
          icon={<span style={{ fontSize: '24px' }}>🏪</span>}
          color="primary"
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={stats.pendingApprovals}
          icon={<span style={{ fontSize: '24px' }}>⏳</span>}
          color="warning"
        />
        <StatCard
          title="UMKM Aktif"
          value={stats.activeUMKM}
          icon={<span style={{ fontSize: '24px' }}>✅</span>}
          color="success"
        />
        <StatCard
          title="UMKM Ditangguhkan"
          value={stats.suspendedUMKM}
          icon={<span style={{ fontSize: '24px' }}>⛔</span>}
          color="warning"
        />
      </div>
    </div>
  );
}