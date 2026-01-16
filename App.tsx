import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Component to handle scroll restoration on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/menu/:restaurantId/:tableNumber" 
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          } 
        />
        {/* Helper route for direct menu access */}
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-success" 
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}
