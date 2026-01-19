import '../../styles/StatusBadge.css';

// Interface for StatusBadge props
interface StatusBadgeProps {
  // Status in Indonesian as per database - supports both transaction and payment statuses
  status_transaksi: 'menunggu' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan' | 'belum_dibayarkan' | 'sudah_dibayarkan';
  // Optional size prop
  size?: 'sm' | 'md';
}

/**
 * StatusBadge component to display status with consistent styling
 * Used for displaying approval status, transactions, etc.
 */
export function StatusBadge({ status_transaksi, size = 'md' }: StatusBadgeProps) {
  /**
   * Maps status to appropriate display text in Indonesian
   * @returns Translated status text
   */
  const getStatusText = () => {
    switch (status_transaksi) {
      // Transaction statuses
      case 'menunggu':
        return 'Menunggu';      // Waiting for approval/verification
      case 'diproses':
        return 'Diproses';      // Transaction is being processed
      case 'dikirim':
        return 'Dikirim';       // Order has been shipped
      case 'selesai':
        return 'Selesai';       // Completed/fulfilled
      case 'dibatalkan':
        return 'Dibatalkan';    // Cancelled
      
      // Payment statuses
      case 'belum_dibayarkan':
        return 'Menunggu';      // Waiting for payment
      case 'sudah_dibayarkan':
        return 'Selesai';       // Payment completed
        
      default:
        return status_transaksi;          // Fallback to original value if no match
    }
  };

  // Map Indonesian status to English for CSS class names
  const getStatusClass = () => {
    const statusMap: Record<string, string> = {
      // Transaction statuses
      'menunggu': 'pending',  
      'diproses': 'processing',
      'dikirim': 'shipped',
      'selesai': 'completed',
      'dibatalkan': 'cancelled',
      
      // Payment statuses
      'belum_dibayarkan': 'pending',
      'sudah_dibayarkan': 'completed'
    };
    return statusMap[status_transaksi] || status_transaksi;
  };

  // Render badge with dynamic classes based on status and size
  return (
    <span 
      className={`status-badge status-badge-${getStatusClass()} status-badge-${size}`}
      aria-label={`Status: ${getStatusText()}`}
    >
      {getStatusText()}
    </span>
  );
}