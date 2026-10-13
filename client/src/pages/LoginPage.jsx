import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user?.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-14 sm:py-20 bg-[#FAF6EF] min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3 group">
            <img src="/logo.png" alt="Singodhia Foods" className="h-24 sm:h-28 w-auto mx-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-extrabold text-charcoal font-serif">Welcome Back</h1>
          <p className="text-xs text-earth-brown mt-1">
            Sign in to track orders, saved addresses, and favorite pickles.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-light disabled:opacity-50 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-cream-200 text-center text-xs text-earth-brown space-y-2">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-green hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

