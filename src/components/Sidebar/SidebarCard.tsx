import type { SidebarPromotion } from '../../types/schema';
import './SidebarCard.css';

interface SidebarCardProps {
  promotion: SidebarPromotion;
}

export function SidebarCard({ promotion }: SidebarCardProps) {
  return (
    <div className="sidebar-card">
      <img 
        src={promotion.image} 
        alt={promotion.shopName}
        className="sidebar-card-image"
        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
      />
      <div className="sidebar-card-content">
        <h4 className="sidebar-card-title">{promotion.shopName}</h4>
        {promotion.description && (
          <p className="sidebar-card-description">{promotion.description}</p>
        )}
        {promotion.price && (
          <p className="sidebar-card-price">Rp{promotion.price.toLocaleString('id-ID')}</p>
        )}
        {promotion.rating && promotion.reviewCount && (
          <div className="sidebar-card-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill={i < promotion.rating! ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="rating-count">{promotion.reviewCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}