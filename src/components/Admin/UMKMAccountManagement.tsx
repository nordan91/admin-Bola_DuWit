import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { UMKMAccount } from '../../types/admin';
import { apiService } from '../../services/api';
import { mapApiArrayToUMKMAccounts } from '../../utils/umkmMapper';
import '../../styles/UMKMAccountManagement.css';

// Interface untuk data suspensi
interface SuspensionFormData {
  suspension_reason: string;
  suspend_duration: number; // Durasi dalam hari
}

// Interface untuk props yang diterima oleh komponen UMKMAccountManagement
interface UMKMAccountManagementProps {
  accounts?: UMKMAccount[];  // Daftar akun UMKM opsional (jika tidak disediakan, akan diambil dari API)
}

/**
 * Komponen untuk mengelola akun UMKM
 * Menyediakan fungsionalitas untuk melihat, mencari, dan mengelola status akun UMKM
 */
export function UMKMAccountManagement({
  accounts: propAccounts
}: UMKMAccountManagementProps) {
  // State untuk manajemen data dan UI
  const [accounts, setAccounts] = useState<UMKMAccount[]>(propAccounts || []);  // Daftar akun UMKM
  const [loading, setLoading] = useState(false);  // Status loading saat mengambil data
  const [error, setError] = useState<string | null>(null);  // Pesan error jika terjadi kesalahan
  const [searchQuery, setSearchQuery] = useState('');  // Kata kunci pencarian
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');  // Filter status akun
  const [isUsingApi] = useState(!propAccounts);  // Flag untuk menentukan apakah menggunakan data dari API atau props
  
  // State untuk modal dan form suspensi
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UMKMAccount | null>(null);
  const [suspensionData, setSuspensionData] = useState<SuspensionFormData>({
    suspension_reason: '',
    suspend_duration: 7 // Default 7 hari
  });

  /**
   * Effect untuk mengambil data akun UMKM dari API jika tidak disediakan melalui props
   * Hanya berjalan jika isUsingApi bernilai true
   */
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

            // Menampilkan semua akun termasuk yang ditangguhkan (suspended)
            // Sebelumnya hanya menampilkan akun dengan status 'approved'
            setAccounts(allAccounts);
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

  /**
   * Memfilter daftar akun berdasarkan kata kunci pencarian dan status
   * @returns Daftar akun yang sesuai dengan kriteria pencarian dan filter
   */
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Membuka modal penangguhan untuk akun yang dipilih
   * @param account Akun UMKM yang akan ditangguhkan
   */
  const openSuspendModal = (account: UMKMAccount) => {
    setSelectedAccount(account);
    setSuspensionData({
      suspension_reason: '',
      suspend_duration: 7 // Reset ke default 7 hari
    });
    setShowSuspensionModal(true);
  };

  /**
   * Menangani perubahan input pada form suspensi
   */
  const handleSuspensionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSuspensionData(prev => ({
      ...prev,
      [name]: name === 'suspend_duration' ? parseInt(value, 10) : value
    }));
  };

  /**
   * Menangani penangguhan akun UMKM
   */
  const handleSuspend = async () => {
    if (!selectedAccount) return;
    
    // Validasi input
    if (!suspensionData.suspension_reason.trim()) {
      setError('Alasan penangguhan harus diisi');
      return;
    }

    if (isNaN(suspensionData.suspend_duration) || suspensionData.suspend_duration <= 0) {
      setError('Lama suspend harus lebih dari 0 hari');
      return;
    }

    setLoading(true);
    try {
      // Hitung tanggal berakhir berdasarkan durasi
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + suspensionData.suspend_duration);
      
      // Panggil API untuk menangguhkan akun
      await apiService.suspendUMKM(selectedAccount.id, {
        reason: suspensionData.suspension_reason.trim(),
        duration_days: suspensionData.suspend_duration
      });

      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(acc =>
          acc.id === selectedAccount.id
            ? { 
                ...acc, 
                accountStatus: 'suspended' as const,
                suspension_reason: suspensionData.suspension_reason.trim(),
                suspended_at: today.toISOString().split('T')[0],
                suspension_end_date: endDate.toISOString().split('T')[0]
              }
            : acc
        )
      );
      
      // Tutup modal dan reset state
      setShowSuspensionModal(false);
      setError(null);
      
      // Tampilkan pesan sukses
      alert('Akun berhasil ditangguhkan');
    } catch (err) {
      console.error('Error suspending UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal menangguhkan UMKM');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Menangani pengaktifan kembali akun UMKM yang ditangguhkan
   * @param account Akun UMKM yang akan diaktifkan
   */
  const handleActivate = async (account: UMKMAccount) => {
    if (!confirm(`Apakah Anda yakin ingin mengaktifkan kembali akun UMKM "${account.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      // Menggunakan unsuspendUMKM untuk mengaktifkan kembali akun yang ditangguhkan
      await apiService.unsuspendUMKM(account.id);

      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(acc =>
          acc.id === account.id
            ? { 
                ...acc, 
                accountStatus: 'active' as const,
                suspension_reason: undefined,
                suspended_at: undefined,
                suspension_end_date: undefined
              }
            : acc
        )
      );
      
      // Tampilkan pesan sukses
      alert('Akun berhasil diaktifkan kembali');
    } catch (err) {
      console.error('Error mengaktifkan UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengaktifkan UMKM');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memformat tanggal menjadi format yang lebih mudah dibaca
   * @param dateString String tanggal yang akan diformat
   * @returns String tanggal yang sudah diformat (contoh: "1 Jan 2023, 12:00")
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Menghitung jumlah akun aktif dan yang ditangguhkan untuk ditampilkan di statistik
  const activeCount = accounts.filter(a => a.accountStatus === 'active').length;
  const suspendedCount = accounts.filter(a => a.accountStatus === 'suspended').length;

  return (
    <div className="umkm-account-management" role="main" aria-label="Manajemen Akun UMKM">

      {/* Statistik ringkasan akun UMKM */}
      <div className="umkm-account-stats" aria-label="Statistik Akun UMKM">
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

      {/* Modal Suspensi */}
      {showSuspensionModal && selectedAccount && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Tangguhkan Akun UMKM
            </h3>
            
            {/* Informasi Akun */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Nama UMKM:</div>
              <div>{selectedAccount.name}</div>
            </div>

            {/* Form Suspensi */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="suspension_reason" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Alasan Penangguhan <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                id="suspension_reason"
                name="suspension_reason"
                value={suspensionData.suspension_reason}
                onChange={handleSuspensionInputChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.25rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Masukkan alasan penangguhan..."
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="suspend_duration" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Lama Suspend (Hari) <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                id="suspend_duration"
                name="suspend_duration"
                value={suspensionData.suspend_duration}
                onChange={handleSuspensionInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.25rem',
                  backgroundColor: 'white'
                }}
                disabled={loading}
                required
              >
                <option value="1">1 Hari</option>
                <option value="3">3 Hari</option>
                <option value="7">1 Minggu</option>
                <option value="14">2 Minggu</option>
                <option value="30">1 Bulan</option>
                <option value="90">3 Bulan</option>
                <option value="180">6 Bulan</option>
                <option value="365">1 Tahun</option>
              </select>
            </div>

            {/* Pesan Error */}
            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '0.25rem',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}

            {/* Tombol Aksi */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  setShowSuspensionModal(false);
                  setError(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSuspend}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Tangguhkan'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Filter dan pencarian */}
      <div className="umkm-account-filters" role="search">
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

      {/* Container untuk tabel (desktop) dan daftar mobile */}
      <div className="umkm-account-table-container">
        {/* Tampilan mobile - daftar kartu akun UMKM */}
        <div className="umkm-account-mobile-list">
          {loading ? (
            <div className="umkm-account-loading">
              <LoadingSpinner />
              <p>Memuat data UMKM...</p>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="umkm-account-empty">
              Tidak ada UMKM ditemukan
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div key={account.id} className="umkm-account-mobile-card">
                <div className="umkm-account-mobile-header">
                  <span>{account.name}</span>
                  <div className="umkm-account-status-badges">
                    <StatusBadge 
                      status_transaksi={account.status === 'pending' ? 'menunggu' : account.status === 'approved' ? 'diproses' : account.status === 'rejected' ? 'dibatalkan' : 'menunggu'} 
                      size="sm" 
                    />
                    <span className={`account-status-badge ${account.accountStatus}`}>
                      {account.accountStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}
                    </span>
                  </div>
                </div>
                <div className="umkm-account-mobile-body">
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
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowSuspensionModal(true);
                      }}
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
        {/* Tampilan desktop - tabel akun UMKM */}
        <table className="umkm-account-table" aria-label="Daftar Akun UMKM">
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
                        onClick={() => openSuspendModal(account)}
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