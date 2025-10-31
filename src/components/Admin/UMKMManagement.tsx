import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { Modal } from './Modal';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import type { UMKMAccount } from '../../types/admin';
import { apiService } from '../../services/api';
import { mapApiArrayToUMKMAccounts } from '../../utils/umkmMapper';
import './UMKMManagement.css';

interface UMKMManagementProps {
  accounts?: UMKMAccount[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function UMKMManagement({ 
  accounts: propAccounts, 
  onApprove: propOnApprove, 
  onReject: propOnReject 
}: UMKMManagementProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedAccount, setSelectedAccount] = useState<UMKMAccount | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<UMKMAccount[]>(propAccounts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingApi] = useState(!propAccounts);

  // Fetch UMKM data from API
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

  const filteredAccounts = accounts.filter(account => {
    const matchesTab = account.status === activeTab;
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleViewDetails = (account: UMKMAccount) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

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
    <div className="umkm-management">
      <div className="umkm-header">
        <h2 className="umkm-title">Kelola UMKM</h2>
        <div className="umkm-search">
          <input
            type="text"
            placeholder="Cari UMKM..."
            className="umkm-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      {loading && (
        <div className="umkm-loading" style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#666'
        }}>
          Memuat data UMKM...
        </div>
      )}

      <div className="umkm-tabs">
        <button
          className={`umkm-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Menunggu ({accounts.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`umkm-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Disetujui ({accounts.filter(a => a.status === 'approved').length})
        </button>
        <button
          className={`umkm-tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Ditolak ({accounts.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      <div className="umkm-list">
        {!loading && filteredAccounts.length === 0 ? (
          <div className="umkm-empty">
            <p>Tidak ada UMKM dengan status {activeTab}</p>
          </div>
        ) : !loading && (
          filteredAccounts.map((account) => (
            <div key={account.id} className="umkm-card">
              <img src={account.image} alt={account.name} className="umkm-image" />
              <div className="umkm-info">
                <div className="umkm-info-header">
                  <h3 className="umkm-name">{account.name}</h3>
                  <StatusBadge status={account.status} size="sm" />
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

      {selectedAccount && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detail UMKM"
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
                <StatusBadge status={selectedAccount.status} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}