import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';

export const metadata = {
  title: 'Terms of Service — bechakena+',
  description: 'Terms and conditions for using bechakena+ product discovery service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-2xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="font-heading font-extrabold text-3xl text-gray-900">Terms of Service</h1>
          <p className="text-xs text-gray-400">Effective Date: October 2026</p>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">1. Nature of Service</h2>
            <p>
              bechakena+ provides product discovery, curation, comparisons, and buying guides. We do not operate an internal warehouse, collect payment information, or ship products directly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">2. Pricing & Availability</h2>
            <p>
              While we update product listings, specifications, and prices frequently, actual availability, delivery charges, and final prices are determined by the seller on Daraz at the time of purchase checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">3. Intellectual Property</h2>
            <p>
              The bechakena+ logo, website design, brand typography, and original editorial content are the property of bechakena+. Third-party brand names and trademarks belong to their respective owners.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
