'use client';

import { useEffect } from 'react';

interface AdsterraPopunderProps {
  popunderCode?: string;
  enabled?: boolean;
}

export function AdsterraPopunder({ popunderCode, enabled = true }: AdsterraPopunderProps) {
  useEffect(() => {
    if (!enabled || !popunderCode || popunderCode.trim().length === 0) return;

    try {
      // Create and inject popunder script into head/body
      const container = document.createElement('div');
      container.id = 'adsterra-popunder-container';
      container.style.display = 'none';

      const fragment = document.createRange().createContextualFragment(popunderCode);
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
        const existing = document.getElementById('adsterra-popunder-container');
        existing?.remove();
      };
    } catch {
      // Fail silently
    }
  }, [popunderCode, enabled]);

  return null;
}
