import React from 'react';
import { Flame } from 'lucide-react';

export const SpiceMeter = ({ level = 'Medium', size = 'sm' }) => {
  const levels = {
    'Mild': { count: 1, color: 'text-amber-500 bg-amber-50 border-amber-200', label: 'Mild Spice' },
    'Medium': { count: 2, color: 'text-orange-500 bg-orange-50 border-orange-200', label: 'Medium Spice' },
    'Spicy': { count: 3, color: 'text-red-500 bg-red-50 border-red-200', label: 'Spicy' },
    'Extra Spicy': { count: 4, color: 'text-red-700 bg-red-100 border-red-300', label: 'Teekha / Extra Spicy' },
  };

  const config = levels[level] || levels['Medium'];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4].map((idx) => (
          <Flame
            key={idx}
            className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              idx <= config.count ? 'fill-current opacity-100' : 'opacity-20'
            }`}
          />
        ))}
      </div>
      <span>{config.label}</span>
    </div>
  );
};

export default SpiceMeter;

