import { useState } from 'react';
import './BottomNavigation.css';

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="bottom-navigation">
      <button 
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M9 22V12h6v10"/>
        </svg>
        <span className="bottom-nav-label">Home</span>
      </button>
      
      <button 
        className={`bottom-nav-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => setActiveTab('search')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <span className="bottom-nav-label">Search</span>
      </button>
      
      <button className="bottom-nav-item bottom-nav-add">
        <div className="bottom-nav-add-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>
      
      <button 
        className={`bottom-nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
        onClick={() => setActiveTab('shopping')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span className="bottom-nav-label">Belanja</span>
      </button>
      
      <button 
        className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="bottom-nav-label">Profil</span>
      </button>
    </nav>
  );
}