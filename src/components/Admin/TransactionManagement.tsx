import { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import type { Transaction } from '../../types/admin';
import { apiService } from '../../services/api';
import '../../styles/TransactionManagement.css';
import { FaTimes, FaEye } from 'react-icons/fa';


/**
 * Komponen untuk mengelola dan menampilkan daftar transaksi
 * Menyediakan fitur filter, pencarian, dan tampilan statistik transaksi
 */
// Komponen Modal untuk menampilkan detail pesanan
const OrderDetailModal = ({ transaction, onClose }: { transaction: Transaction | null, onClose: () => void }) => {
  if (!transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detail Pesanan</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="order-details">
          {/* Group products by store */}
          {(() => {
            const products = transaction.products || [];
            const stores = new Map();
            
            // Group products by store
            products.forEach((product: any) => {
              const storeName = product.nama_umkm || product.umkm_name || 'Toko tidak diketahui';
              if (!stores.has(storeName)) {
                stores.set(storeName, []);
              }
              stores.get(storeName).push(product);
            });
            
            const hasMultipleStores = stores.size > 1;
            
            return (
              <>
                <h4>Produk</h4>
                {hasMultipleStores ? (
                  // Multiple stores - display products grouped by store
                  Array.from(stores.entries()).map(([storeName, storeProducts]) => (
                    <div key={storeName} className="store-section">
                      <h5 className="store-name-header">{storeName}</h5>
                      {storeProducts.map((product: any, index: number) => (
                        <div key={`${storeName}-${index}`} className="order-item">
                          <img 
                            src={product.product_image || '/placeholder-product.jpg'} 
                            alt={product.nama_produk} 
                            className="product-image"
                          />
                          <div className="product-info">
                            <div className="product-name">{product.nama_produk}</div>
                            <div className="product-price">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                              }).format(product.harga_satuan)}
                            </div>
                            <div className="product-quantity">Jumlah: {product.jumlah}</div>
                          </div>
                          <div className="product-subtotal">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(product.harga_satuan * product.jumlah)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  // Single store - display products normally
                  products.map((product: any, index: any) => (
                    <div key={index} className="order-item">
                      <img 
                        src={product.product_image || '/placeholder-product.jpg'} 
                        alt={product.nama_produk} 
                        className="product-image"
                      />
                      <div className="product-info">
                        <div className="product-name">{product.nama_produk}</div>
                        <div className="product-price">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(product.harga_satuan)}
                        </div>
                        <div className="product-quantity">Jumlah: {product.jumlah}</div>
                      </div>
                      <div className="product-subtotal">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(product.harga_satuan * product.jumlah)}
                      </div>
                    </div>
                  ))
                )}
              </>
            );
          })()}
          
          {/* Only show store info if single store */}
          {(() => {
            const products = transaction.products || [];
            const stores = new Set();
            products.forEach((product: any) => {
              const storeName = product.nama_umkm || product.umkm_name;
              if (storeName) stores.add(storeName);
            });
            
            return stores.size <= 1 ? (
              <div className="store-info">
                <h4>Toko</h4>
                <p>{transaction.nama_umkm || transaction.umkm_name}</p>
              </div>
            ) : null;
          })()}

          <div className="customer-info">
            <h4>Detail Pemesan</h4>
            <p><strong>Nama:</strong> {transaction.customer_name || transaction.nama_pembeli}</p>
            <p><strong>Alamat:</strong> {transaction.alamat_pengiriman || 'Alamat tidak tersedia'}</p>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(transaction.total_harga)}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total Tagihan</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(transaction.total_harga)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TransactionManagement() {
  // State untuk data transaksi, loading, dan error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // State untuk filter dan pencarian
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan'>('all');
  const [searchQuery, setSearchQuery] = useState('');  // Kata kunci pencarian
  
  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Gagal memuat data transaksi. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  // Memfilter transaksi berdasarkan status dan kata kunci pencarian
  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || 
      transaction.status_transaksi.toLowerCase() === statusFilter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchLower) ||
      (transaction.nama_umkm?.toLowerCase() || '').includes(searchLower) ||
      (transaction.customer_name?.toLowerCase() || '').includes(searchLower) ||
      (transaction.metode_pembayaran?.toLowerCase() || '').includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  /**
   * Memformat angka menjadi format mata uang Rupiah
   * @param amount Jumlah uang yang akan diformat
   * @returns String yang sudah diformat (contoh: "Rp 1.000.000")
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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

  // Menghitung statistik transaksi
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + (Number(t.total_harga) || 0), 0);  // Total nilai transaksi
  const completedCount = filteredTransactions.filter(t => 
    t.status_transaksi?.toLowerCase() === 'selesai' || 
    t.status_transaksi?.toLowerCase() === 'completed'
  ).length;  // Jumlah transaksi selesai
  const pendingCount = filteredTransactions.filter(t => 
    t.status_transaksi?.toLowerCase() === 'menunggu' || 
    t.status_transaksi?.toLowerCase() === 'pending'
  ).length;  // Jumlah transaksi menunggu

  // Tampilkan loading indicator
  if (isLoading) {
    return (
      <div className="transaction-management">
        <div className="loading-indicator">Memuat data transaksi...</div>
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="transaction-management">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-management">
      {/* Kartu statistik ringkasan transaksi */}
      <div className="transaction-stats">
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Total Transaksi</div>
          <div className="transaction-stat-value">{filteredTransactions.length}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Selesai</div>
          <div className="transaction-stat-value">{completedCount}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Menunggu</div>
          <div className="transaction-stat-value">{pendingCount}</div>
        </div>
        <div className="transaction-stat-card">
          <div className="transaction-stat-label">Total Nilai</div>
          <div className="transaction-stat-value">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      {/* Bagian filter dan pencarian */}
      <div className="transaction-filters">
        <div className="transaction-search">
          <input
            type="text"
            placeholder="Cari transaksi..."
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
            className={`filter-btn ${statusFilter === 'menunggu' ? 'active' : ''}`}
            onClick={() => setStatusFilter('menunggu')}
          >
            Menunggu
          </button>
          <button
            className={`filter-btn ${statusFilter === 'diproses' ? 'active' : ''}`}
            onClick={() => setStatusFilter('diproses')}
          >
            Proses
          </button>
          <button
            className={`filter-btn ${statusFilter === 'dikirim' ? 'active' : ''}`}
            onClick={() => setStatusFilter('dikirim')}
          >
            Dikirim
          </button>
          <button
            className={`filter-btn ${statusFilter === 'selesai' ? 'active' : ''}`}
            onClick={() => setStatusFilter('selesai')}
          >
            Selesai
          </button>
          <button
            className={`filter-btn ${statusFilter === 'dibatalkan' ? 'active' : ''}`}
            onClick={() => setStatusFilter('dibatalkan')}
          >
            Dibatalkan
          </button>
        </div>
      </div>

      {/* Container untuk tabel transaksi (desktop) dan daftar mobile */}
      <div className="transaction-table-container">
        {/* Tampilan mobile - daftar kartu transaksi */}
        <div className="transaction-mobile-list">
          {filteredTransactions.length === 0 ? (
            <div className="transaction-empty">
              Tidak ada transaksi ditemukan
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-mobile-card">
                <div className="transaction-mobile-header">
                  <span className="transaction-id">{transaction.id}</span>
                  <StatusBadge status_transaksi={transaction.status_transaksi} size="sm" />
                </div>
                <div className="transaction-mobile-body">
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">UMKM:</span>
                    <span>{transaction.nama_umkm || transaction.umkm_name}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Pelanggan:</span>
                    <span>{transaction.customer_name || transaction.nama_pembeli}</span>
                  </div>
                  <div className="transaction-mobile-actions">
                    <button 
                      className="detail-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(transaction);
                      }}
                      title="Lihat detail pesanan"
                    >
                      <FaEye /> Lihat Detail
                    </button>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Total:</span>
                    <span className="transaction-amount">{formatCurrency(transaction.total_harga)}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Metode:</span>
                    <span>{transaction.metode_pembayaran}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Status:</span>
                    <span>{transaction.status_transaksi}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Jumlah:</span>
                    <span className="transaction-amount">{formatCurrency(transaction.total_harga)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Tampilan desktop - tabel transaksi */}
        <table className="transaction-table" aria-label="Daftar Transaksi">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>UMKM</th>
              <th>Pelanggan</th>
              <th>Total</th>
              <th>Metode</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="transaction-empty">
                  Tidak ada transaksi ditemukan
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="transaction-row">
                  <td className="transaction-id">{transaction.id}</td>
                  <td>{formatDate(transaction.tanggal_transaksi)}</td>
                  <td>{transaction.nama_umkm || transaction.umkm_name}</td>
                  <td>{transaction.customer_name || transaction.nama_pembeli}</td>
                  <td className="transaction-amount">{formatCurrency(transaction.total_harga)}</td>
                  <td>{transaction.metode_pembayaran}</td>
                  <td>
                    <StatusBadge status_transaksi={transaction.status_transaksi} size="sm" />
                  </td>
                  <td>
                    <button 
                        className="pay-button"
                        onClick={() => setSelectedTransaction(transaction)}
                        title="Lihat detail pesanan"
                      >
                        Detail
                      </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal Detail Pesanan */}
      <OrderDetailModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />
    </div>
  );
}