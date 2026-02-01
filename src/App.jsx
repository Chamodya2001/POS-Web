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
import AddEmploymentPage from './pages/AddEmploymentPage';
import AddCustomerPage from './pages/AddCustomerPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import EmployeeReportPage from './pages/EmployeeReportPage';
import { CandidateProvider } from './context/CandidateContext';
import SuppliersPage from './pages/SuppliersPage';
import AddSupplierPage from './pages/AddSupplierPage';
import StockManagementPage from './pages/StockManagementPage';
import AddStockPage from './pages/AddStockPage';
import CategoriesPage from './pages/CategoriesPage';
import StockHistoryPage from './pages/StockHistoryPage';



const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('landing');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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
      {activeTab === 'customers' && (
        <CustomersPage
          onAddCustomer={() => setActiveTab('add-customer')}
          onViewProfile={(id) => {
            setSelectedCustomerId(id);
            setActiveTab('customer-profile');
          }}
        />
      )}
      {activeTab === 'products' && <ProductsPage />}
      {activeTab === 'settings' && <SettingsPage />}
      {activeTab === 'employment' && <AddEmploymentPage />}
      {activeTab === 'employee-report' && <EmployeeReportPage />}
      {activeTab === 'add-customer' && <AddCustomerPage />}
      {activeTab === 'customer-profile' && <CustomerProfilePage customerId={selectedCustomerId} onBack={() => setActiveTab('customers')} />}

      {activeTab === 'suppliers' && (
        <SuppliersPage
          onAddSupplier={() => {
            setSelectedSupplier(null);
            setActiveTab('add-supplier');
          }}
          onEditSupplier={(supplier) => {
            setSelectedSupplier(supplier);
            setActiveTab('add-supplier');
          }}
        />
      )}

      {activeTab === 'add-supplier' && (
        <AddSupplierPage
          supplierToEdit={selectedSupplier}
          onBack={() => setActiveTab('suppliers')}
          onSuccess={() => setActiveTab('suppliers')}
        />
      )}

      {activeTab === 'stock' && (
        <StockManagementPage
          onAddStock={() => setActiveTab('add-stock')}
          onViewHistory={(id) => setActiveTab('stock-history')}
        />
      )}

      {activeTab === 'stock-history' && (
        <StockHistoryPage
          onBack={() => setActiveTab('stock')}
        />
      )}

      {activeTab === 'add-stock' && (
        <AddStockPage
          onBack={() => setActiveTab('stock')}
          onSuccess={() => setActiveTab('stock')}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesPage />
      )}

      {['pos', 'dashboard', 'orders', 'customers', 'products', 'settings', 'employment', 'employee-report', 'add-customer', 'customer-profile', 'suppliers', 'add-supplier', 'stock', 'add-stock', 'categories', 'stock-history'].indexOf(activeTab) === -1 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
          <p className="text-sm">The {activeTab} module is under development.</p>
        </div>
      )}
    </Layout>
  );
};

function App() {
  const candidateId = 4;
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <CandidateProvider candidateId={candidateId}>
              <AppContent />
            </CandidateProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
