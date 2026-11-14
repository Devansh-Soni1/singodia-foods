import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { SubHeaderCategoryBar } from '../components/common/SubHeaderCategoryBar';
import { Footer } from '../components/common/Footer';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { CartDrawer } from '../components/common/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { BlinkitCartBar } from '../components/common/BlinkitCartBar';
import { RajasthaniAudioPlayer } from '../components/common/RajasthaniAudioPlayer';
import { CookieConsentBanner } from '../components/common/CookieConsentBanner';

export const MainLayout = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#22201D] relative w-full max-w-[100vw] overflow-x-hidden overflow-x-clip">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Responsive Header & Navigation */}
      <Navbar onOpenSearch={() => setSearchModalOpen(true)} />

      {/* 2.5 FarmDidi-Style Sub-Header Category Icons & Trust Strip */}
      <SubHeaderCategoryBar />

      {/* Main Content View */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 14. Complete Footer */}
      <Footer />

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <WhatsAppButton phoneNumber="917597966707" />

      {/* Blinkit-Style Floating Bottom Cart Bar */}
      <BlinkitCartBar />

      {/* Ambient Soft Rajasthani Background Tune with Mute/Unmute Control */}
      <RajasthaniAudioPlayer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
};

export default MainLayout;

