import React from 'react';
import { BaseProps, PieceMeta, layout, fw } from '../theme';
import { Fill, useStableId } from '../primitives';
import { exitProgress, clamp } from '../easing';
import { entrar, pulso } from './_motion';
import { FiltroGranulado, PalavraFoco } from './_letra';

export const meta: PieceMeta = {
  component: 'OcultoLogo', name: 'O.C.U.L.T.O · logo reveal', category: 'oculto', durationInFrames: 240,
  purpose: 'Os cinco pontos acendem no beat, as letras entram em foco de baixo para cima com brilho prata e o slogan surge palavra a palavra.',
  props: 'slogan, inicioPontos, inicioLetras, inicioSlogan, posY, escala, desfoqueExtra (0–1), sloganOpacidade (0–1)',
};

export type OcultoLogoProps = BaseProps & {
  slogan?: string;
  /** Quadros, relativos ao início da peça. */
  inicioPontos?: number; inicioLetras?: number; inicioSlogan?: number;
  /** Centro vertical do logo em px. Padrão: meio da tela. */
  posY?: number; escala?: number;
  /** Desfoque extra do bloco inteiro (rack focus), 0–1. */
  desfoqueExtra?: number; sloganOpacidade?: number;
};

export const OcultoLogo: React.FC<OcultoLogoProps> = ({
  frame, width, height, theme, exit = true, durationInFrames = meta.durationInFrames,
  slogan = 'ONDE CURTIMOS UMA LIBERDADE TOTALMENTE OBSCURA',
  inicioPontos = 0, inicioLetras = 66, inicioSlogan = 165, posY, escala = 1, desfoqueExtra = 0, sloganOpacidade = 1,
}) => {
  const { u } = layout(width, height);
  const fs = 256 * u;
  const id = useStableId('oculto-fuzz');
  const saida = exitProgress(frame, durationInFrames, 18, exit);
  const ponto = (i: number) => {
    const s = inicioPontos + 10 + i * 9;
    const p = entrar(frame, s, 9);
    return { p, brilho: p * (1 - entrar(frame, s + 5, 27)) + 0.25 * pulso(frame, inicioLetras - 6, 24) };
  };
  return (
    <Fill>
      <FiltroGranulado id={id} u={u} />
      <div style={{ position: 'absolute', left: '50%', top: posY ?? height / 2, transform: `translate(-50%, -50%) scale(${escala})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs * 0.11, opacity: 1 - saida }}>
        <div style={{ filter: desfoqueExtra > 0.01 ? `blur(${desfoqueExtra * 6 * u}px)` : 'none' }}>
          <PalavraFoco texto="OCULTO" fs={fs} frame={frame} inicio={inicioLetras} intervalo={4} theme={theme} filtroId={id} pontos ponto={ponto} />
        </div>
        <div style={{ display: 'flex', gap: fs * 0.035, fontFamily: theme.fonts.body, fontWeight: fw(theme, 'bodyStrong'), fontSize: fs * 0.1, letterSpacing: '0.03em', color: theme.colors.text, whiteSpace: 'nowrap', marginTop: -fs * 0.025, opacity: clamp(sloganOpacidade) }}>
          {slogan.split(' ').map((w, i) => {
            const s = inicioSlogan + i * 3;
            return <span key={i} style={{ display: 'inline-block', opacity: entrar(frame, s, 18), transform: `translateY(${entrar(frame, s, 24, 14 * u, 0)}px)`, filter: `blur(${entrar(frame, s, 27, 8 * u, 0)}px)` }}>{w}</span>;
          })}
        </div>
      </div>
    </Fill>
  );
};
