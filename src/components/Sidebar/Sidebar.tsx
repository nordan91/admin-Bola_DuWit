import type { SidebarPromotion } from '../../types/schema';
import { SidebarCard } from './SidebarCard';
import './Sidebar.css';

interface SidebarProps {
  promotions: SidebarPromotion[];
}

export function Sidebar({ promotions }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-nav-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Home</span>
        </a>
        <a href="#" className="sidebar-nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Menu</span>
        </a>
      </nav>

      <div className="sidebar-promotions">
        {promotions.map((promo) => (
          <SidebarCard key={promo.id} promotion={promo} />
        ))}
      </div>

      <div className="sidebar-categories">
        <h3 className="sidebar-categories-title">Categories</h3>
      </div>
    </aside>
  );
}