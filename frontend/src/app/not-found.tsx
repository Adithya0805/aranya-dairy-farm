import Link from 'next/link';
import { ArrowLeft, ShoppingBag, MessageSquare } from 'lucide-react';
import { WHATSAPP_DISPLAY, WA_FARM_INQUIRY } from '@/lib/whatsapp';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#1C241E] flex flex-col justify-between selection:bg-[#E58A13] selection:text-white">
      {/* Top Brand Bar */}
      <header className="bg-[#122E1B] border-b border-[#122E1B]/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-[#1B4D2E]/20 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aranya-logo.png"
                alt="Aranya Farm Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#FAF7F2] tracking-wide block leading-none">
                ARANYA
              </span>
              <span className="text-[10px] text-[#E58A13] uppercase font-sans tracking-widest font-semibold block mt-0.5">
                Organic Dairy Farm
              </span>
            </div>
          </Link>
          <Link
            href="/products"
            className="text-xs uppercase font-sans font-bold tracking-wider text-[#FAF7F2] hover:text-[#E58A13] transition-colors"
          >
            Explore Shop →
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-xs font-sans font-bold uppercase tracking-wider">
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#15321E] tracking-tight leading-tight">
          This pasture doesn’t exist.
        </h1>

        <p className="text-sm sm:text-base text-[#5F6E62] leading-relaxed max-w-md">
          The page you requested may have been moved, renamed, or is temporarily unavailable. Let&apos;s guide you back to our fresh farm provisions.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#122E1B] hover:bg-[#1C3E25] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider px-6 py-3.5 min-h-[48px] rounded-full transition-all touch-manipulation shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#E58A13]" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider px-6 py-3.5 min-h-[48px] rounded-full transition-all touch-manipulation shadow-md shadow-[#E58A13]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-[#122E1B]/10 w-full text-xs text-[#8A7B6E]">
          Need immediate delivery help?{' '}
          <a
            href={WA_FARM_INQUIRY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#15321E] font-semibold hover:underline inline-flex items-center gap-1 ml-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp our team ({WHATSAPP_DISPLAY})</span>
          </a>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-[#122E1B]/10 text-center text-xs text-[#8A7B6E]">
        © {new Date().getFullYear()} Aranya Organic Dairy Farm, Shoolagiri, Hosur, Tamil Nadu.
      </footer>
    </div>
  );
}
