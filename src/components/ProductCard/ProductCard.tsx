import type { Product } from '../../types/schema';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name}
        className="product-card-image"
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">Rp{product.price.toLocaleString('id-ID')}</p>
        <div className="product-card-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={i < product.rating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="rating-count">{product.reviewCount}</span>
        </div>
      </div>
    </div>
  );
}