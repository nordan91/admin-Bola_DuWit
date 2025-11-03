import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './AdminSidebar.css';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { id: 'umkm', label: 'Kelola UMKM', icon: '🏪', path: '/admin/umkm' },
    { id: 'umkm-accounts', label: 'Akun UMKM', icon: '👥', path: '/admin/umkm-accounts' },
    { id: 'transactions', label: 'Transaksi', icon: '💳', path: '/admin/transactions' },
    { id: 'reports', label: 'Laporan', icon: '📈', path: '/admin/reports' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️', path: '/admin/settings' }
  ];

  const currentPath = location.pathname;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.admin-sidebar');
      const target = e.target as HTMLElement;
      
      if (sidebar && !sidebar.contains(target) && !target.closest('.mobile-menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile menu button (only visible on mobile)
  const MobileMenuButton = () => (
    <button 
      className="mobile-menu-button"
      onClick={toggleMenu}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1001,
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: isMobile ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`admin-sidebar-overlay ${isOpen ? 'visible' : ''}`}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`admin-sidebar ${isMobile ? (isOpen ? 'mobile-open' : '') : ''}`}>
        <div className="admin-sidebar-header">
          <img 
            src="/Logo_bola_duwit.jpg" 
            alt="Bola DuWit" 
            className="admin-sidebar-logo" 
            onClick={() => handleNavigate('/admin/dashboard')}
            style={{ cursor: 'pointer' }}
          />
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
              onClick={() => handleNavigate(item.path)}
              title={item.label}
            >
              <span className="admin-sidebar-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="admin-sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        
        {/* User profile or other bottom content */}
        <div className="admin-sidebar-footer" style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-gray-200)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-gray-500)'
        }}>
        </div>
      </aside>
    </>
  );
}