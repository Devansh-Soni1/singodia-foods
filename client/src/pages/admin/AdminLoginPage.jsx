import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in as admin, redirect directly to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      
      if (res.user?.role !== 'admin') {
        setError('Unauthorized: This account does not have administrator privileges. Please login with an authorized admin account.');
        return;
      }

      // Successful admin login
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid administrator email or master password. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d221a] flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      
      {/* Background Subtle Heritage Accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-lg mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
            Singodhia Foods
          </h1>
          <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mt-1">
            Admin Control Center • एडमिन पोर्टल
          </p>
          <p className="text-[11px] text-emerald-200/70 mt-1 max-w-xs mx-auto">
            Authorized administrative access for products, orders, coupons & store settings.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#143025] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-start gap-2.5 text-red-200 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-emerald-100 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@singodhiafoods.com"
                  className="w-full pl-10 pr-3.5 py-3 text-xs bg-[#0b1c15] text-white border border-emerald-700/60 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-emerald-500/50"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-100 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 text-xs bg-[#0b1c15] text-white border border-emerald-700/60 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-emerald-500/50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint for the Administrator */}
          <div className="mt-5 pt-4 border-t border-emerald-800/60 text-center">
            <p className="text-[11px] text-emerald-300/80">
              Default Admin: <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300 font-mono">admin@singodhiafoods.com</code>
            </p>
          </div>
        </div>

        {/* Back to store navigation */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Return to Singodhia Foods Storefront</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;

