import React from 'react';

export const AnnouncementBar = () => {
  const marqueeItems = [
    { prefix: 'Offers automatically applied ', bold: 'at checkout' },
    { prefix: 'Buy ', bold: '3 Get 3 Gifts' },
    { prefix: 'Extra ', bold: '3% Off on Prepaid orders' },
    { prefix: 'Buy 2 ', bold: 'Get Freeshipping' },
    { prefix: 'Buy 6 ', bold: 'Get Tote bag Free' },
  ];

  const renderMarqueeContent = () => (
    <div className="flex items-center space-x-6 sm:space-x-8 px-4 flex-shrink-0">
      {marqueeItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="text-[12px] sm:text-[13px] tracking-tight font-medium text-black whitespace-nowrap">
            {item.prefix}
            <strong className="font-extrabold">{item.bold}</strong>
          </span>
          <span className="text-black/50 font-normal select-none">|</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-[#f3a222] border-b border-[#e59415] overflow-hidden py-1.5 sm:py-2 select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {renderMarqueeContent()}
        {renderMarqueeContent()}
        {renderMarqueeContent()}
        {renderMarqueeContent()}
      </div>
    </div>
  );
};

export default AnnouncementBar;
