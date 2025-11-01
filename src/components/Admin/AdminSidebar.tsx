import { useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { id: 'umkm', label: 'Kelola UMKM', icon: '🏪', path: '/admin/umkm' },
    { id: 'umkm-accounts', label: 'Akun UMKM', icon: '👥', path: '/admin/umkm-accounts' },
    { id: 'transactions', label: 'Transaksi', icon: '💳', path: '/admin/transactions' }
  ];

  const currentPath = location.pathname;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <img src="/Logo_bola_duwit.jpg" alt="Bola DuWit" className="admin-sidebar-logo" />
        <div className="admin-sidebar-title">
          <h2>Bola DuWit</h2>
          <p>Admin Panel</p>
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`admin-sidebar-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="admin-sidebar-icon">{item.icon}</span>
            <span className="admin-sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}