import { LogoutIcon } from '../icons/LogoutIcon';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/AdminHeader.css';

// Interface untuk props yang diterima oleh komponen AdminHeader
interface AdminHeaderProps {
  onLogout: () => void;  // Fungsi yang dipanggil saat tombol logout ditekan
}

// Komponen header untuk halaman admin
// Menampilkan informasi user dan tombol logout
export function AdminHeader({ onLogout }: AdminHeaderProps) {
  // Mengambil data user dari konteks autentikasi
  const { user } = useAuth();
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        {/* Bagian kiri header (bisa digunakan untuk logo atau menu toggle) */}
        <div className="admin-header-left"></div>
        
        {/* Bagian kanan header berisi info user dan tombol logout */}
        <div className="admin-header-right">
          {/* Container untuk informasi user */}
          <div className="admin-user-info">
            {/* Avatar user dengan inisial nama */}
            <div className="admin-user-avatar">{user?.nama ? user.nama.charAt(0).toUpperCase() : 'A'}</div>
            
            {/* Detail user seperti nama dan role */}
            <div className="admin-user-details">
              <div className="admin-user-name">{user?.nama || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          
          {/* Tombol logout dengan ikon */}
          <button 
            className="admin-logout-btn" 
            onClick={onLogout} 
            aria-label="Logout"
          >
            <LogoutIcon width={20} height={20} color="var(--color-gray-700)" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}