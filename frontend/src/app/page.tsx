'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import FeaturedCategoriesSection from '@/components/FeaturedCategoriesSection';
import FeaturedProductsPreview from '@/components/FeaturedProductsPreview';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import DetailModal, { ModalContent } from '@/components/DetailModal';
import QuickViewModal from '@/components/QuickViewModal';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Product, getProductPriceLabel } from '@/lib/products';

export default function Home() {
  // ── Detail Drawer (Our Story, Cold-Chain, Product details) ─────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalContent, setActiveModalContent] = useState<ModalContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Quick View Modal State ──────────────────────────────────────────────────
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // ── Shopping Cart Drawer ────────────────────────────────────────────────────
  const [cartOpen, setCartOpen] = useState(false);

  // ── Active Category for synchronization between Showcase and Shop Catalog ───
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  const openModal = (content: ModalContent) => {
    setActiveModalContent(content);
    setModalOpen(true);
  };

  /** Map a Product to a ModalContent for the detail drawer */
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const priceDisplay = getProductPriceLabel(product);
    openModal({
      title: `${product.name} (${product.nameTamil})`,
      subtitle: `${product.category} • ${product.unit} • ${priceDisplay}`,
      category: product.category,
      image: product.image,
      bodyParagraphs: [
        product.description ||
          `100% pure, farm-fresh ${product.name} (${product.nameTamil}) sourced directly from Aranya Organic Dairy Farm, Shoolagiri.`,
        'Processed with zero chemical additives, preservatives, or artificial colors at our Shoolagiri farm.',
        'Orders placed before 8:00 PM are delivered fresh to your doorstep by 7:00 AM the next morning.',
      ],
      bulletPoints: [
        `Local Grocery: ${product.nameTamil}`,
        `Packaging Unit: ${product.unit}`,
        `Current Status: ${priceDisplay}`,
        'Direct from Aranya Organic Dairy Farm, Shoolagiri',
      ],
      ctaLabel: `Inquire about ${product.name} on WhatsApp`,
      whatsappMessage: `Hello Aranya Dairy Farm, I would like to inquire about ${product.name} (${product.nameTamil}) [${product.unit}].`,
    });
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
        'Phone & WhatsApp: +91 98765 43210',
        'Email: info@aranyadairyfarm.com',
        'Daily Morning Delivery: 5:30 AM – 7:30 AM',
      ],
      ctaLabel: 'Contact on WhatsApp',
      whatsappMessage:
        'Hello Aranya Dairy Farm, I would like to inquire about farm location and delivery service.',
    });
  };

  const handleCategorySelection = (cat: string) => {
    setSelectedCategory(cat);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">

      {/* 1. Dark Header Bar with Brand Wordmark, Nav, & Cart */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
      />

      {/* 2. Hero Section with Full-Bleed Nature Photography & Amber Pill CTA */}
      <Hero />

      {/* 3. Trust Badge Row (9 Years Trusted, 100% Organic, Fresh Daily) */}
      <TrustBadgesSection />

      {/* 4. Featured Categories Showcase (Dairy, Rice & Millets, Pulses & Lentils) */}
      <FeaturedCategoriesSection onSelectCategory={handleCategorySelection} />

      {/* 5. Featured Products Preview with Pill Add to Cart */}
      <FeaturedProductsPreview
        products={liveProducts}
        onSelectProduct={handleSelectProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. Split About/Story Section with 3-Feature Row */}
      <AboutSection
        onOpenColdChain={openModal}
        onOpenStory={handleOpenStory}
      />

      {/* 7. Shop Catalog with Full-Bleed Photo Banner & Category Chips */}
      <ProductsSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSelectProduct={handleSelectProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
        onProductsLoaded={setLiveProducts}
      />

      {/* 8. Farm Life Gallery */}
      <GallerySection />

      {/* 9. Customer Testimonials */}
      <TestimonialsSection />

      {/* 10. Contact & Visit Inquiry Form */}
      <ContactSection />

      {/* 11. Redesigned 3-Column Dark Footer */}
      <Footer onOpenStory={handleOpenStory} onOpenContact={handleOpenContact} />

      {/* Floating WhatsApp CTA */}
      <WhatsAppCTA />

      {/* Mobile Persistent Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
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

      {/* Shopping cart slide-in drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    </main>
  );
}
