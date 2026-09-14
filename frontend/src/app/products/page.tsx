'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { ArrowLeft, ArrowUp, Sparkles, Droplets, Heart, MessageCircle } from 'lucide-react';
import { WA_CATALOG_INQUIRY } from '@/lib/whatsapp';

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

      {/* ── Prominent Larger Breadcrumb Bar with Glassmorphic Effect ── */}
      <section className="bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#122E1B]/10 py-4 sm:py-5 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Breadcrumb Navigation - Quite Larger with Rich Interaction */}
            <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-2.5 sm:gap-3.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#15321E] hover:text-[#E58A13] font-sans text-sm sm:text-base font-semibold border border-[#122E1B]/10 shadow-xs transition-all duration-200 group active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#E58A13] group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </Link>

              <span className="text-[#E58A13] font-bold text-base sm:text-xl">/</span>

              <div className="inline-flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#15321E] tracking-tight">
                  All Products
                </span>
                {selectedCategory === 'All' && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#122E1B]/5 text-[#15321E] border border-[#122E1B]/10">
                    {liveProducts.length > 0 ? `${liveProducts.length} Farm Items` : 'Fresh Farm Items'}
                  </span>
                )}
              </div>

              {selectedCategory !== 'All' && (
                <>
                  <span className="text-[#E58A13] font-bold text-base sm:text-xl">/</span>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-sans font-bold bg-[#E58A13] text-white shadow-sm animate-in fade-in zoom-in-95 duration-150">
                    <span>{selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('All')}
                      className="hover:bg-white/25 rounded-full w-4 h-4 inline-flex items-center justify-center ml-0.5 cursor-pointer transition-colors"
                      title="Clear category filter"
                      aria-label="Clear category filter"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </nav>

            {/* Farm Fresh Status Pill on Right */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#5F6E62]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#122E1B]/10 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#1B4D2E] animate-pulse" />
                <span className="font-medium text-[#15321E]">Shoolagiri Pasture Harvest • 4°C Cold-Chain</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Complete Product Catalog Grid */}
      <ProductsSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSelectProduct={handleSelectProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
        onProductsLoaded={setLiveProducts}
      />

      {/* ── Bottom of Products List Showcase with Glassmorphism Effect ── */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FDFBF7] via-[#FAF7F2] to-[#F3EEE7] relative overflow-hidden border-t border-[#122E1B]/10">
        
        {/* Ambient Glowing Orbs behind the Glass (creates authentic glass refractive depth) */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E58A13]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[28rem] h-[28rem] rounded-full bg-[#1B4D2E]/35 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Glassmorphic Card */}
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-[#122E1B]/85 border border-white/20 shadow-[0_25px_60px_-15px_rgba(18,46,27,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)] p-8 sm:p-14 text-[#FAF7F2]">
            
            {/* Background pasture image showing subtly through the frosted glass */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
              style={{ backgroundImage: "url('/images/nature_hero_pasture.jpg')" }}
            />
            {/* Specular glass sheen diagonal gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#122E1B]/70 via-transparent to-white/15 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              
              {/* Top Row: Title, Subtitle, & Description */}
              <div className="space-y-3 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13] bg-[#E58A13]/15 px-3 py-1 rounded-full border border-[#E58A13]/30 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#E58A13]" />
                  <span>Farm Provisions Showcase • மளிகைப் பட்டியல்</span>
                </span>
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] drop-shadow-sm">
                  All Farm Products
                </h2>
                
                <p className="text-sm sm:text-base text-[#D1DDD3] font-sans leading-relaxed max-w-2xl">
                  Browse our complete harvest of unadulterated A2 dairy, Vedic Bilona ghee, indigenous millets, and unpolished pulses from Shoolagiri.
                </p>
              </div>

              {/* 3 Glass Feature Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E58A13]/25 flex items-center justify-center text-[#E58A13]">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Raw A2 Gir Cow Milk
                  </h3>
                  <p className="text-xs text-[#D1DDD3] leading-relaxed">
                    Unpasteurized, unadulterated, instant 4°C chilling in eco glass bottles.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E58A13]/25 flex items-center justify-center text-[#E58A13]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Hand-Churned Bilona Ghee
                  </h3>
                  <p className="text-xs text-[#D1DDD3] leading-relaxed">
                    Cultured whole curd, wooden bilona churning, slow clay-pot simmer.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E58A13]/25 flex items-center justify-center text-[#E58A13]">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Native Millets &amp; Dals
                  </h3>
                  <p className="text-xs text-[#D1DDD3] leading-relaxed">
                    Chemical-free unpolished pulses cultivated on drylands around Shoolagiri.
                  </p>
                </div>
              </div>

              {/* Bottom Actions inside Glass Card */}
              <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <a
                    href={WA_CATALOG_INQUIRY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full transition-all shadow-lg shadow-[#E58A13]/25 cursor-pointer min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <a
                    href="/story"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full border border-white/25 backdrop-blur-md transition-all cursor-pointer min-h-[44px]"
                  >
                    <span>Our 9-Year Story</span>
                  </a>
                </div>

                {/* Back to Top Smooth Scroll Button */}
                <button
                  type="button"
                  onClick={() => {
                    const target = document.getElementById('category-filters') || document.getElementById('products') || document.body;
                    target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-sans font-semibold text-[#D1DDD3] hover:text-[#E58A13] py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer min-h-[40px]"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top of Products</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Trust Badges Row */}
      <TrustBadgesSection />

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
