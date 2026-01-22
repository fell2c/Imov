import React from 'react';
import { Home, User, Menu, X } from 'lucide-react';
import { Button } from './Button';
import type { HeaderProps } from '../types/Index';

export const Header: React.FC<HeaderProps> = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  setCurrentPage 
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-sky-600">Imov</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button className="text-gray-700 hover:text-sky-600 transition">
              Comprar
            </button>
            <button className="text-gray-700 hover:text-sky-600 transition">
              Alugar
            </button>
            <button className="text-gray-700 hover:text-sky-600 transition">
              Anunciar
            </button>
            <Button
              onClick={() => setCurrentPage('login')}
              icon={User}
              variant="primary"
            >
              Entrar
            </Button>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <button className="block text-gray-700 hover:text-sky-600 w-full text-left">
              Comprar
            </button>
            <button className="block text-gray-700 hover:text-sky-600 w-full text-left">
              Alugar
            </button>
            <button className="block text-gray-700 hover:text-sky-600 w-full text-left">
              Anunciar
            </button>
            <Button
              onClick={() => setCurrentPage('login')}
              variant="primary"
              fullWidth
            >
              Entrar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};