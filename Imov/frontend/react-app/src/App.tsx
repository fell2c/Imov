import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

// Type para as páginas disponíveis
type PageType = 'home' | 'login';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' ? (
        <HomePage setCurrentPage={setCurrentPage} />
      ) : (
        <LoginPage setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

export default App;