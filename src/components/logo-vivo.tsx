'use client';

import { useEffect, useRef, useState } from 'react';
import { OcultoLogo } from '@/motion/oculto/OcultoLogo';
import { oculto } from '@/motion/tema';

// A logo O.C.U.L.T.O desenhada pela peça de motion da biblioteca (a mesma dos vídeos): pontos acendendo,
// letras entrando em foco de baixo para cima, brilho prata e slogan palavra a palavra. A peça é função
// pura do quadro; aqui só damos o relógio (30 quadros por segundo) e a escala para caber na largura.
// O palco de 1080 px fica solto (absolute) para não empurrar a largura da coluna no celular.

const FPS = 30;
const LARGURA = 1080;
const ALTURA = 370;

type Props = {
  /** toca a entrada; sem isso, mostra a logo já pronta */
  animar?: boolean;
  /** quadro em que as letras começam a entrar (os pontos acendem antes) */
  inicioLetras?: number;
  slogan?: boolean;
  className?: string;
};

export function LogoVivo({ animar = false, inicioLetras = 36, slogan = true, className = '' }: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);
  const [quadro, setQuadro] = useState(animar ? 0 : 900);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = new ResizeObserver(() => setLargura(el.clientWidth));
    medir.observe(el);
    return () => medir.disconnect();
  }, []);

  useEffect(() => {
    if (!animar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setQuadro(900));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    let inicio = 0;
    let ultimo = -1;
    const passo = (agora: number) => {
      if (!inicio) inicio = agora;
      const q = Math.floor(((agora - inicio) / 1000) * FPS);
      if (q !== ultimo) {
        ultimo = q;
        setQuadro(q);
      }
      if (q < 260) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [animar]);

  const escala = largura / LARGURA;
  return (
    <div ref={caixa} className={`relative ${className}`} style={{ height: ALTURA * escala }} role="img" aria-label="O.C.U.L.T.O — Onde curtimos uma liberdade totalmente obscura">
      {largura > 0 && (
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: LARGURA, height: ALTURA, transform: `scale(${escala})`, transformOrigin: '0 0' }}>
          <OcultoLogo frame={quadro} fps={FPS} width={LARGURA} height={1080} theme={oculto} exit={false} inicioPontos={0} inicioLetras={inicioLetras} inicioSlogan={inicioLetras + 44} posY={ALTURA / 2} sloganOpacidade={slogan ? 1 : 0} />
        </div>
      )}
    </div>
  );
}
