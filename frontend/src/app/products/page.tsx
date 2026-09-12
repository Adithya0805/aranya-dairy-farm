'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ProductsSection from '@/components/ProductsSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import DetailModal, { ModalContent } from '@/components/DetailModal';
import QuickViewModal from '@/components/QuickViewModal';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Product, getProductPriceLabel } from '@/lib/products';
import { ArrowLeft, Sparkles } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  // Update selected category when query parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Modals & Cart State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalContent, setActiveModalContent] = useState<ModalContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const openModal = (content: ModalContent) => {
    setActiveModalContent(content);
    setModalOpen(true);
  };

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

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">
      {/* Header Bar */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenStory={handleOpenStory}
        onOpenContact={handleOpenContact}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Subpage Breadcrumb & Hero Banner */}
      <div className="bg-[#122E1B] text-[#FAF7F2] py-10 sm:py-14 border-b border-[#E58A13]/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#122E1B]/80 to-black/50 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-sans text-[#A8B7AA]">
            <a href="/" className="hover:text-[#E58A13] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
            <span>/</span>
            <span className="text-[#FAF7F2] font-semibold">All Products</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#E58A13] font-semibold">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Farm Provisions Showcase • மளிகைப் பட்டியல்</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              All Farm Products
            </h1>
            <p className="text-xs sm:text-sm text-[#D1DDD3] font-sans max-w-2xl leading-relaxed">
              Browse our complete harvest of unadulterated A2 dairy, Vedic Bilona ghee, indigenous millets, and unpolished pulses from Shoolagiri.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges Row */}
      <TrustBadgesSection />

      {/* Complete Product Catalog Grid */}
      <ProductsSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSelectProduct={handleSelectProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
        onProductsLoaded={setLiveProducts}
      />

      {/* Footer */}
      <Footer onOpenStory={handleOpenStory} onOpenContact={handleOpenContact} />

      {/* Floating WhatsApp CTA */}
      <WhatsAppCTA />

      {/* Mobile Persistent Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
        onOpenContact={handleOpenContact}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
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

      {/* Quick-View Modal */}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-sm font-sans font-semibold text-[#15321E]">
            Loading Products Showcase...
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
