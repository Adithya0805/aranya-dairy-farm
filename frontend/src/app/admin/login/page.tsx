'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect straight to /admin/products
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/products');
      }
    }
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMsg(
            'Invalid login credentials. If you created this user manually in the Supabase dashboard, please ensure the user email has been Confirmed (go to Supabase Dashboard → Authentication → Users → click "..." → "Confirm User").'
          );
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.replace('/admin/products');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1B4D2E] text-white shadow-md mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-[#1C241E]">
          Aranya Farm Admin
        </h2>
        <p className="mt-2 text-sm text-[#57655B] font-sans">
          Internal catalog & order management portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-[#1B4D2E]/10 rounded-lg">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm font-sans">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C241E]"
              >
                Admin Email
              </label>
              <div className="mt-2 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A7B6E]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aranyadairyfarm.com"
                  className="block w-full pl-10 pr-3 py-3 border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-sm text-[#1C241E] bg-[#FCFAF7]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C241E]"
              >
                Password
              </label>
              <div className="mt-2 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A7B6E]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-sm text-[#1C241E] bg-[#FCFAF7]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1B4D2E] hover:bg-[#143B23] text-white font-sans text-xs uppercase font-bold tracking-widest py-3.5 px-4 rounded-md shadow-sm transition-all disabled:opacity-50 touch-manipulation cursor-pointer"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1B4D2E]/10 text-center">
            <Link
              href="/"
              className="text-xs text-[#57655B] hover:text-[#1B4D2E] transition-colors inline-flex items-center gap-1 font-medium"
            >
              ? Return to public storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
