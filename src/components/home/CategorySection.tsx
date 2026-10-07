import React from 'react';
import Link from 'next/link';
import { ArrowRight, Headphones, Shirt, Armchair, Sparkles, Dumbbell, BookOpen, Gamepad2, Car, Package } from 'lucide-react';
import { Category } from '@/types/database';

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const getIcon = (name: string, iconName?: string) => {
    const key = (iconName || name).toLowerCase();
    if (key.includes('elec') || key.includes('headphone')) return Headphones;
    if (key.includes('fash') || key.includes('shirt') || key.includes('cloth')) return Shirt;
    if (key.includes('home') || key.includes('living') || key.includes('armchair')) return Armchair;
    if (key.includes('beauty') || key.includes('care') || key.includes('sparkle')) return Sparkles;
    if (key.includes('sport') || key.includes('outdoor') || key.includes('dumbbell')) return Dumbbell;
    if (key.includes('book') || key.includes('stationery')) return BookOpen;
    if (key.includes('toy') || key.includes('kid')) return Gamepad2;
    if (key.includes('car') || key.includes('bike') || key.includes('auto')) return Car;
    return Package;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Browse our handpicked collections by department
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-[#0B5D36] hover:text-[#074528] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = getIcon(cat.name, cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group bg-white p-4 rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f4fbf7] text-[#0B5D36] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#0B5D36] group-hover:text-white transition-all duration-300">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#0B5D36] transition-colors leading-tight">
                {cat.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
