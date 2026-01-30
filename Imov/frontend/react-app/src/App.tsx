import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './AppRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;