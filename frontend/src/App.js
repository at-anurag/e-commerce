import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsByCategory from './pages/ProductsByCategory';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';

// Context
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const { isAuthenticated, loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/category/:category" element={<ProtectedRoute><ProductsByCategory /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Admin Routes - Lazy Loaded */}
          <Route path="/admin" element={
            <AdminRoute>
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <Suspense fallback={<LoadingFallback />}>
                <AdminProducts />
              </Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <Suspense fallback={<LoadingFallback />}>
                <AdminOrders />
              </Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <Suspense fallback={<LoadingFallback />}>
                <AdminUsers />
              </Suspense>
            </AdminRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </CartProvider>
  );
};

export default App; 