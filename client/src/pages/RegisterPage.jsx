import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Package, ArrowRight } from 'lucide-react';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import siteLogo from '../assets/logo.png';

export const RegisterPage = () => {
  return (
    <div className="py-14 sm:py-20 bg-[#FAF6EF] min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card text-center">
        
        {/* Brand Logo & Title */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3 group">
            <img 
              src={siteLogo} 
              alt="Singodia Foods" 
              className="h-24 sm:h-28 w-auto mx-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" 
              onError={(e) => { e.target.src = '/logo.png'; }} 
            />
          </Link>
          <h1 className="text-2xl font-extrabold text-charcoal font-serif">Create Your Account</h1>
          <p className="text-xs text-earth-brown mt-1">
            Sign up in 1-click with your Google account. Zero passwords required.
          </p>
        </div>

        {/* 1-Click Google Sign Up Button & One-Tap Prompt */}
        <div className="my-6 p-4 bg-cream-50/70 border border-cream-200 rounded-2xl">
          <p className="text-xs font-bold text-gray-700 mb-3">
            Quick Registration with Google:
          </p>
          <GoogleAuthButton redirectPath="/account" promptOneTap={true} />
        </div>

        {/* Value Proposition Badges */}
        <div className="space-y-2.5 text-left bg-[#FFFDF9] p-4 rounded-2xl border border-cream-200 text-xs text-gray-700">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Safe, Verified & Instant Account Setup</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">Zero Spam — No tedious form filling</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold">Instant Order Tracking & Delivery Alerts</span>
          </div>
        </div>

        {/* Link to Login */}
        <div className="mt-8 pt-6 border-t border-cream-200 text-center text-xs text-earth-brown">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-green hover:underline">
              Sign In with Google
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
