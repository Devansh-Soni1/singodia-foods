import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Smart Product & Category Route Handler
// If slug is a multi-product bundle/category like combo-packs, renders ShopPage.
// Otherwise renders ProductDetailPage with clean SEO URL (e.g. /product/mango-pickle/)
const ProductRouteHandler = () => {
  const { slug } = useParams();
  const cleanSlug = (slug || '').toLowerCase().replace(/\/$/, '');

  const isCategoryListing = [
    'combo-packs', 'all-products', 'all-pickles', 'trial-packs',
    'mango-pickle', 'mango-pickles',
    'red-chilli-pickle', 'red-chilli-pickles',
    'green-chilli-pickle', 'green-chilli-pickles',
    'lemon-pickle', 'lemon-pickles',
    'garlic-pickle', 'garlic-pickles',
    'mixed-pickle', 'mixed-pickles',
    'sweet-pickle', 'sweet-pickles',
    'jackfruit-pickle', 'jackfruit-pickles',
    'amla-pickle', 'amla-pickles',
    'ginger-pickle', 'ginger-pickles',
    'rajasthani-specials'
  ].includes(cleanSlug);

  if (isCategoryListing) {
    return <ShopPage />;
  }

  return <ProductDetailPage />;
};

// Protected Admin Route Guard (Strict Authentication & Authorization)
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="py-24 text-center min-h-screen flex items-center justify-center bg-[#FAF6EF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-600">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to dedicated admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not an admin -> Strict Access Denied screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0d221a] flex items-center justify-center p-4">
        <div className="bg-[#143025] rounded-3xl p-8 max-w-md w-full border border-red-500/40 shadow-2xl text-center space-y-4 text-white">
          <div className="w-16 h-16 bg-red-950/80 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            🔒
          </div>
          <h2 className="text-xl font-bold font-serif text-white">Admin Access Restricted</h2>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            This area is strictly restricted to authorized administrators. You are currently logged in with a non-admin account.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/admin/login" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs">
              Log in with Admin Account
            </Link>
            <Link to="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1F4D36',
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '13px',
            borderRadius: '14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px 18px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          },
          success: {
            iconTheme: {
              primary: '#D97706',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#991B1B',
              color: '#FFFFFF',
            },
          },
        }}
      />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              
              {/* Customer Front Storefront */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="shop/:categorySlug" element={<ShopPage />} />
                <Route path="shop/:categorySlug/:subCategorySlug" element={<ShopPage />} />
                <Route path="shop/taste/:subCategorySlug" element={<ShopPage />} />
                <Route path="category/:categorySlug" element={<ShopPage />} />
                <Route path="category/:categorySlug/:subCategorySlug" element={<ShopPage />} />
                <Route path="product/:slug" element={<ProductRouteHandler />} />
                <Route path="products/:slug" element={<ProductRouteHandler />} />
                <Route path="build-combo" element={<Navigate to="/shop" replace />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Dedicated Admin Login Page (Separate from customer login) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Control Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
