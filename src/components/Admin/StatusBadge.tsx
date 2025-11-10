import '../../styles/StatusBadge.css';

// Interface untuk props yang diterima oleh komponen StatusBadge
interface StatusBadgeProps {
  // Status yang menentukan tampilan dan teks badge
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'completed' | 'cancelled';
  // Ukuran opsional untuk badge (kecil atau sedang)
  size?: 'sm' | 'md';
}

/**
 * Komponen StatusBadge untuk menampilkan status dengan gaya yang konsisten
 * Digunakan untuk menampilkan status persetujuan, transaksi, dll.
 */
export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  /**
   * Mengonversi status ke dalam teks yang sesuai dalam bahasa Indonesia
   * @returns Teks status yang sudah diterjemahkan
   */
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Menunggu';      // Status menunggu persetujuan/verifikasi
      case 'approved':
        return 'Disetujui';     // Status disetujui/diterima
      case 'rejected':
        return 'Ditolak';       // Status ditolak/tidak disetujui
      case 'suspended':
        return 'Ditangguhkan';  // Status ditangguhkan
      case 'completed':
        return 'Selesai';       // Status selesai/terpenuhi
      case 'cancelled':
        return 'Dibatalkan';    // Status dibatalkan
      default:
        return status;          // Fallback ke nilai asli jika tidak ada yang cocok
    }
  };

  // Render badge dengan kelas dinamis berdasarkan status dan ukuran
  return (
    <span 
      className={`status-badge status-badge-${status} status-badge-${size}`}
      aria-label={`Status: ${getStatusText()}`}
    >
      {getStatusText()}
    </span>
  );
}