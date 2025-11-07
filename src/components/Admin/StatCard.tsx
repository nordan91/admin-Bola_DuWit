import '../../styles/StatCard.css';

// Interface untuk props yang diterima oleh komponen StatCard
interface StatCardProps {
  title: string;  // Judul yang ditampilkan di bagian atas kartu
  value: string | number;  // Nilai utama yang ditampilkan dengan ukuran besar
  icon?: React.ReactNode;  // Ikon opsional yang ditampilkan di sebelah judul
  trend?: {  // Informasi tren opsional (naik/turun)
    value: string;  // Nilai persentase atau indikator tren
    isPositive: boolean;  // Apakah tren bersifat positif (naik) atau negatif (turun)
  };
  color?: 'primary' | 'success' | 'warning' | 'info';  // Warna tema kartu
}

/**
 * Komponen StatCard untuk menampilkan informasi statistik dalam bentuk kartu
 * Digunakan di dashboard untuk menampilkan metrik penting
 */
export function StatCard({ title, value, icon, trend, color = 'primary' }: StatCardProps) {
  return (
    // Container utama kartu dengan kelas dinamis berdasarkan warna yang dipilih
    <div className={`stat-card stat-card-${color}`}>
      {/* Header kartu yang berisi judul dan ikon */}
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      
      {/* Nilai utama yang ditampilkan dengan ukuran besar */}
      <div className="stat-card-value">{value}</div>
      
      {/* Bagian tren yang menampilkan indikator naik/turun */}
      {trend && (
        <div 
          className={`stat-card-trend ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}
          aria-label={trend.isPositive ? 'Tren naik' : 'Tren turun'}
        >
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  );
}