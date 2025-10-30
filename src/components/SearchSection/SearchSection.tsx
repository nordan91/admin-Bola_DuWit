import { useState } from 'react';
import './SearchSection.css';

const FILTER_TABS = ['Produma', 'Minuman', 'Dertisian'];

export function SearchSection() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('Produma');

  const handleClearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="search-section">
      <div className="search-bar-wrapper">
        <svg className="search-bar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <input
          type="text"
          placeholder="Cari produk atau toko UMKM..."
          className="search-bar-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <button 
            className="search-clear-btn" 
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        )}
      </div>
      <div className="filter-tabs">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}