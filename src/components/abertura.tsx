'use client';

import { useEffect, useState } from 'react';
import { EVENTO } from '@/lib/evento';
import { LogoVivo } from './logo-vivo';

// Abertura de 4 segundos: tela preta, os cinco pontos acendem, a logo entra em foco (a mesma peça de
// motion dos vídeos) e uma régua enche até 100%. Depois a cortina sobe e mostra a página.
// Aparece uma vez por visita; com "reduzir movimento" ligado, sai em meio segundo.

const DURACAO = 4000;
const CHAVE = 'oculto-abertura';

export function Abertura() {
  // começa visível: é o que o HTML do servidor mostra, antes de o JavaScript chegar
  const [fase, setFase] = useState<'tocando' | 'saindo' | 'fora'>('tocando');
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    let jaViu = false;
    try {
      jaViu = sessionStorage.getItem(CHAVE) === '1';
    } catch {
      /* navegação privada: toca sempre */
    }
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = jaViu ? 0 : calmo ? 500 : DURACAO;
    document.documentElement.style.overflow = 'hidden';

    let raf = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const p = total === 0 ? 1 : Math.min(1, (agora - inicio) / total);
      setProgresso(p);
      if (p < 1) raf = requestAnimationFrame(passo);
      else {
        setFase('saindo');
        document.documentElement.style.overflow = '';
        try {
          sessionStorage.setItem(CHAVE, '1');
        } catch {
          /* sem armazenamento: tudo bem */
        }
        window.dispatchEvent(new Event('oculto:aberto'));
      }
    };
    raf = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (fase !== 'saindo') return;
    const t = setTimeout(() => setFase('fora'), 900);
    return () => clearTimeout(t);
  }, [fase]);

  if (fase === 'fora') return null;
  const pct = Math.round(progresso * 100);
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-preto px-6"
      style={{ transform: fase === 'saindo' ? 'translateY(-100%)' : 'none', transition: 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)' }}
      role="status"
      aria-live="polite"
      aria-label={`Carregando, ${pct}%`}
    >
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 45% at 50% 48%, rgba(255,255,255,${0.05 + 0.09 * progresso}) 0%, transparent 70%)` }} />
      <p className="rotulo relative text-apoio">{EVENTO.realizacao.toUpperCase()} APRESENTA</p>
      <LogoVivo animar inicioLetras={34} className="relative mt-4 w-full max-w-[640px]" />
      <div className="relative mt-8 w-full max-w-[420px]">
        <div className="h-px w-full bg-grafite">
          <div className="h-px bg-prata-clara" style={{ width: `${pct}%` }} />
        </div>
        <div className="rotulo mt-3 flex justify-between text-apoio">
          <span>
            {EVENTO.dia} {EVENTO.data} · {EVENTO.local.toUpperCase()}
          </span>
          <span className="tabular-nums text-prata-clara">{String(pct).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
}
