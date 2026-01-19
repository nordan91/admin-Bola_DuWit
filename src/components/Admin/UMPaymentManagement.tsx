import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { apiService } from '../../services/api';
import { PaymentTransaction, UMKMPaymentInfo, UMPayment } from '../../types/admin';
import '../../styles/TransactionManagement.css';
import '../../styles/UMPaymentManagement.css';
import { FaTimes, FaEye, FaUpload, FaCheck, FaMoneyBillWave } from 'react-icons/fa';

// Constants
const MAX_FILE_SIZE_KB = 2048;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
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

const validateFile = (file: File): { isValid: boolean; error: string } => {
  if (!file.type.match('image.*')) {
    return { isValid: false, error: 'Hanya file gambar (JPG/PNG/GIF) yang diizinkan' };
  }
  
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB > MAX_FILE_SIZE_KB) {
    return { 
      isValid: false, 
      error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_KB}KB, file Anda ${Math.round(fileSizeKB)}KB` 
    };
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung. Hanya JPG, JPEG, PNG, dan GIF yang diizinkan' };
  }
  
  return { isValid: true, error: '' };
};

const transformPaymentData = (transactions: PaymentTransaction[]): UMPayment[] => {
  const paymentsMap = new Map<string, UMPayment>();
  
  transactions.forEach(transaction => {
    transaction.umkm_payment_info.forEach((paymentInfo: UMKMPaymentInfo) => {
      // Skip COD transactions - check if payment info indicates COD
      if (paymentInfo.nama_bank?.toLowerCase().includes('cod')) {
        return;
      }
      
      const key = paymentInfo.umkm_id;
      
      if (paymentsMap.has(key)) {
        // If this UMKM already exists, update the total_harga
        const existingPayment = paymentsMap.get(key)!;
        existingPayment.total_harga += paymentInfo.total_pembayaran;
        existingPayment.total_pembayaran += paymentInfo.total_pembayaran;
      } else {
        // Create new payment entry
        paymentsMap.set(key, {
          id: `${transaction.id}_${paymentInfo.umkm_id}`,
          transaction_id: transaction.id,
          umkm_id: paymentInfo.umkm_id,
          nama_toko: paymentInfo.nama_toko,
          owner: paymentInfo.owner,
          nomor_rekening: paymentInfo.nomor_rekening,
          nama_bank: paymentInfo.nama_bank,
          total_harga: paymentInfo.total_pembayaran,
          total_pembayaran: paymentInfo.total_pembayaran,
          status_pembayaran: paymentInfo.status_pembayaran,
          status_pembayaran_umkm: paymentInfo.status_pembayaran,
          tanggal_pembayaran_umkm: paymentInfo.tanggal_pembayaran,
          bukti_transfer_path: paymentInfo.bukti_transfer_path,
          admin_pembayaran: paymentInfo.admin_pembayaran,
          nama_pembeli: transaction.nama_pembeli,
          tanggal_transaksi: transaction.tanggal_transaksi
        });
      }
    });
  });
  
  return Array.from(paymentsMap.values());
};

// Modal component for payment form
const PaymentFormModal = ({ 
  payment, 
  onClose, 
  onUploadProof 
}: { 
  payment: UMPayment | null, 
  onClose: () => void,
  onUploadProof: (file: File) => Promise<void>
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!payment) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (!validation.isValid) {
        alert(validation.error);
        e.target.value = '';
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Silakan pilih bukti pembayaran');
      return;
    }
    
    setIsUploading(true);
    try {
      await onUploadProof(file);
      onClose();
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      alert('Gagal mengunggah bukti pembayaran. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Form Pembayaran UMKM</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nomor Rekening Tujuan</label>
            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
              {payment.nomor_rekening}
            </div>
            <small className="form-text text-muted">Harap transfer ke nomor rekening di atas</small>
          </div>
          <div className="form-group">
            <label className="form-label">Total Tagihan</label>
            <div className="form-control" style={{ fontWeight: 'bold' }}>
              {formatCurrency(payment.total_harga)}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Bukti Transfer (JPG/PNG/GIF)</label>
            <div className="file-upload">
              <input 
                type="file" 
                id="payment-proof" 
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="payment-proof" className="file-upload-label">
                {file ? file.name : 'Pilih File'}
              </label>
            </div>
            <small className="form-text text-muted">Format file: JPG, JPEG, PNG, atau GIF (maks. {MAX_FILE_SIZE_KB}KB)</small>
          </div>
          
          
          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!file || isUploading}
            >
              {isUploading ? 'Mengunggah...' : 'Simpan Pembayaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export function UMPaymentManagement() {
  // State for payments data, loading, and error
  const [payments, setPayments] = useState<UMPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<UMPayment | null>(null);
  
  // State for filters and search
  const [statusFilter, setStatusFilter] = useState<'all' | 'belum_dibayarkan' | 'sudah_dibayarkan'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCompletedTransactionsForPayment();
        
        if (response.success && response.data) {
          const transformedData = transformPaymentData(response.data);
          setPayments(transformedData);
          setError(null);
        } else {
          throw new Error(response.message || 'Gagal memuat data pembayaran UMKM');
        }
      } catch (err) {
        console.error('Error fetching UMKM payments:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data pembayaran UMKM. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  // Filter payments based on status and search query
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || 
      payment.status_pembayaran_umkm === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchLower) ||
      payment.nama_toko.toLowerCase().includes(searchLower) ||
      payment.nomor_rekening.includes(searchQuery);
    
    return matchesStatus && matchesSearch;
  });

  // Handle payment proof upload
  const handleUploadProof = async (file: File) => {
    if (!selectedPayment) return;
    
    try {
      setIsLoading(true);
      
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      const response = await apiService.uploadPaymentProof(
        selectedPayment.transaction_id,
        selectedPayment.umkm_id,
        file
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Gagal mengunggah bukti pembayaran');
      }
      
      alert('Bukti pembayaran berhasil diunggah dan status pembayaran telah diperbarui');
      
      const paymentsResponse = await apiService.getCompletedTransactionsForPayment();
      
      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(transformPaymentData(paymentsResponse.data));
      }
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat upload bukti pembayaran';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.total_harga, 0);
  const pendingCount = filteredPayments.filter(p => p.status_pembayaran_umkm === 'belum_dibayarkan').length;
  const completeCount = filteredPayments.filter(p => p.status_pembayaran_umkm === 'sudah_dibayarkan').length;

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="transaction-management">
        <div className="loading-indicator">Memuat data pembayaran UMKM...</div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="transaction-management">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-management">
      <h2>Manajemen Pembayaran UMKM</h2>
      
      {/* Statistics cards */}
      <div className="transaction-stats">
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Total Tagihan</div>
          <div className="transaction-stat-value">{filteredPayments.length}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Menunggu</div>
          <div className="transaction-stat-value">{pendingCount}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Selesai</div>
          <div className="transaction-stat-value">{completeCount}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Total Nilai</div>
          <div className="transaction-stat-value">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="transaction-filters">
        <div className="transaction-search">
          <input
            type="text"
            placeholder="Cari pembayaran..."
            className="transaction-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="transaction-status-filters">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Semua
          </button>
          <button
            className={`filter-btn ${statusFilter === 'belum_dibayarkan' ? 'active' : ''}`}
            onClick={() => setStatusFilter('belum_dibayarkan')}
          >
            Menunggu
          </button>
          <button
            className={`filter-btn ${statusFilter === 'sudah_dibayarkan' ? 'active' : ''}`}
            onClick={() => setStatusFilter('sudah_dibayarkan')}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Mobile view - payment cards */}
      <div className="transaction-table-container">
        <div className="transaction-mobile-list">
          {filteredPayments.length === 0 ? (
            <div className="transaction-empty">
              Tidak ada data pembayaran ditemukan
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="transaction-mobile-card">
                <div className="transaction-mobile-header">
                  <span className="transaction-id">{payment.id}</span>
                  <StatusBadge status_transaksi={payment.status_pembayaran_umkm} size="sm" />
                </div>
                <div className="transaction-mobile-body">
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Toko:</span>
                    <span>{payment.nama_toko}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">No. Rekening:</span>
                    <span>{payment.nomor_rekening}</span>
                  </div>
                  <div className="transaction-mobile-actions">
  {
                    payment.status_pembayaran_umkm === 'belum_dibayarkan' ? (
                      <button 
                        className="pay-button"
                        onClick={() => setSelectedPayment(payment)}
                        style={{ width: '100%' }}
                      >
                        <FaMoneyBillWave /> Bayar
                      </button>
                    ) : (
                      <button 
                        className="detail-button"
                        onClick={() => setSelectedPayment(payment)}
                        style={{ width: '100%' }}
                      >
                        <FaEye /> Lihat Bukti
                      </button>
                    )
                  }
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Total:</span>
                    <span className="transaction-amount">{formatCurrency(payment.total_harga)}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Tanggal:</span>
                    <span>{formatDate(payment.tanggal_transaksi)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop view - table */}
        <table className="transaction-table" aria-label="Daftar Pembayaran UMKM">
          <thead>
            <tr>
              <th>ID Pembayaran</th>
              <th>Tanggal</th>
              <th>Nama Toko</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="transaction-empty">
                  Tidak ada data pembayaran ditemukan
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="transaction-row">
                  <td className="transaction-id">{payment.id}</td>
                  <td>{formatDate(payment.tanggal_transaksi)}</td>
                  <td>{payment.nama_toko}</td>
                  <td className="transaction-amount">{formatCurrency(payment.total_harga)}</td>
                  <td>
                    <StatusBadge status_transaksi={payment.status_pembayaran_umkm} size="sm" />
                  </td>
                  <td>
                    {payment.status_pembayaran_umkm === 'belum_dibayarkan' ? (
                      <button 
                        className="pay-button"
                        onClick={() => setSelectedPayment(payment)}
                        title="Bayar Tagihan"
                      >
                        <FaMoneyBillWave /> Bayar
                      </button>
                    ) : (
                      <button 
                        className="detail-button"
                        onClick={() => setSelectedPayment(payment)}
                        title="Lihat bukti pembayaran"
                      >
                        <FaEye /> Lihat
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Payment Form Modal */}
      <PaymentFormModal 
        payment={selectedPayment} 
        onClose={() => setSelectedPayment(null)}
        onUploadProof={handleUploadProof}
      />
    </div>
  );
}

export default UMPaymentManagement;
