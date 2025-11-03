import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import type { Transaction } from '../../types/admin';
import './TransactionManagement.css';

interface TransactionManagementProps {
  transactions: Transaction[];
}

export function TransactionManagement({ transactions }: TransactionManagementProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.umkmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const completedCount = filteredTransactions.filter(t => t.status === 'completed').length;
  const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;

  return (
    <div className="transaction-management">
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
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Menunggu
          </button>
          <button
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Selesai
          </button>
          <button
            className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Dibatalkan
          </button>
        </div>
      </div>

      <div className="transaction-table-container">
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
                  <StatusBadge status={transaction.status} size="sm" />
                </div>
                <div className="transaction-mobile-body">
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Tanggal:</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">UMKM:</span>
                    <span>{transaction.umkmName}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Pelanggan:</span>
                    <span>{transaction.customerName}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Jumlah:</span>
                    <span className="transaction-amount">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <div className="transaction-mobile-row">
                    <span className="transaction-mobile-label">Metode:</span>
                    <span>{transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>UMKM</th>
              <th>Pelanggan</th>
              <th>Jumlah</th>
              <th>Metode</th>
              <th>Status</th>
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
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.umkmName}</td>
                  <td>{transaction.customerName}</td>
                  <td className="transaction-amount">{formatCurrency(transaction.amount)}</td>
                  <td>{transaction.paymentMethod}</td>
                  <td>
                    <StatusBadge status={transaction.status} size="sm" />
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