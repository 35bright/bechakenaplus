import React from 'react';
import { CheckCircle2, BadgePercent, Flame, Truck, ShieldCheck } from 'lucide-react';

export function TrustFeaturesStrip() {
  const items = [
    { title: 'Top Picks', subtitle: 'Handpicked for you', icon: CheckCircle2 },
    { title: 'Best Deals', subtitle: 'Save more everyday', icon: BadgePercent },
    { title: 'Trending Now', subtitle: "What's popular", icon: Flame },
    { title: 'Fast Delivery', subtitle: 'Get it quickly', icon: Truck },
    { title: 'Easy Returns', subtitle: 'Shop with confidence', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                idx === 4 ? 'col-span-2 md:col-span-1 justify-center md:justify-start' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-heading leading-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
