import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SearchSection } from './components/SearchSection/SearchSection';
import { HeroBanner } from './components/HeroBanner/HeroBanner';
import { ProductCard } from './components/ProductCard/ProductCard';
import { StoreCard } from './components/StoreCard/StoreCard';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { LoginPage } from './components/LoginPage/LoginPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { mockRootProps } from './mockData';
import './App.css';

function App() {
  const { nearbyStores, popularProducts, sidebarPromotions } = mockRootProps;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Header onAdminClick={() => {}} />
            <div className="app-layout">
              <Sidebar promotions={sidebarPromotions} />
              <main className="main-content">
                <SearchSection />
                <HeroBanner />

                <section className="content-section">
                  <div className="section-header">
                    <h2 className="section-title">UMKM Terdekat Anda</h2>
                  </div>
                  <div className="stores-grid">
                    {nearbyStores.map((store) => (
                      <StoreCard key={store.id} store={store} />
                    ))}
                  </div>
                </section>

                <section className="content-section">
                  <div className="section-header">
                    <h2 className="section-title">Produk Popular</h2>
                  </div>
                  <div className="products-grid">
                    {popularProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              </main>
            </div>
            <BottomNavigation />
          </div>
        } />
        <Route path="/login" element={<LoginPage onLoginSuccess={() => {}} />} />
        <Route path="/admin/*" element={<AdminDashboard onLogout={() => {}} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;