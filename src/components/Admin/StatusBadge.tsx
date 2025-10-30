import './StatusBadge.css';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <span className={`status-badge status-badge-${status} status-badge-${size}`}>
      {getStatusText()}
    </span>
  );
}