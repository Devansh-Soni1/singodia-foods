import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export const AnnouncementBar = () => {
  const [customAnnouncement, setCustomAnnouncement] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings) {
          if (res.settings.announcementEnabled === false) {
            setIsEnabled(false);
          }
          if (res.settings.announcementText && res.settings.announcementText.trim()) {
            setCustomAnnouncement(res.settings.announcementText.trim());
          }
        }
      } catch (e) {
        // Fallback to default
      }
    };
    fetchAnnouncement();
  }, []);

  if (!isEnabled) return null;

  // Clean, authentic brand slogans (no hardcoded promotional promises or offers)
  const brandHeritageItems = [
    { prefix: '🌶️ 100% Traditional ', bold: 'Rajasthani Homemade Pickles' },
    { prefix: '🏺 Naturally Sun-Cured in ', bold: 'Ceramic Martabans' },
    { prefix: '🌾 Handcrafted with ', bold: 'Pure Kachi Ghani Mustard Oil' },
    { prefix: '✨ Authentic Dadi-Nani Recipe ', bold: 'Zero Preservatives' },
    { prefix: '📦 Dispatched Safely in ', bold: 'Bubble-Proof Packaging' }
  ];

  const renderMarqueeContent = () => (
    <div className="flex items-center space-x-8 sm:space-x-12 px-6 flex-shrink-0">
      {customAnnouncement ? (
        <>
          <span className="text-[12px] sm:text-[13px] tracking-tight font-bold text-gray-950 whitespace-nowrap">
            {customAnnouncement}
          </span>
          <span className="text-black/30 font-normal select-none">|</span>
          <span className="text-[12px] sm:text-[13px] tracking-tight font-medium text-gray-950 whitespace-nowrap">
            🌶️ Singodia Foods — <strong className="font-extrabold">स्वाद घर जैसा, परंपरा राजस्थान की</strong>
          </span>
          <span className="text-black/30 font-normal select-none">|</span>
        </>
      ) : (
        brandHeritageItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[12px] sm:text-[13px] tracking-tight font-medium text-gray-950 whitespace-nowrap">
              {item.prefix}
              <strong className="font-extrabold text-black">{item.bold}</strong>
            </span>
            <span className="text-black/30 font-normal select-none">|</span>
          </React.Fragment>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-[#f3a222] border-b border-[#e59415] overflow-hidden py-1.5 sm:py-2 select-none shadow-2xs">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default">
        {renderMarqueeContent()}
        {renderMarqueeContent()}
        {renderMarqueeContent()}
        {renderMarqueeContent()}
      </div>
    </div>
  );
};

export default AnnouncementBar;
