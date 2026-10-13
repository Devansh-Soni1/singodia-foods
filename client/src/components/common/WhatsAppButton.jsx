import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const WhatsAppButton = ({ phoneNumber = '919876543210' }) => {
  const [activeNumber, setActiveNumber] = useState(phoneNumber);

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings?.whatsappNumber) {
          setActiveNumber(res.settings.whatsappNumber);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchNumber();
  }, [phoneNumber]);

  const message = encodeURIComponent('Namaste Singodhia Foods! I have a query regarding your homemade pickles.');
  const whatsappUrl = `https://wa.me/${activeNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Singodhia Foods on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-1">
        Order on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;

