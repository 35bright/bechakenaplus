'use client';

import { useEffect } from 'react';

interface AdsterraSocialBarProps {
  socialBarCode?: string;
  enabled?: boolean;
}

export function AdsterraSocialBar({ socialBarCode, enabled = true }: AdsterraSocialBarProps) {
  useEffect(() => {
    if (!enabled || !socialBarCode || socialBarCode.trim().length === 0) return;

    try {
      // Create and inject Social Bar script
      const container = document.createElement('div');
      container.id = 'adsterra-socialbar-container';

      const fragment = document.createRange().createContextualFragment(socialBarCode);
      container.appendChild(fragment);

      const scripts = container.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      });

      return () => {
        const existing = document.getElementById('adsterra-socialbar-container');
        existing?.remove();
      };
    } catch {
      // Fail silently
    }
  }, [socialBarCode, enabled]);

  return null;
}
