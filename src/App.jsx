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
import { ProductProvider } from './context/ProductContext';
import ProductsPage from './pages/ProductsPage';
import LandingPage from './pages/LandingPage';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('landing');
  const { user } = useAuth();

  // If we are in landing mode and not logged in, show landing page
  if (currentView === 'landing' && !user) {
    return <LandingPage onStart={() => setCurrentView('admin')} />;
  }

  // If we are in admin mode but not logged in, show login
  if (currentView === 'admin' && !user) {
    return <LoginPage onBack={() => setCurrentView('landing')} />;
  }

  // If logged in, show app layout
  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'pos' && <POSPage />}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'orders' && <OrdersPage />}
      {activeTab === 'customers' && <CustomersPage />}
      {activeTab === 'products' && <ProductsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {['pos', 'dashboard', 'orders', 'customers', 'products', 'settings'].indexOf(activeTab) === -1 && (
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
          <ProductProvider>
            <AppContent />
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
