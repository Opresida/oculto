'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Marca o bloco como "visivel" quando ele entra na tela. O efeito em si está em globals.css (.revela, .acende). */
export function Revela({ children, className = '', efeito = 'revela', atraso = 0 }: { children: ReactNode; className?: string; efeito?: 'revela' | 'acende'; atraso?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const olho = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          olho.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    olho.observe(el);
    return () => olho.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${efeito} ${visivel ? 'visivel' : ''} ${className}`} style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}>
      {children}
    </div>
  );
}
