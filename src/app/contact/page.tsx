'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-2xs">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D36] bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
              Get in Touch
            </span>
            <h1 className="font-heading font-extrabold text-3xl text-gray-900">
              Contact & Support
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Have questions about a product, recommendation, or partnership? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Contact info */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400">Email</h4>
                  <p className="text-sm font-semibold text-gray-800">support@bechakena.plus</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400">Helpline</h4>
                  <p className="text-sm font-semibold text-gray-800">+880 1700-000000</p>
                  <p className="text-[11px] text-gray-400">10:00 AM - 8:00 PM (Everyday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-400">Location</h4>
                  <p className="text-sm font-semibold text-gray-800">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7 bg-[#f8faf9] p-6 rounded-2xl border border-gray-100">
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-[#0B5D36] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">Message Received!</h3>
                  <p className="text-xs text-gray-600">
                    Thank you for reaching out, {name}. Our team will review your message and reply via email within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tanvir@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B5D36] hover:bg-[#074528] text-white font-heading font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
