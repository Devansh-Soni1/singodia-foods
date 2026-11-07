import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Store, KeyRound, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const [step, setStep] = useState('PASSWORD'); // 'PASSWORD' | 'OTP'
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Timer states
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0); // 30s cooldown for resending

  const otpInputRef = useRef(null);
  const { adminRequestOtp, adminVerifyOtp, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in as admin, redirect directly to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Focus OTP input when stepping into OTP view
  useEffect(() => {
    if (step === 'OTP' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Countdown timer for OTP expiry and resend cooldown
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => Math.max(0, prev - 1));
        setResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Format seconds into MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Step 1: Submit Password & Request Telegram OTP
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!password.trim()) {
      setError('कृपया स्टोर एडमिन पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const res = await adminRequestOtp(password.trim());
      if (res?.success) {
        setStep('OTP');
        setTimer(res.expiresIn || 300);
        setResendCooldown(30);
        setSuccessMsg(res.message || 'Telegram Bot (@singodhia_orders_bot) पर 6-अंकों का OTP भेजा गया है।');
      } else {
        setError(res?.message || 'अमान्य पासवर्ड! कृपया सही पासवर्ड दर्ज करें।');
      }
    } catch (err) {
      setError(err?.message || 'गलत पासवर्ड! कृपया सही स्टोर एडमिन पासवर्ड दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP to Telegram
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await adminRequestOtp(password.trim());
      if (res?.success) {
        setTimer(res.expiresIn || 300);
        setResendCooldown(30);
        setSuccessMsg('नया OTP आपके Telegram पर भेज दिया गया है।');
      } else {
        setError(res?.message || 'OTP पुनः भेजने में असमर्थ।');
      }
    } catch (err) {
      setError(err?.message || 'OTP पुनः भेजने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP & Open Admin Panel
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('कृपया पूरा 6-अंकों का OTP दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const res = await adminVerifyOtp(password.trim(), cleanOtp);
      if (res?.success && res.token) {
        setSuccessMsg('OTP सत्यापित हो गया! एडमिन पैनल खुल रहा है...');
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 500);
      } else {
        setError(res?.message || 'अमान्य OTP! कृपया Telegram पर आया सही कोड दर्ज करें।');
      }
    } catch (err) {
      setError(err?.message || 'अमान्य OTP! कृपया Telegram पर आया सही कोड दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d221a] flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden select-none">
      
      {/* Background Subtle Heritage Accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Decorative ambient green/amber glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-xl mb-3.5 border border-amber-300/40">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
            Singodhia Foods
          </h1>
          <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mt-1">
            Admin Control Center • 2-Factor Security
          </p>
          <p className="text-[11.5px] text-emerald-200/80 mt-1 max-w-xs mx-auto">
            {step === 'PASSWORD' 
              ? 'एडमिन पैनल खोलने के लिए केवल पासवर्ड दर्ज करें।' 
              : 'टेलीग्राम पर प्राप्त 6-अंकों का सुरक्षा कोड दर्ज करें।'}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#143025] border border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Subtle top golden light line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-950/80 border border-red-500/60 rounded-xl flex items-start gap-2.5 text-red-200 text-xs font-semibold leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Info Alert */}
          {successMsg && !error && (
            <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-400/60 rounded-xl flex items-start gap-2.5 text-emerald-200 text-xs font-semibold leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 1: PASSWORD ONLY (कोई ईमेल दर्ज करने की आवश्यकता नहीं) */}
          {/* ========================================================== */}
          {step === 'PASSWORD' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-100 flex items-center justify-between mb-1.5">
                  <span>Admin Password (एडमिन पासवर्ड)</span>
                  <span className="text-[10px] text-amber-300 font-medium">केवल पासवर्ड आवश्यक</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/80" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="एडमिन पासवर्ड दर्ज करें..."
                    className="w-full pl-10 pr-10 py-3.5 text-sm bg-[#0b1c15] text-white border border-emerald-700/70 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all placeholder:text-emerald-500/50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-white transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Informative pill about Telegram OTP */}
              <div className="bg-[#0b1c15]/90 border border-emerald-800/80 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-emerald-200/90">
                <div className="w-7 h-7 rounded-lg bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center shrink-0 font-black">
                  ✈
                </div>
                <div className="leading-tight">
                  पासवर्ड डालने के बाद आपके <b>Telegram Bot</b> पर 6-अंकों का OTP भेजा जाएगा।
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 disabled:opacity-50 text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>पासवर्ड सत्यापित कर रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <span>Telegram पर OTP भेजें (Send OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ========================================================== */
            /* STEP 2: TELEGRAM OTP VERIFICATION                         */
            /* ========================================================== */
            <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in duration-300">
              
              {/* Telegram Verified Destination Banner */}
              <div className="bg-[#229ED9]/15 border border-[#229ED9]/40 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#64B5F6]">
                  <span className="text-base">📱</span>
                  <div>
                    <span className="font-bold text-white block">Singodia Foods Telegram Bot</span>
                    <span className="text-[10px] text-emerald-200/80">@singodhia_orders_bot</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('PASSWORD');
                    setError('');
                    setOtp('');
                  }}
                  className="text-[11px] text-amber-300 hover:underline font-bold"
                >
                  पासवर्ड बदलें
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-100 flex items-center justify-between mb-1.5">
                  <span>Enter 6-Digit Telegram OTP</span>
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    ⏱️ {formatTimer(timer)}
                  </span>
                </label>

                {/* 6-Digit Centered Monospace Input */}
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtp(val);
                  }}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.55em] text-2xl font-mono font-black py-3 bg-[#0b1c15] text-amber-300 border-2 border-emerald-600 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition-all placeholder:tracking-widest placeholder:text-emerald-700"
                />
              </div>

              {/* Resend OTP Bar */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-emerald-300/70">
                  {timer === 0 ? 'OTP समाप्त हो गया है।' : 'OTP प्राप्त नहीं हुआ?'}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-amber-300 hover:text-amber-200 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 ? `${resendCooldown}s बाद पुनः भेजें` : 'OTP पुनः भेजें (Resend)'}
                  </span>
                </button>
              </div>

              {/* Verify & Open Admin Dashboard Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || timer === 0}
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-800 disabled:opacity-50 text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>OTP सत्यापित कर रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <span>लॉगिन करें और एडमिन पैनल खोलें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Quick Credential Hint for the Administrator */}
          <div className="mt-5 pt-4 border-t border-emerald-800/60 text-center">
            <p className="text-[11px] text-emerald-300/80">
              सुरक्षित 2FA एडमिन लॉगिन • Singodhia Foods Rajasthan
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
