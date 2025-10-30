import { LogoutIcon } from '../icons/LogoutIcon';
import { MenuIcon } from '../icons/MenuIcon';
import './AdminHeader.css';

interface AdminHeaderProps {
  onLogout: () => void;
  onMenuClick?: () => void;
}

export function AdminHeader({ onLogout, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left">
          {onMenuClick && (
            <button className="admin-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
              <MenuIcon width={24} height={24} color="var(--color-gray-700)" />
            </button>
          )}
          <h1 className="admin-header-title">Admin Dashboard</h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-details">
              <div className="admin-user-name">Admin</div>
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