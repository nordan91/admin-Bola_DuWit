import { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { StatCard } from './StatCard';
import type { DashboardStats, RecentActivity, Transaction } from '../../types/admin';
import { apiService } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import '../../styles/DashboardOverview.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
});

const buildDailySalesSeries = (transactions: Transaction[]) => {
  const bucket: Record<string, number> = {};
  transactions.forEach(transaction => {
    if (!transaction.tanggal_transaksi) return;
    const date = new Date(transaction.tanggal_transaksi);
    if (Number.isNaN(date.getTime())) return;
    const isoKey = date.toISOString().split('T')[0];
    bucket[isoKey] = (bucket[isoKey] || 0) + (Number(transaction.total_harga) || 0);
  });

  const sortedKeys = Object.keys(bucket).sort();
  const recentKeys = sortedKeys.slice(-10);

  return {
    labels: recentKeys.map(key =>
      new Date(key).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
    ),
    totals: recentKeys.map(key => bucket[key])
  };
};

const buildMonthlySalesSeries = (transactions: Transaction[]) => {
  const bucket = new Map<string, { label: string; value: number }>();

  transactions.forEach(transaction => {
    if (!transaction.tanggal_transaksi) return;
    const date = new Date(transaction.tanggal_transaksi);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const previous = bucket.get(key)?.value || 0;

    bucket.set(key, {
      label: date.toLocaleDateString('id-ID', { month: 'long' }),
      value: previous + (Number(transaction.total_harga) || 0)
    });
  });

  const sorted = Array.from(bucket.entries()).sort((a, b) => {
    const [aYear, aMonth] = a[0].split('-').map(Number);
    const [bYear, bMonth] = b[0].split('-').map(Number);
    return new Date(aYear, aMonth, 1).getTime() - new Date(bYear, bMonth, 1).getTime();
  });

  const recent = sorted.slice(-6);

  return {
    labels: recent.map(([, data]) => data.label),
    totals: recent.map(([, data]) => data.value)
  };
};

// Interface untuk props yang diterima oleh komponen DashboardOverview
interface DashboardOverviewProps {
  stats?: DashboardStats;              // Data statistik yang akan ditampilkan (opsional)
  recentActivities: RecentActivity[]; // Daftar aktivitas terbaru
}

// Komponen untuk menampilkan ringkasan dashboard admin
// Menampilkan statistik dan aktivitas terbaru
export function DashboardOverview({ stats: initialStats }: DashboardOverviewProps) {
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
  const [salesTrend, setSalesTrend] = useState<{ labels: string[]; totals: number[] }>({
    labels: [],
    totals: []
  });
  const [monthlySales, setMonthlySales] = useState<{ labels: string[]; totals: number[] }>({
    labels: [],
    totals: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileResponse, transactions] = await Promise.all([
          apiService.getAllUMKMProfiles(),
          apiService.getTransactions()
        ]);

        if (!profileResponse.success || !profileResponse.data) {
          throw new Error(profileResponse.message || 'Gagal memuat statistik UMKM');
        }

        const profiles = profileResponse.data;
        const totalUMKM = profiles.length;
        const pendingApprovals = profiles.filter(p => p.user.status === 'pending').length;
        const activeUMKM = profiles.filter(p => p.user.status === 'active').length;
        const suspendedUMKM = profiles.filter(p => p.user.status === 'suspended').length;

        const completedTransactions = transactions.filter(transaction => {
          const status = transaction.status_transaksi?.toLowerCase();
          return status === 'selesai' || status === 'completed';
        });

        const totalRevenue = completedTransactions.reduce(
          (sum, transaction) => sum + (Number(transaction.total_harga) || 0),
          0
        );

        const todayIso = new Date().toISOString().split('T')[0];
        const todayTransactions = completedTransactions.filter(transaction =>
          transaction.tanggal_transaksi?.startsWith(todayIso)
        );
        const todayRevenue = todayTransactions.reduce(
          (sum, transaction) => sum + (Number(transaction.total_harga) || 0),
          0
        );

        setStats({
          totalUMKM,
          pendingApprovals,
          activeUMKM,
          suspendedUMKM,
          totalTransactions: transactions.length,
          totalRevenue,
          todayTransactions: todayTransactions.length,
          todayRevenue
        });

        setSalesTrend(buildDailySalesSeries(completedTransactions));
        setMonthlySales(buildMonthlySalesSeries(completedTransactions));
      } catch (err) {
        console.error('Error fetching UMKM stats:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat statistik');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const lineChartData = useMemo(() => ({
    labels: salesTrend.labels,
    datasets: [
      {
        label: 'Pendapatan Harian',
        data: salesTrend.totals,
        fill: true,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#15803d'
      }
    ]
  }), [salesTrend]);

  const barChartData = useMemo(() => ({
    labels: monthlySales.labels,
    datasets: [
      {
        label: 'Total Penjualan Bulanan',
        data: monthlySales.totals,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        barThickness: 32,
        borderSkipped: false
      }
    ]
  }), [monthlySales]);

  const lineChartOptions = useMemo<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${currencyFormatter.format(Number(context.raw) || 0)}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: value => currencyFormatter.format(Number(value))
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' }
      },
      x: {
        grid: { display: false }
      }
    }
  }), []);

  const barChartOptions = useMemo<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${currencyFormatter.format(Number(context.raw) || 0)}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: value => currencyFormatter.format(Number(value))
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' }
      },
      x: {
        grid: { display: false }
      }
    }
  }), []);

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

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Tren Penjualan Selesai (10 Hari Terakhir)</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="chart-wrapper" role="img" aria-label="Diagram area penjualan harian">
              {salesTrend.labels.length ? (
                <Line data={lineChartData} options={lineChartOptions} />
              ) : (
                <p className="chart-empty-state">Belum ada penjualan berstatus selesai.</p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Ringkasan Penjualan Bulanan</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="chart-wrapper" role="img" aria-label="Diagram batang penjualan bulanan">
              {monthlySales.labels.length ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <p className="chart-empty-state">Data penjualan bulanan belum tersedia.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}