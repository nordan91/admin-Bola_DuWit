import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiMenu, FiX, FiHome, FiUsers, FiFileText } from 'react-icons/fi';
import '../../styles/AdminSidebar.css';

// Komponen sidebar untuk navigasi halaman admin
export function AdminSidebar() {
  // Hooks untuk routing dan state management
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk menangani tampilan mobile dan toggle sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [isOpen, setIsOpen] = useState(false);

  // Daftar menu navigasi sidebar
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={20} />, path: '/admin/dashboard' },
    { id: 'umkm', label: 'Kelola UMKM', icon: <FiFileText size={20} />, path: '/admin/umkm' },
    { id: 'umkm-accounts', label: 'Akun UMKM', icon: <FiUsers size={20} />, path: '/admin/umkm-accounts' },
    // { id: 'transactions', label: 'Transaksi', icon: <FiDollarSign size={20} />, path: '/admin/transactions' },
    // { id: 'reports', label: 'Laporan', icon: <FiFileText size={20} />, path: '/admin/reports' },
    // { id: 'settings', label: 'Pengaturan', icon: <FiSettings size={20} />, path: '/admin/settings' }
  ];
  
  // Mendapatkan path saat ini untuk menandai menu aktif

  const currentPath = location.pathname;

  // Effect untuk menangani perubahan ukuran layar
  // Menyesuaikan tampilan sidebar berdasarkan lebar layar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
      // Menutup sidebar saat beralih ke tampilan desktop
      if (!mobile) {
        setIsOpen(false);
      }
    };

    // Menambahkan event listener untuk resize
    window.addEventListener('resize', handleResize);
    // Cleanup function untuk menghapus event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect untuk menutup sidebar saat mengklik di luar area sidebar pada tampilan mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.admin-sidebar');
      const target = e.target as HTMLElement;
      
      // Menutup sidebar jika mengklik di luar area sidebar dan bukan tombol menu
      if (sidebar && !sidebar.contains(target) && !target.closest('.mobile-menu-button')) {
        setIsOpen(false);
      }
    };

    // Menambahkan event listener untuk mendeteksi klik di luar sidebar
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup function untuk menghapus event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Fungsi untuk menampilkan/menyembunyikan menu pada tampilan mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi untuk menangani navigasi ke halaman yang dipilih
  const handleNavigate = (path: string) => {
    navigate(path);
    // Menutup sidebar setelah memilih menu pada tampilan mobile
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Komponen tombol menu untuk tampilan mobile
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
      {/* Menampilkan tombol menu pada tampilan mobile */}
      <MobileMenuButton />
      
      {/* Overlay untuk menutup sidebar saat di-klik pada tampilan mobile */}
      {isMobile && (
        <div 
          className={`admin-sidebar-overlay ${isOpen ? 'visible' : ''}`}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Kontainer utama sidebar */}
      <aside className={`admin-sidebar ${isMobile ? (isOpen ? 'mobile-open' : '') : ''}`}>
        {/* Header sidebar dengan logo dan judul */}
        <div className="admin-sidebar-header">
          <img 
            src="/logo_boladuwit.png" 
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
        
        {/* Navigasi menu sidebar */}
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
              title={item.label}
            >
              {/* Ikon menu */}
              <span className="admin-sidebar-icon" aria-hidden="true">
                {item.icon}
              </span>
              {/* Label menu */}
              <span className="admin-sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        
        {/* Footer sidebar (dapat digunakan untuk informasi tambahan) */}
        <div className="admin-sidebar-footer" style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-gray-200)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-gray-500)'
        }}>
          {/* Konten footer dapat ditambahkan di sini */}
        </div>
      </aside>
    </>
  );
}