'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickActionTileRow from '@/components/QuickActionTileRow';
import FeaturedCategoriesSection from '@/components/FeaturedCategoriesSection';
import FeaturedProductsPreview from '@/components/FeaturedProductsPreview';
import ConsolidatedTrustAndStorySection from '@/components/ConsolidatedTrustAndStorySection';
import Footer from '@/components/Footer';
import DetailModal, { ModalContent } from '@/components/DetailModal';
import QuickViewModal from '@/components/QuickViewModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Product, getProductPriceLabel, PRODUCTS } from '@/lib/products';
import { getProducts } from '@/lib/catalog';
import { WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import { PRIMARY_FARM_EMAIL } from '@/lib/contact';

export default function Home() {
  // ── Detail Drawer (Our Story, Cold-Chain, Product details) ─────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalContent, setActiveModalContent] = useState<ModalContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Quick View Modal State ──────────────────────────────────────────────────
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // ── Live Products for Featured Showcase ─────────────────────────────────────
  const [liveProducts, setLiveProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    getProducts().then((prods) => {
      if (prods && prods.length > 0) {
        setLiveProducts(prods);
      }
    });
  }, []);

  const openModal = (content: ModalContent) => {
    setActiveModalContent(content);
    setModalOpen(true);
  };

  /** Open centered Product Showcase Modal */
  const handleSelectProduct = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleOpenStory = () => {
    setSelectedProduct(null);
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
    setSelectedProduct(null);
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
        `Phone & WhatsApp: ${WHATSAPP_DISPLAY}`,
        `Email: ${PRIMARY_FARM_EMAIL}`,
        'Daily Morning Delivery: 5:30 AM – 7:30 AM',
      ],
      ctaLabel: 'Contact on WhatsApp',
      whatsappMessage:
        'Hello Aranya Dairy Farm, I would like to inquire about farm location and delivery service.',
    });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">

      {/* Header Bar with Logo, Nav Links & Cart */}
      <Header
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
      />

      {/* Section 1: Hero Section (Simplified with single "Shop Now" CTA) */}
      <Hero />

      {/* Section 2: Quick-Action Tile Row (App-Style 4 Shortcut Hub) */}
      <QuickActionTileRow />

      {/* Section 3: Featured Categories Showcase */}
      <FeaturedCategoriesSection products={liveProducts} />

      {/* Section 4: Farm Favorites Showcase */}
      <FeaturedProductsPreview
        products={liveProducts}
        onSelectProduct={handleSelectProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Section 5: Consolidated Trust & Story Section */}
      <ConsolidatedTrustAndStorySection />

      {/* Dark 3-Column Footer */}
      <Footer onOpenStory={handleOpenStory} onOpenContact={handleOpenContact} />

      {/* Mobile Persistent Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenContact={handleOpenContact}
      />

      {/* Detail / Story drawer */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        content={activeModalContent}
        product={selectedProduct}
      />

      {/* Fast Quick-View modal */}
      <QuickViewModal
        isOpen={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </main>
  );
}
