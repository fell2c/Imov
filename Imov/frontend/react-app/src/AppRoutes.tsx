import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyAdsPage } from './pages/MyAdsPage';
import { ProfilePage } from './pages/ProfilePage';
import type { PageType } from './types/Index.ts';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && (currentPage === 'my-ads' || currentPage === 'profile')) {
    setTimeout(() => setCurrentPage('login'), 0);
    return null;
  }

  if (currentPage === 'home') {
    return <HomePage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'login') {
    return <LoginPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'my-ads' && isAuthenticated) {
    return <MyAdsPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'profile' && isAuthenticated) {
    return <ProfilePage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage setCurrentPage={setCurrentPage} />;
  }

  return <HomePage setCurrentPage={setCurrentPage} />;
};
