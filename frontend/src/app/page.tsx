'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import ProductsSection from '@/components/ProductsSection';
import AboutSection from '@/components/AboutSection';
import CategoryGridSection from '@/components/CategoryGridSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import DetailModal, { ModalContent } from '@/components/DetailModal';
import CartDrawer from '@/components/CartDrawer';
import { Product } from '@/lib/products';

export default function Home() {
  // ── Detail Drawer (Our Story, Cold-Chain, Product details) ─────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalContent, setActiveModalContent] = useState<ModalContent | null>(null);

  // ── Shopping Cart Drawer ────────────────────────────────────────────────────
  const [cartOpen, setCartOpen] = useState(false);

  const openModal = (content: ModalContent) => {
    setActiveModalContent(content);
    setModalOpen(true);
  };

  /** Map a Product to a ModalContent for the detail drawer */
  const handleSelectProduct = (product: Product) => {
    openModal({
      title: product.name,
      subtitle: `${product.category} • ${product.unit} • ${product.priceLabel}`,
      category: 'Product Details',
      image: product.image,
      bodyParagraphs: [
        product.description,
        'Processed with zero chemical additives, preservatives, or artificial colors at our Shoolagiri farm.',
        'Orders placed before 8:00 PM are delivered fresh to your doorstep by 7:00 AM the next morning.',
      ],
      bulletPoints: [
        'Sourced from free-roaming, grass-fed native Gir & Sahiwal cows',
        'Zero synthetic hormones or preventative antibiotics',
        'Chilled to 4°C within 30 minutes of hands-free milking',
        'Packaged in sanitized eco glass bottles — zero plastic contact',
      ],
      ctaLabel: `Order ${product.name} on WhatsApp`,
      whatsappMessage: `Hello Aranya Dairy Farm, I would like to order ${product.name} (${product.priceLabel} / ${product.unit}).`,
    });
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
        'Every morning, our raw whole milk and traditional hand-churned Bilona ghee are delivered directly from our farm to your home table.',
      ],
      bulletPoints: [
        '100% Free-roaming Gir & Sahiwal native cows',
        'Natural organic diet rich in napier grass & herbs',
        'Ethical calf-first milking philosophy',
        'Zero plastic contact; 100% eco glass bottle packaging',
      ],
      ctaLabel: 'Inquire via WhatsApp',
      whatsappMessage:
        'Hello Aranya Dairy Farm, I would like to learn more about your farm story and products.',
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
        'For daily subscription inquiries, bulk orders, or farm visits, reach out to our team directly via WhatsApp or phone call.',
      ],
      bulletPoints: [
        'Location: Shoolagiri, Hosur Highway, Krishnagiri DT, Tamil Nadu 635117',
        'Phone & WhatsApp: +91 98765 43210',
        'Email: info@aranyadairyfarm.com',
        'Daily Morning Delivery: 5:30 AM – 7:30 AM',
      ],
      ctaLabel: 'Contact on WhatsApp',
      whatsappMessage:
        'Hello Aranya Dairy Farm, I would like to inquire about farm location and delivery service.',
    });
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] font-sans antialiased text-[#1C241E] flex flex-col selection:bg-[#1B4D2E] selection:text-white">

      {/* Header */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
      />

      {/* Hero — Image 1 template */}
      <Hero />

      {/* Forest-green announcement bar — Image 2 template */}
      <AnnouncementBanner onLearnMore={handleOpenStory} />

      {/* Best Sellers product grid — Image 2 template */}
      <ProductsSection onSelectProduct={handleSelectProduct} />

      {/* Split feature section — Image 3 template */}
      <AboutSection onOpenColdChain={openModal} />

      {/* "What We Do" category grid — Images 4 & 5 template */}
      <CategoryGridSection onOpenStory={openModal} />

      {/* Farm gallery */}
      <GallerySection />

      {/* Customer testimonials */}
      <TestimonialsSection />

      {/* Contact & inquiry form */}
      <ContactSection />

      {/* Footer */}
      <Footer onOpenStory={handleOpenStory} onOpenContact={handleOpenContact} />

      {/* Floating WhatsApp bubble */}
      <WhatsAppCTA />

      {/* Detail / Story drawer (behind-the-button) */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={activeModalContent}
      />

      {/* Shopping cart slide-in drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    </main>
  );
}
