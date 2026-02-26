import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyAdsPage } from './pages/MyAdsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import type { PageType } from './types/Index.ts';

// Adapter para manter compatibilidade com o setCurrentPage das suas páginas
const useSetCurrentPage = () => {
  const navigate = useNavigate();
  return (page: PageType) => {
    const routes: Record<PageType, string> = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'forgot-password': '/esqueci-senha',
      'my-ads': '/meus-anuncios',
      'profile': '/perfil',
    };
    navigate(routes[page]);
  };
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const HomePageWrapper = () => <HomePage setCurrentPage={useSetCurrentPage()} />;
const LoginPageWrapper = () => <LoginPage setCurrentPage={useSetCurrentPage()} />;
const RegisterPageWrapper = () => <RegisterPage setCurrentPage={useSetCurrentPage()} />;
const ForgotPasswordPageWrapper = () => <ForgotPasswordPage setCurrentPage={useSetCurrentPage()} />;
const MyAdsPageWrapper = () => <MyAdsPage setCurrentPage={useSetCurrentPage()} />;
const ProfilePageWrapper = () => <ProfilePage setCurrentPage={useSetCurrentPage()} />;

const AppRoutesInner: React.FC = () => {
  const { isLoading } = useAuth();

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

  return (
    <Routes>
      <Route path="/" element={<HomePageWrapper />} />
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/register" element={<RegisterPageWrapper />} />
      <Route path="/esqueci-senha" element={<ForgotPasswordPageWrapper />} />
      <Route path="/meus-anuncios" element={<PrivateRoute><MyAdsPageWrapper /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><ProfilePageWrapper /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <AppRoutesInner />
  </BrowserRouter>
);