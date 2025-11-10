import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { Modal } from './Modal';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { UMKMAccount } from '../../types/admin';
import { apiService } from '../../services/api';
import { mapApiArrayToUMKMAccounts } from '../../utils/umkmMapper';
import '../../styles/UMKMManagement.css';

/**
 * Interface untuk props yang diterima oleh komponen UMKMManagement
 */
interface UMKMManagementProps {
  accounts?: UMKMAccount[];  // Daftar akun UMKM opsional (jika tidak disediakan, akan diambil dari API)
  onApprove?: (id: string) => void;  // Callback untuk menangani persetujuan UMKM (opsional)
  onReject?: (id: string) => void;   // Callback untuk menangani penolakan UMKM (opsional)
}

/**
 * Komponen untuk mengelola pendaftaran UMKM
 * Menyediakan antarmuka untuk meninjau, menyetujui, dan menolak pendaftaran UMKM
 */
export function UMKMManagement({ 
  accounts: propAccounts, 
  onApprove: propOnApprove, 
  onReject: propOnReject 
}: UMKMManagementProps) {
  // State untuk manajemen data dan UI
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'suspended'>('pending');  // Tab aktif
  const [selectedAccount, setSelectedAccount] = useState<UMKMAccount | null>(null);  // Akun UMKM yang dipilih
  const [showModal, setShowModal] = useState(false);  // Status tampilan modal detail
  const [searchQuery, setSearchQuery] = useState('');  // Kata kunci pencarian
  const [accounts, setAccounts] = useState<UMKMAccount[]>(propAccounts || []);  // Daftar akun UMKM
  const [loading, setLoading] = useState(false);  // Status loading
  const [error, setError] = useState<string | null>(null);  // Pesan error
  const [isUsingApi] = useState(!propAccounts);  // Flag untuk menentukan apakah menggunakan data dari API atau props

  /**
   * Effect untuk mengambil data UMKM dari API jika tidak disediakan melalui props
   * Hanya berjalan jika isUsingApi bernilai true
   */
  useEffect(() => {
    if (!isUsingApi) {
      // Use prop accounts if provided
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
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data UMKM');
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMData();
  }, [isUsingApi, propAccounts]);

  /**
   * Memfilter daftar akun UMKM berdasarkan tab aktif dan kata kunci pencarian
   * @returns Daftar akun UMKM yang sesuai dengan kriteria pencarian dan filter
   */
  const filteredAccounts = accounts.filter(account => {
    // Menangani tab suspended terlebih dahulu
    if (activeTab === 'suspended') {
      return account.accountStatus === 'suspended' && 
             (account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
              account.category.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Untuk tab lainnya (pending/approved/rejected), filter akun yang tidak ditangguhkan
    if (account.accountStatus === 'suspended') {
      return false;
    }
    
    // Memeriksa apakah akun sesuai dengan tab yang aktif (pending/approved/rejected)
    const matchesTab = account.status === activeTab;
    
    // Memeriksa apakah akun sesuai dengan kata kunci pencarian
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Mengembalikan true hanya jika akun sesuai dengan tab aktif DAN kata kunci pencarian
    return matchesTab && matchesSearch;
  });

  /**
   * Menangani klik tombol lihat detail
   * @param account Akun UMKM yang akan dilihat detailnya
   */
  const handleViewDetails = (account: UMKMAccount) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  /**
   * Menangani persetujuan akun UMKM
   * Menggunakan prop callback jika disediakan, atau memanggil API langsung
   */
  const handleApprove = async () => {
    if (!selectedAccount) return;

    if (propOnApprove) {
      // Use prop callback if provided (for backward compatibility)
      propOnApprove(selectedAccount.id);
      setShowModal(false);
      setSelectedAccount(null);
      return;
    }

    // Use API
    setLoading(true);
    try {
      await apiService.approveUMKM(selectedAccount.id);
      
      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(account =>
          account.id === selectedAccount.id
            ? { ...account, status: 'approved' as const, reviewedAt: new Date().toISOString() }
            : account
        )
      );
      
      setShowModal(false);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Error approving UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyetujui UMKM');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Menangani penolakan akun UMKM
   * Menggunakan prop callback jika disediakan, atau memanggil API langsung
   */
  const handleReject = async () => {
    if (!selectedAccount) return;

    if (propOnReject) {
      // Use prop callback if provided (for backward compatibility)
      propOnReject(selectedAccount.id);
      setShowModal(false);
      setSelectedAccount(null);
      return;
    }

    // Use API
    setLoading(true);
    try {
      await apiService.rejectUMKM(selectedAccount.id, 'Ditolak oleh admin');
      
      // Update local state
      setAccounts(prevAccounts =>
        prevAccounts.map(account =>
          account.id === selectedAccount.id
            ? { ...account, status: 'rejected' as const, reviewedAt: new Date().toISOString() }
            : account
        )
      );
      
      setShowModal(false);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Error rejecting UMKM:', err);
      setError(err instanceof Error ? err.message : 'Gagal menolak UMKM');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memformat tanggal menjadi format yang lebih mudah dibaca
   * @param dateString String tanggal yang akan diformat
   * @returns String tanggal yang sudah diformat (contoh: "1 Januari 2023, 12:00")
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="umkm-management" role="main" aria-label="Manajemen Pendaftaran UMKM">
      {/* Header dengan fitur pencarian */}
      <div className="umkm-header">
        <div className="umkm-search" role="search">
          <div className="umkm-search-container">
            <SearchIcon className="umkm-search-icon" />
            <input
              type="text"
              placeholder="Cari UMKM..."
              className="umkm-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="umkm-error" style={{ 
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

      {/* Tab untuk filter status */}
      <div className="umkm-tabs" role="tablist" aria-label="Filter Status UMKM">
        <button
          className={`umkm-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Menunggu ({accounts.filter(a => a.status === 'pending' && a.accountStatus !== 'suspended').length})
        </button>
        <button
          className={`umkm-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Disetujui ({accounts.filter(a => a.status === 'approved' && a.accountStatus !== 'suspended').length})
        </button>
        <button
          className={`umkm-tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Ditolak ({accounts.filter(a => a.status === 'rejected' && a.accountStatus !== 'suspended').length})
        </button>
        <button
          className={`umkm-tab ${activeTab === 'suspended' ? 'active' : ''}`}
          onClick={() => setActiveTab('suspended')}
        >
          Ditangguhkan ({accounts.filter(a => a.accountStatus === 'suspended').length})
        </button>
      </div>

      {loading && (
        <div className="umkm-loading">
          <LoadingSpinner />
        </div>
      )}

      {/* Daftar UMKM */}
      <div className="umkm-list" role="list" aria-label="Daftar UMKM">
        {!loading && filteredAccounts.length === 0 ? (
          <div className="umkm-empty">
            <p>
              {activeTab === 'suspended' 
                ? 'Tidak ada UMKM yang ditangguhkan' 
                : `Tidak ada UMKM dengan status ${activeTab}`}
            </p>
          </div>
        ) : !loading && (
          filteredAccounts.map((account) => (
            <div key={account.id} className="umkm-card">
              <img src={account.image} alt={account.name} className="umkm-image" />
              <div className="umkm-info">
                <div className="umkm-info-header">
                  <h3 className="umkm-name">{account.name}</h3>
                  <StatusBadge 
                    status={account.status === 'suspended' ? 'suspended' : account.status} 
                    size="sm" 
                  />
                </div>
                <div className="umkm-details">
                  <div className="umkm-detail-item">
                    <span className="umkm-detail-label">Pemilik:</span>
                    <span className="umkm-detail-value">{account.owner}</span>
                  </div>
                  <div className="umkm-detail-item">
                    <span className="umkm-detail-label">Kategori:</span>
                    <span className="umkm-detail-value">{account.category}</span>
                  </div>
                  <div className="umkm-detail-item">
                    <span className="umkm-detail-label">Lokasi:</span>
                    <span className="umkm-detail-value">{account.location}</span>
                  </div>
                  <div className="umkm-detail-item">
                    <span className="umkm-detail-label">Diajukan:</span>
                    <span className="umkm-detail-value">{formatDate(account.submittedAt)}</span>
                  </div>
                </div>
                <button
                  className="umkm-view-btn"
                  onClick={() => handleViewDetails(account)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal detail UMKM */}
      {selectedAccount && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detail UMKM"
          aria-labelledby="modal-title"
          footer={
            selectedAccount.status === 'pending' ? (
              <>
                <button className="modal-btn modal-btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button 
                  className="modal-btn modal-btn-danger" 
                  onClick={handleReject}
                  disabled={loading}
                >
                  <XIcon width={16} height={16} />
                  {loading ? 'Memproses...' : 'Tolak'}
                </button>
                <button 
                  className="modal-btn modal-btn-success" 
                  onClick={handleApprove}
                  disabled={loading}
                >
                  <CheckIcon width={16} height={16} />
                  {loading ? 'Memproses...' : 'Setujui'}
                </button>
              </>
            ) : (
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowModal(false)}>
                Tutup
              </button>
            )
          }
        >
          <div className="umkm-modal-content">
            <img src={selectedAccount.image} alt={selectedAccount.name} className="umkm-modal-image" />
            <div className="umkm-modal-info">
              <div className="umkm-modal-field">
                <label>Nama UMKM</label>
                <p>{selectedAccount.name}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Pemilik</label>
                <p>{selectedAccount.owner}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Email</label>
                <p>{selectedAccount.email}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Telepon</label>
                <p>{selectedAccount.phone}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Kategori</label>
                <p>{selectedAccount.category}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Lokasi</label>
                <p>{selectedAccount.location}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Deskripsi</label>
                <p>{selectedAccount.description}</p>
              </div>
              <div className="umkm-modal-field">
                <label>Dokumen</label>
                <div className="umkm-documents">
                  {selectedAccount.documents.map((doc, index) => (
                    <span key={index} className="umkm-document-badge">{doc}</span>
                  ))}
                </div>
              </div>
              <div className="umkm-modal-field">
                <label>Status</label>
                <StatusBadge 
                  status={selectedAccount.status === 'suspended' ? 'suspended' : selectedAccount.status} 
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}