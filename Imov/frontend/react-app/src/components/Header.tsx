import React from 'react';
import { Home, User, Menu, X, Building2, UserCircle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import type { PageType } from '../types/Index.ts';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCurrentPage: (page: PageType) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen,
  setCurrentPage
}) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleProtectedRoute = (page: PageType): void => {
    if (!isAuthenticated) {
      setCurrentPage('login'); // Navega para página de login
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Home className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-sky-600">Imov</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-gray-700 hover:text-sky-600 transition"
            >
              Início
            </button>
            
            <button 
              onClick={() => handleProtectedRoute('my-ads')}
              className="text-gray-700 hover:text-sky-600 transition flex items-center gap-1"
            >
              <Building2 className="w-4 h-4" />
              Meus Anúncios
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleProtectedRoute('profile')}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-600 transition"
                >
                  <UserCircle className="w-5 h-5" />
                  {user?.name || 'Usuário'}
                </button>
                <Button onClick={logout} variant="outline">
                  Sair
                </Button>
              </div>
            ) : (
              <Button onClick={() => setCurrentPage('login')} icon={User} variant="primary">
                Entrar
              </Button>
            )}
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
            <button 
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
              className="block text-gray-700 hover:text-sky-600 w-full text-left"
            >
              Início
            </button>
            
            <button 
              onClick={() => {
                handleProtectedRoute('my-ads');
                setMobileMenuOpen(false);
              }}
              className="block text-gray-700 hover:text-sky-600 w-full text-left"
            >
              Meus Anúncios
            </button>
            
            {isAuthenticated ? (
              <div className="pt-3 border-t space-y-2">
                <button
                  onClick={() => {
                    handleProtectedRoute('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="block text-gray-700 hover:text-sky-600 w-full text-left"
                >
                  Perfil
                </button>
                <p className="text-sm text-gray-600">Olá, {user?.name || 'Usuário'}</p>
                <Button onClick={logout} variant="outline" fullWidth>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="pt-3 border-t">
                <Button onClick={() => setCurrentPage('login')} variant="primary" fullWidth>
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
