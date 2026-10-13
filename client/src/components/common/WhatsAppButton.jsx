import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const WhatsAppButton = ({ phoneNumber = '919782983909' }) => {
  const [activeNumber, setActiveNumber] = useState(phoneNumber);

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings?.whatsappNumber) {
          setActiveNumber(res.settings.whatsappNumber);
        }
      } catch (e) {
        // Fallback to prop
      }
    };
    fetchNumber();
  }, [phoneNumber]);

  const issueMessage = encodeURIComponent(
    'Namaste Singodhia Foods! Mujhe order / pickle products ke sambandh me query / issue ke liye help chahiye. Kripya meri sahayata karein.'
  );
  const whatsappUrl = `https://wa.me/${activeNumber}?text=${issueMessage}`;

  return (
    <aside aria-label="Customer Support">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Singodhia Foods Support on WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all duration-300 transform hover:scale-110 flex items-center gap-2.5 group cursor-pointer"
        title="Chat with Singodhia Foods Support on WhatsApp"
      >
        {/* Subtle breathing ripple glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />

        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366] relative z-10" />
        
        {/* Expandable text pill on hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs sm:text-sm font-extrabold tracking-wide pl-0 group-hover:pl-1 relative z-10">
          WhatsApp Support • सहायता
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppButton;

