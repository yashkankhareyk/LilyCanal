import React from 'react';
import Header from '../components/Header';
import SaleBanner from '../components/SaleBanner';
import ProductGrid from '../components/ProductGrid';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SaleBanner />
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Products
          </h2>
          <ProductGrid />
        </div>
      </main>
      
      <footer className="bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 lilycanal.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;