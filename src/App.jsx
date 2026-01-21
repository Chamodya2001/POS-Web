import React, { useState } from 'react';
import Layout from './components/Layout';
import POSPage from './pages/POSPage';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'pos' && <POSPage />}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'orders' && <OrdersPage />}
      {activeTab === 'customers' && <CustomersPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {['pos', 'dashboard', 'orders', 'customers', 'settings'].indexOf(activeTab) === -1 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
          <p className="text-sm">The {activeTab} module is under development.</p>
        </div>
      )}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
