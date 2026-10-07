'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'green' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  showText?: boolean;
}

export function Logo({
  variant = 'green',
  size = 'md',
  className = '',
  href = '/',
  showText = true,
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 sm:h-10 sm:w-10 rounded-xl',
    lg: 'h-11 w-11 sm:h-13 sm:w-13 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const logoSrc = 'https://i.ibb.co.com/Kx7S5jYD/bk.png';

  const textColorClass = variant === 'white' ? 'text-white' : 'text-[#0B5D36]';
  const plusColorClass = variant === 'white' ? 'text-emerald-300' : 'text-[#0B5D36]';

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none transition-transform active:scale-95 group ${className}`}
    >
      {/* Corner rounded logo image */}
      {!imgError ? (
        <div className={`overflow-hidden shrink-0 shadow-xs border border-[#0B5D36]/10 ${iconSizes[size]} bg-white flex items-center justify-center`}>
          <img
            src={logoSrc}
            alt="bechakena+"
            className="w-full h-full object-cover rounded-[inherit] transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className={`overflow-hidden shrink-0 bg-[#0B5D36] text-white flex items-center justify-center font-bold ${iconSizes[size]}`}>
          b+
        </div>
      )}

      {/* Brand text beside the logo */}
      {showText && (
        <div className={`font-heading font-extrabold tracking-tight leading-none flex items-center ${textSizes[size]} ${textColorClass}`}>
          <span>bechakena</span>
          <span className={`font-black ml-0.5 ${plusColorClass}`}>+</span>
        </div>
      )}
    </Link>
  );
}
