'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import ProductsSection from '@/components/ProductsSection';
import AboutSection from '@/components/AboutSection';
import CategoryGridSection from '@/components/CategoryGridSection';
import Footer from '@/components/Footer';
import DetailModal, { ModalContent } from '@/components/DetailModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalContent, setActiveModalContent] = useState<ModalContent | null>(null);

  const openModal = (content: ModalContent) => {
    setActiveModalContent(content);
    setModalOpen(true);
  };

  const handleOpenStory = () => {
    openModal({
      title: 'Our 9-Year Heritage Story',
      subtitle: 'Pure A2 Organic Farming in Shoolagiri',
      category: 'Our Heritage',
      image: '/images/nature_hero_pasture.jpg',
      bodyParagraphs: [
        'Established in 2017, Aranya Organic Dairy Farm has led the movement for unadulterated, grass-fed A2 dairy in Shoolagiri.',
        'Our native breed cows graze freely across lush green pastures, living stress-free in harmony with natural rhythms. We strictly prohibit chemical hormones, synthetic growth stimulants, and routine preventative antibiotics.',
        'Every morning, our raw whole milk and traditional hand-churned Bilona ghee are delivered directly from our farm to your home table.'
      ],
      bulletPoints: [
        '100% Free-roaming Gir & Sahiwal native cows',
        'Natural organic diet rich in napier grass & herbs',
        'Ethical calf-first milking philosophy',
        'Zero plastic contact; 100% eco glass bottle packaging'
      ],
      ctaLabel: 'Inquire via WhatsApp',
      whatsappMessage: 'Hello Aranya Dairy Farm, I would like to learn more about your farm story and products.'
    });
  };

  const handleOpenContact = () => {
    openModal({
      title: 'Farm Location & Contact',
      subtitle: 'Visit or Inquire Directly',
      category: 'Contact Us',
      image: '/images/nature_hero_pasture.jpg',
      bodyParagraphs: [
        'We welcome our patrons to experience our sustainable farming practices firsthand at Shoolagiri, Tamil Nadu.',
        'For daily subscription inquiries, bulk orders, or farm visits, reach out to our team directly via WhatsApp or phone call.'
      ],
      bulletPoints: [
        'Location: Shoolagiri, Hosur Highway, Krishnagiri DT, Tamil Nadu 635117',
        'Phone & WhatsApp: +91 98765 43210',
        'Email: info@aranyadairyfarm.com',
        'Daily Morning Delivery: 5:30 AM – 7:30 AM'
      ],
      ctaLabel: 'Contact on WhatsApp',
      whatsappMessage: 'Hello Aranya Dairy Farm, I would like to inquire about farm location and delivery service.'
    });
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] font-sans antialiased text-[#1C241E] flex flex-col selection:bg-[#1B4D2E] selection:text-white">
      {/* Header */}
      <Header
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
      />

      {/* Hero Section matching Image 1 */}
      <Hero />

      {/* Announcement Banner matching Image 2 */}
      <AnnouncementBanner onLearnMore={handleOpenStory} />

      {/* Best Sellers Products Grid matching Image 2 */}
      <ProductsSection onSelectProduct={openModal} />

      {/* Split Feature Section matching Image 3 */}
      <AboutSection onOpenColdChain={openModal} />

      {/* "What We Do" Grid with line-art icons matching Images 4 & 5 */}
      <CategoryGridSection onOpenStory={openModal} />

      {/* Footer */}
      <Footer
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
      />

      {/* Behind-the-Button Drawer Modal */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={activeModalContent}
      />
    </main>
  );
}
