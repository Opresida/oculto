'use client';

import { useEffect, useRef, useState } from 'react';
import { ARTISTAS } from '@/lib/evento';

// Os três artistas em triângulo, como na arte "É HOJE": Jyou Guerra e DJ Bertolossi atrás, Flakkë na
// frente, no centro e maior (ele é o artista principal). Cada um entra depois da abertura, um após o
// outro, e o grupo acompanha o mouse (ou a rolagem, no celular) em profundidades diferentes.

// posição de cada um dentro do quadro (em % da largura / altura do quadro) e quanto ele se mexe
const LUGAR: Record<string, { esquerda: number; altura: number; fundo: number; atraso: number }> = {
  jyou: { esquerda: 19, altura: 88, fundo: 10, atraso: 150 },
  bertolossi: { esquerda: 83, altura: 90, fundo: 10, atraso: 300 },
  flakke: { esquerda: 50, altura: 96, fundo: 22, atraso: 520 },
};
const ORDEM = ['jyou', 'bertolossi', 'flakke'];

export function Trio() {
  const quadro = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [desvio, setDesvio] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener('oculto:aberto', abrir);
    // se a abertura já passou (voltou para a página), não espera o aviso
    const reserva = setTimeout(abrir, 5200);
    return () => {
      window.removeEventListener('oculto:aberto', abrir);
      clearTimeout(reserva);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let alvo = { x: 0, y: 0 };
    const aplicar = () => {
      raf = 0;
      setDesvio(alvo);
    };
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(aplicar);
    };
    const mouse = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      alvo = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      agendar();
    };
    const rolagem = () => {
      const el = quadro.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      alvo = { x: alvo.x, y: Math.max(-0.6, Math.min(0.6, (r.top + r.height / 2) / window.innerHeight - 0.5)) };
      agendar();
    };
    window.addEventListener('pointermove', mouse, { passive: true });
    window.addEventListener('scroll', rolagem, { passive: true });
    return () => {
      window.removeEventListener('pointermove', mouse);
      window.removeEventListener('scroll', rolagem);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={quadro} className="relative mx-auto aspect-[10/11] w-full max-w-[640px] select-none">
      {/* moldura fina atrás do grupo: eles saem dela pelos lados */}
      <div
        className="absolute inset-x-[4%] bottom-[14%] top-[6%] border border-prata/60"
        style={{ opacity: aberto ? 1 : 0, transform: `translate(${desvio.x * -8}px, ${desvio.y * -8}px)`, transition: 'opacity 1s ease 0.2s' }}
        aria-hidden
      >
        <span className="absolute -left-3 -top-3 h-8 w-8 border-l-4 border-t-4 border-luz" />
        <span className="absolute -right-3 -top-3 h-8 w-8 border-r-4 border-t-4 border-luz" />
        <span className="absolute -bottom-3 -left-3 h-8 w-8 border-b-4 border-l-4 border-luz" />
        <span className="absolute -bottom-3 -right-3 h-8 w-8 border-b-4 border-r-4 border-luz" />
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 62% 46% at 50% 46%, rgba(255,255,255,.3) 0%, rgba(255,255,255,.08) 46%, transparent 74%)' }} aria-hidden />

      {ORDEM.map((id) => {
        const a = ARTISTAS.find((x) => x.id === id)!;
        const l = LUGAR[id];
        return (
          <div
            key={id}
            className="absolute bottom-0"
            style={{
              left: `${l.esquerda}%`,
              height: `${l.altura}%`,
              aspectRatio: `${a.largura} / ${a.altura}`,
              transform: `translate(-50%, 0) translate(${desvio.x * l.fundo}px, ${desvio.y * l.fundo * 0.7}px)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- recorte com transparência, já em WebP no tamanho certo */}
            <img
              src={a.foto}
              alt={a.nome}
              width={a.largura}
              height={a.altura}
              draggable={false}
              className="h-full w-full object-contain"
              style={{
                opacity: aberto ? 1 : 0,
                transform: aberto ? 'none' : 'translateY(9%) scale(1.04)',
                filter: aberto ? 'contrast(1.05) saturate(1.06) drop-shadow(0 0 2px rgba(255,255,255,.9)) drop-shadow(0 0 28px rgba(255,255,255,.3))' : 'brightness(0) blur(10px)',
                transition: `opacity 0.9s ease ${l.atraso}ms, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${l.atraso}ms, filter 1.4s ease ${l.atraso + 200}ms`,
              }}
            />
          </div>
        );
      })}

      {/* escurece a base dos recortes e apoia a fita dos nomes */}
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,5,.7) 45%, #050505 100%)' }} aria-hidden />
      <div
        className="absolute -inset-x-[8%] bottom-[5%] flex h-[7.5%] min-h-[34px] items-center justify-center gap-[3%] border-b-2 border-t-2 border-b-apoio border-t-white bg-prata-clara shadow-[0_14px_40px_rgba(0,0,0,.7)]"
        style={{ transform: `rotate(-5deg) translateX(${aberto ? 0 : 110}%)`, transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s' }}
      >
        {ARTISTAS.map((a, i) => (
          <span key={a.id} className="flex items-center gap-[1.2em] text-[clamp(0.6rem,2.5vw,1rem)]">
            {i > 0 && <span className="h-[0.45em] w-[0.45em] bg-preto" aria-hidden />}
            <span className="titulo whitespace-nowrap text-preto">{a.nome}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
