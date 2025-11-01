import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import type { UMKMAccount } from '../../types/admin';
import { apiService } from '../../services/api';
import { mapApiArrayToUMKMAccounts } from '../../utils/umkmMapper';
import './UMKMAccountManagement.css';

interface UMKMAccountManagementProps {
  accounts?: UMKMAccount[];
}

export function UMKMAccountManagement({
  accounts: propAccounts
}: UMKMAccountManagementProps) {
  const [accounts, setAccounts] = useState<UMKMAccount[]>(propAccounts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [isUsingApi] = useState(!propAccounts);

  // Fetch UMKM accounts from API
  useEffect(() => {
    if (!isUsingApi) {
      if (propAccounts) {
        setAccounts(propAccounts);
      }
      return;
    }

    const fetchUMKMData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all UMKM profiles data
        const response = await apiService.getAllUMKMProfiles();

        if (response.success && response.data) {
          // Map the API response to UMKMAccount format with error handling
          try {
            const allAccounts: UMKMAccount[] = mapApiArrayToUMKMAccounts(response.data);

            // Filter only approved accounts
            const approvedAccounts = allAccounts.filter(account => account.status === 'approved');

            setAccounts(approvedAccounts);
          } catch (mapError) {
            console.error('Error mapping UMKM accounts:', mapError);
            setError('Gagal memproses data UMKM');
          }
        } else {
          throw new Error(response.message || 'Gagal memuat data UMKM');
        }
      } catch (err) {
        console.error('Error fetching UMKM data:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data UMKM');
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMData();
  }, [isUsingApi, propAccounts]);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSuspend = async (account: UMKMAccount) => {
    if (!confirm(`Apakah Anda yakin ingin menangguhkan akun UMKM "${account.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiService.suspendUMKM(account.id);

      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(acc =>
          acc.id === account.id
            ? { ...acc, accountStatus: 'suspended' as const }
            : acc
        )
      );
    } catch (err) {
      console.error('Error suspending UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal menangguhkan UMKM');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (account: UMKMAccount) => {
    if (!confirm(`Apakah Anda yakin ingin mengaktifkan kembali akun UMKM "${account.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiService.activateUMKM(account.id);

      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(acc =>
          acc.id === account.id
            ? { ...acc, accountStatus: 'active' as const }
            : acc
        )
      );
    } catch (err) {
      console.error('Error activating UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengaktifkan UMKM');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeCount = accounts.filter(a => a.accountStatus === 'active').length;
  const suspendedCount = accounts.filter(a => a.accountStatus === 'suspended').length;

  return (
    <div className="umkm-account-management">
      <div className="umkm-account-header">
        <h2 className="umkm-account-title">Kelola Akun UMKM</h2>
      </div>

      <div className="umkm-account-stats">
        <div className="umkm-account-stat-card">
          <div className="umkm-account-stat-label">Total UMKM</div>
          <div className="umkm-account-stat-value">{accounts.length}</div>
        </div>
        <div className="umkm-account-stat-card">
          <div className="umkm-account-stat-label">Aktif</div>
          <div className="umkm-account-stat-value">{activeCount}</div>
        </div>
        <div className="umkm-account-stat-card">
          <div className="umkm-account-stat-label">Ditangguhkan</div>
          <div className="umkm-account-stat-value">{suspendedCount}</div>
        </div>
      </div>

      {error && (
        <div className="umkm-account-error" style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '0.5rem',
          border: '1px solid #fcc'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="umkm-account-filters">
        <div className="umkm-account-search">
          <input
            type="text"
            placeholder="Cari UMKM..."
            className="umkm-account-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="umkm-account-status-filters">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Semua
          </button>
          <button
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Aktif
          </button>
          <button
            className={`filter-btn ${statusFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setStatusFilter('suspended')}
          >
            Ditangguhkan
          </button>
        </div>
      </div>

      <div className="umkm-account-table-container">
        <div className="umkm-account-mobile-list">
          {loading ? (
            <div className="umkm-account-loading">
              Memuat data UMKM...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="umkm-account-empty">
              Tidak ada UMKM ditemukan
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div key={account.id} className="umkm-account-mobile-card">
                <div className="umkm-account-mobile-header">
                  <span className="umkm-account-id">{account.id}</span>
                  <div className="umkm-account-status-badges">
                    <StatusBadge status={account.status} size="sm" />
                    <span className={`account-status-badge ${account.accountStatus}`}>
                      {account.accountStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}
                    </span>
                  </div>
                </div>
                <div className="umkm-account-mobile-body">
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Nama UMKM:</span>
                    <span>{account.name}</span>
                  </div>
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Pemilik:</span>
                    <span>{account.owner}</span>
                  </div>
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Email:</span>
                    <span>{account.email}</span>
                  </div>
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Kategori:</span>
                    <span>{account.category}</span>
                  </div>
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Lokasi:</span>
                    <span>{account.location}</span>
                  </div>
                  <div className="umkm-account-mobile-row">
                    <span className="umkm-account-mobile-label">Dibuat:</span>
                    <span>{formatDate(account.submittedAt)}</span>
                  </div>
                </div>
                <div className="umkm-account-mobile-actions">
                  {account.accountStatus === 'active' ? (
                    <button
                      className="umkm-account-action-btn suspend"
                      onClick={() => handleSuspend(account)}
                      disabled={loading}
                    >
                      <XIcon width={16} height={16} />
                      Tangguhkan
                    </button>
                  ) : (
                    <button
                      className="umkm-account-action-btn activate"
                      onClick={() => handleActivate(account)}
                      disabled={loading}
                    >
                      <CheckIcon width={16} height={16} />
                      Aktifkan
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <table className="umkm-account-table">
          <thead>
            <tr>
              <th>Nama UMKM</th>
              <th>Pemilik</th>
              <th>Email</th>
              <th>Kategori</th>
              <th>Lokasi</th>
              <th>Status Akun</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="umkm-account-loading">
                  Memuat data UMKM...
                </td>
              </tr>
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={9} className="umkm-account-empty">
                  Tidak ada UMKM ditemukan
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr key={account.id} className="umkm-account-row">
                  <td>{account.name}</td>
                  <td>{account.owner}</td>
                  <td>{account.email}</td>
                  <td>{account.category}</td>
                  <td>{account.location}</td>
                  <td>
                    <span className={`account-status-badge ${account.accountStatus}`}>
                      {account.accountStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}
                    </span>
                  </td>
                  <td>{formatDate(account.submittedAt)}</td>
                  <td>
                    {account.accountStatus === 'active' ? (
                      <button
                        className="umkm-account-action-btn suspend"
                        onClick={() => handleSuspend(account)}
                        disabled={loading}
                      >
                        <XIcon width={16} height={16} />
                        Tangguhkan
                      </button>
                    ) : (
                      <button
                        className="umkm-account-action-btn activate"
                        onClick={() => handleActivate(account)}
                        disabled={loading}
                      >
                        <CheckIcon width={16} height={16} />
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}