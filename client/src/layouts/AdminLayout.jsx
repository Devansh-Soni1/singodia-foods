import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, FolderTree, Tag, 
  MessageSquare, Settings, ArrowLeft, LogOut, Menu, X, Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navLinks = [
    { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Pickle Products', icon: Package },
    { path: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/coupons', label: 'Discount Coupons', icon: Tag },
    { path: '/admin/reviews', label: 'Review Moderation', icon: MessageSquare },
    { path: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Header for Admin */}
      <div className="md:hidden bg-[#143025] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1 rounded text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-sm">Singodhia Admin</span>
        </div>
        <Link to="/" className="text-xs text-mustard font-bold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Store
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-[#143025] text-white flex-shrink-0 flex flex-col justify-between p-4 z-40 fixed md:sticky top-0 h-screen transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-6">
          {/* Brand Logo & Tag */}
          <div className="pt-2 px-2">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl">🏺</span>
              <div>
                <h2 className="text-base font-bold font-serif text-white tracking-wide">
                  SINGODIA FOODS
                </h2>
                <span className="text-[10px] text-mustard font-semibold uppercase tracking-wider block">
                  Admin Control Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Links list */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-mustard text-brand-green-dark shadow-xs'
                      : 'text-cream-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-cream-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>

          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;

