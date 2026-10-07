import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';

export const metadata = {
  title: 'Privacy Policy — bechakena+',
  description: 'Learn how bechakena+ respects your privacy and handles anonymous user analytics.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-2xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="font-heading font-extrabold text-3xl text-gray-900">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: October 2026</p>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">1. Information We Collect</h2>
            <p>
              bechakena+ is built with privacy-first principles. We do not require visitors to register an account to browse products, read guides, or build a wishlist. We collect non-personally identifiable first-party analytical metrics such as page visits, search keywords, and outgoing product clicks to optimize our curation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">2. External Redirection & Purchases</h2>
            <p>
              When you click on a product purchase CTA (&quot;View on Daraz&quot;), you are securely redirected to Daraz Bangladesh. Any subsequent purchase transactions, payment processing, address inputs, and delivery agreements occur directly on Daraz under their respective privacy policy and security guarantees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">3. Cookies & Local Storage</h2>
            <p>
              We use client-side local storage exclusively to remember your saved wishlist items on your own device. We do not share your wishlist data with third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-gray-900">4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please email us at <strong>support@bechakena.plus</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
