import './HeroBanner.css';

export function HeroBanner() {
  return (
    <div className="hero-banner">
      <img 
        src="https://images.unsplash.com/photo-1718567210695-9167e9cc19fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxmb29kJTIwc3ByZWFkJTIwYXNzb3J0ZWQlMjBzbmFja3MlMjB0cmFkaXRpb25hbCUyMHByb2R1Y3RzJTIwZm9vZCUyMHBob3RvZ3JhcGh5fGVufDB8MHx8fDE3NjEyMjY2NDF8MA&ixlib=rb-4.1.0&q=85"
        alt="Indonesian traditional food spread by Bernd Dittrich on Unsplash"
        className="hero-banner-bg"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="hero-banner-overlay"></div>
      <div className="hero-banner-content">
        <h2 className="hero-banner-title">Cari predtek atau toko UNMM</h2>
        <div className="hero-banner-actions">
          <div className="social-icons">
            <button className="social-icon-btn" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </button>
            <button className="social-icon-btn" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </button>
            <button className="social-icon-btn" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </button>
          </div>
          <button className="hero-cta-btn">Mulai</button>
        </div>
      </div>
    </div>
  );
}