import { LogoutIcon } from '../icons/LogoutIcon';
import { useAuth } from '../../contexts/AuthContext';
import './AdminHeader.css';

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left"></div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-details">
              <div className="admin-user-name">{user?.nama || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout} aria-label="Logout">
            <LogoutIcon width={20} height={20} color="var(--color-gray-700)" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}