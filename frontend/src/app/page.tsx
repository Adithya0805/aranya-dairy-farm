'use client';

import React, { useState, useEffect } from 'react';
import HubHero from '@/components/HubHero';
import DetailViewWrapper from '@/components/DetailViewWrapper';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeView, setActiveView] = useState<string>('hub');

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['about', 'products', 'process', 'reviews', 'contact'].includes(hash)) {
        setActiveView(hash);
      } else if (!hash) {
        setActiveView('hub');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectSection = (sectionId: string) => {
    setActiveView(sectionId);
    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActiveView('hub');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans antialiased text-[#1E293B]">
      {activeView === 'hub' ? (
        <HubHero onSelectSection={handleSelectSection} />
      ) : (
        <DetailViewWrapper
          title={
            activeView === 'about'
              ? 'Our 9-Yr Story'
              : activeView === 'products'
              ? 'A2 Products Catalog'
              : activeView === 'process'
              ? 'Hygiene & Cold-Chain Process'
              : activeView === 'reviews'
              ? 'Customer Reviews & Ratings'
              : 'Farm Location & Inquiry'
          }
          onBackToHub={handleBackToHub}
        >
          {activeView === 'about' && (
            <>
              <AboutSection />
              <GallerySection />
            </>
          )}

          {activeView === 'products' && (
            <ProductsSection />
          )}

          {activeView === 'process' && (
            <>
              <AboutSection />
              <GallerySection />
            </>
          )}

          {activeView === 'reviews' && (
            <TestimonialsSection />
          )}

          {activeView === 'contact' && (
            <ContactSection />
          )}

          <Footer />
        </DetailViewWrapper>
      )}

      {/* Persistent Floating WhatsApp CTA */}
      <WhatsAppCTA />
    </div>
  );
}
