import React from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ShoppingBag className="w-8 h-8 text-gray-900 mr-2" />
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              style={{ fontFamily: 'Playfair Display, serif' }}
              onClick={() => navigate('/')}
            >
              lilycanal
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;