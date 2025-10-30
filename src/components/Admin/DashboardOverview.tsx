import { StatCard } from './StatCard';
import type { DashboardStats, RecentActivity } from '../../types/admin';
import './DashboardOverview.css';

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

export function DashboardOverview({ stats, recentActivities }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return '💳';
      case 'umkm_approval':
        return '✅';
      case 'umkm_rejection':
        return '❌';
      case 'new_umkm':
        return '🏪';
      default:
        return '📋';
    }
  };

  return (
    <div className="dashboard-overview">
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
          title="Total Transaksi"
          value={stats.totalTransactions}
          icon={<span style={{ fontSize: '24px' }}>💳</span>}
          color="info"
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(stats.totalRevenue)}
          icon={<span style={{ fontSize: '24px' }}>💰</span>}
          color="success"
        />
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Statistik Hari Ini</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="today-stats">
              <div className="today-stat-item">
                <div className="today-stat-label">Transaksi Hari Ini</div>
                <div className="today-stat-value">{stats.todayTransactions}</div>
              </div>
              <div className="today-stat-item">
                <div className="today-stat-label">Pendapatan Hari Ini</div>
                <div className="today-stat-value">{formatCurrency(stats.todayRevenue)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Aktivitas Terbaru</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-time">{formatDate(activity.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}