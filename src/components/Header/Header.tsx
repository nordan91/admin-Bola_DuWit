import { useState } from 'react';
import './Header.css';

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="logo" onClick={onAdminClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="logo-text">Bola DuWit</span>
          </button>
          <nav className="nav-menu">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Map</a>
            <a href="#" className="nav-link">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button className="notification-btn" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}