import React from 'react';
import { Theme, fw } from '../theme';
import { entrar, deslizar } from './_motion';

export const PRATA = 'linear-gradient(180deg, #ffffff 0%, #ececea 40%, #b9b9b6 55%, #f4f4f2 75%, #cfcfcc 100%)';

/** Borda granulada do topo das letras. Renderize uma vez por peça. */
export const FiltroGranulado: React.FC<{ id: string; u: number }> = ({ id, u }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <filter id={id} x="-20%" y="-40%" width="140%" height="180%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale={14 * u} />
    </filter>
  </svg>
);

type LetraProps = { ch: string; fs: number; foco: number; y?: number; opacidade?: number; brilho?: number; filtroId: string; theme: Theme };

/**
 * Letra com o desfoque da marca: corpo nítido em prata, topo desfocado e granulado.
 * foco = 0 → toda desfocada; foco = 1 → padrão do logo (blur só nos 20% de cima).
 */
export const Letra: React.FC<LetraProps> = ({ ch, fs, foco, y = 0, opacidade = 1, brilho = 200, filtroId, theme }) => {
  const pad = fs * 0.45;
  const a = (1 - foco) * 91;
  const b = 28 + (1 - foco) * 72;
  const blurPx = fs * 0.01625 + (1 - foco) * fs * 0.12;
  const mascaraNitida = `linear-gradient(180deg, transparent ${a}%, #000 ${a + 9}%)`;
  const mascaraDesfoque = `linear-gradient(180deg, #000 0%, #000 ${b}%, transparent ${Math.min(b + 12, 100)}%)`;
  return (
    <span style={{ position: 'relative', display: 'inline-block', opacity: opacidade, transform: `translateY(${y}px)` }}>
      <span style={{
        position: 'relative', display: 'block', filter: `blur(${fs * 0.003}px)`,
        WebkitMaskImage: mascaraNitida, maskImage: mascaraNitida,
        backgroundImage: `linear-gradient(105deg, transparent 42%, rgba(255,255,255,.95) 50%, transparent 58%), ${PRATA}`,
        backgroundSize: '300% 100%, 100% 100%', backgroundPosition: `${brilho}% 0, 0 0`, backgroundRepeat: 'no-repeat',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }}>{ch}</span>
      <span style={{
        position: 'absolute', inset: -pad, padding: pad, boxSizing: 'border-box', color: theme.colors.text,
        filter: `url(#${filtroId}) blur(${blurPx}px)`, WebkitMaskImage: mascaraDesfoque, maskImage: mascaraDesfoque, opacity: 0.55 + 0.45 * foco,
      }}>{ch}</span>
    </span>
  );
};

/** Ponto quadrado do logo. */
export const Ponto: React.FC<{ fs: number; p: number; brilho: number; cor: string }> = ({ fs, p, brilho, cor }) => {
  const s = fs * 0.0875;
  return (
    <span style={{
      display: 'inline-block', width: s, height: s, margin: `0 ${fs * 0.025}px`, background: cor,
      transform: `scale(${p})`, opacity: p > 0 ? 1 : 0,
      boxShadow: `0 0 ${fs * 0.15 * brilho}px ${fs * 0.03 * brilho}px rgba(255,255,255,${0.7 * brilho})`,
    }} />
  );
};

type PalavraProps = {
  texto: string; fs: number; frame: number; inicio: number; intervalo: number; theme: Theme; filtroId: string;
  pontos?: boolean; ponto?: (i: number) => { p: number; brilho: number };
};

/** Palavra que entra em foco letra a letra (intervalo em quadros). */
export const PalavraFoco: React.FC<PalavraProps> = ({ texto, fs, frame, inicio, intervalo, theme, filtroId, pontos = false, ponto }) => {
  const chars = texto.split('');
  const nodes: React.ReactNode[] = [];
  chars.forEach((ch, i) => {
    const s = inicio + i * intervalo;
    nodes.push(
      <Letra key={`l${i}`} ch={ch} fs={fs} theme={theme} filtroId={filtroId}
        foco={entrar(frame, s, 45)} y={entrar(frame, s, 36, fs * 0.14, 0)} opacidade={entrar(frame, s, 15)}
        brilho={deslizar(frame, inicio + 57, 36, 180 - i * 6, -80 - i * 6)} />,
    );
    if (pontos && i < chars.length - 1) {
      const d = ponto ? ponto(i) : { p: 1, brilho: 0 };
      nodes.push(<Ponto key={`p${i}`} fs={fs} p={d.p} brilho={d.brilho} cor={theme.colors.accent} />);
    }
  });
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: theme.fonts.display, fontWeight: fw(theme, 'display'), fontSize: fs, lineHeight: 0.9, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>
      {nodes}
    </div>
  );
};
