import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '208404157999-c4bua2va504tlvpj4qnc2udcj4iho6ud.apps.googleusercontent.com';

export const GoogleAuthButton = ({ redirectPath = '/account', promptOneTap = true }) => {
  const googleBtnRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let checkInterval = null;

    const initializeGoogleAuth = () => {
      if (!window.google?.accounts?.id) return false;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render official Google Sign-In Button
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: googleBtnRef.current.offsetWidth || 320
          });
        }

        // Trigger Google One-Tap floating prompt
        if (promptOneTap) {
          window.google.accounts.id.prompt();
        }

        return true;
      } catch (err) {
        console.warn('Google GSI initialization error:', err);
        return false;
      }
    };

    if (!initializeGoogleAuth()) {
      // Poll briefly for Google script to finish loading asynchronously
      checkInterval = setInterval(() => {
        if (initializeGoogleAuth()) {
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [promptOneTap]);

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) {
      toast.error('Google token प्राप्त नहीं हुआ। कृपया दोबारा प्रयास करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin(response.credential);
      toast.success(`Google से लॉगिन सफल! स्वागत है ${res.user?.name || ''} जी 🙏`, {
        id: 'google-login-success',
        duration: 4000
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Google लॉगिन विफल रहा। कृपया दोबारा प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div 
        ref={googleBtnRef} 
        className="w-full flex justify-center items-center min-h-[44px]"
      />
      {loading && (
        <p className="text-center text-[11px] font-semibold text-brand-green animate-pulse">
          Google अकाउंट सत्यापित हो रहा है...
        </p>
      )}
    </div>
  );
};

export default GoogleAuthButton;

