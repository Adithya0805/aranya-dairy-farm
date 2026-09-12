'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Package, ShoppingCart, ExternalLink, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (!session) {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.replace('/admin/login');
        }
      } else {
        setIsAuthenticated(true);
        setAdminEmail(session.user?.email || 'Admin');
        if (isLoginPage) {
          router.replace('/admin/products');
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (!session) {
        setIsAuthenticated(false);
        setAdminEmail(null);
        if (!isLoginPage) {
          router.replace('/admin/login');
        }
      } else {
        setIsAuthenticated(true);
        setAdminEmail(session.user?.email || 'Admin');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  // If we are on the login page, render without admin navigation frame
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying auth session
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#1B4D2E]/20 border-t-[#1B4D2E] rounded-full animate-spin" />
        <p className="text-xs font-sans text-[#57655B] uppercase tracking-wider font-semibold">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  const isProducts = pathname.startsWith('/admin/products');
  const isOrders = pathname.startsWith('/admin/orders');

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex flex-col font-sans text-[#1C241E]">
      {/* -- Top Header -- */}
      <header className="bg-white border-b border-[#1B4D2E]/15 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#1B4D2E]/20 flex items-center justify-center p-0.5 shadow-xs shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/aranya-logo.png"
                  alt="Aranya Farm Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-[#1C241E] leading-tight block">
                  Aranya Farm
                </span>
                <span className="text-[10px] text-[#57655B] uppercase font-bold tracking-wider block">
                  Store Management
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin/products"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isProducts
                    ? 'bg-[#1B4D2E] text-white'
                    : 'text-[#57655B] hover:bg-[#F2ECE7] hover:text-[#1C241E]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products (32)</span>
              </Link>

              <Link
                href="/admin/orders"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isOrders
                    ? 'bg-[#1B4D2E] text-white'
                    : 'text-[#57655B] hover:bg-[#F2ECE7] hover:text-[#1C241E]'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </Link>
            </nav>

            {/* Right: User Email & Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#57655B] hover:text-[#1B4D2E] font-medium px-2 py-1 rounded transition-colors"
                title="View live customer storefront"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {adminEmail && (
                <div className="hidden lg:block text-right border-l border-[#1B4D2E]/10 pl-3">
                  <p className="text-[11px] font-semibold text-[#1C241E] truncate max-w-[160px]">
                    {adminEmail}
                  </p>
                  <p className="text-[10px] text-[#8A7B6E] uppercase tracking-wide">Administrator</p>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors touch-manipulation cursor-pointer"
                aria-label="Log out of admin panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden flex border-t border-[#1B4D2E]/10 py-2 gap-2">
            <Link
              href="/admin/products"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                isProducts
                  ? 'bg-[#1B4D2E] text-white'
                  : 'bg-[#F2ECE7] text-[#1C241E]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                isOrders
                  ? 'bg-[#1B4D2E] text-white'
                  : 'bg-[#F2ECE7] text-[#1C241E]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
          </div>
        </div>
      </header>

      {/* -- Main Admin Content -- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
