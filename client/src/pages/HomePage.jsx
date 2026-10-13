import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';

export const HomePage = () => {
  return (
    <div className="space-y-0 min-h-[60vh]">
      {/* Hero Banner */}
      <HeroBanner />
    </div>
  );
};

export default HomePage;
