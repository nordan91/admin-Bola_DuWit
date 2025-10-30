import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { Modal } from './Modal';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import type { UMKMAccount } from '../../types/admin';
import './UMKMManagement.css';

interface UMKMManagementProps {
  accounts: UMKMAccount[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function UMKMManagement({ accounts, onApprove, onReject }: UMKMManagementProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedAccount, setSelectedAccount] = useState<UMKMAccount | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleApprove = () => {
    if (selectedAccount) {
      onApprove(selectedAccount.id);
      setShowModal(false);
      setSelectedAccount(null);
    }
  };

  const handleReject = () => {
    if (selectedAccount) {
      onReject(selectedAccount.id);
      setShowModal(false);
      setSelectedAccount(null);
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
        {filteredAccounts.length === 0 ? (
          <div className="umkm-empty">
            <p>Tidak ada UMKM dengan status {activeTab}</p>
          </div>
        ) : (
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
                <button className="modal-btn modal-btn-danger" onClick={handleReject}>
                  <XIcon width={16} height={16} />
                  Tolak
                </button>
                <button className="modal-btn modal-btn-success" onClick={handleApprove}>
                  <CheckIcon width={16} height={16} />
                  Setujui
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