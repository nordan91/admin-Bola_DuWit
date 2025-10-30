import { useState } from 'react';
import type { Store } from '../../types/schema';
import './StoreCard.css';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="store-card">
      <img 
        src={store.image} 
        alt={store.name}
        className="store-card-image"
        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
      />
      <div className="store-card-content">
        <div className="store-card-header">
          <div>
            <h3 className="store-card-title">{store.name}</h3>
            <p className="store-card-description">{store.description}</p>
          </div>
          <div className="store-card-actions">
            <button className="store-action-btn" aria-label="More options" onClick={() => setShowMenu(!showMenu)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {showMenu && (
              <div className="store-menu">
                <button className="store-menu-item">View Details</button>
                <button className="store-menu-item">Add to Favorites</button>
                <button className="store-menu-item">Share</button>
              </div>
            )}
          </div>
        </div>
        <p className="store-card-price">Rp{store.price.toLocaleString('id-ID')}</p>
        <div className="store-card-footer">
          <button className="store-view-btn" aria-label="List view">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button className="store-view-btn" aria-label="Grid view">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button className="store-view-btn" aria-label="Shopping bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
          <button className="store-view-btn" aria-label="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}