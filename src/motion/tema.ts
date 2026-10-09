import type { Theme } from './theme';

// Tema O.C.U.L.T.O · Royals Entretenimento — valores do Brandbook v1.0, seções 06 e 07
// (C:/Users/PC GAMER/Desktop/Brandsquad/Oculto/brandbook).
export const oculto: Theme = {
  colors: {
    bg: '#050505', // Preto Oculto
    surface: '#2A2A2B', // divisórias
    text: '#F4F4F2', // Prata Clara (luz)
    muted: '#8E8E8B', // apoio
    accent: '#E4E4E1', // Prata Clara · pontos, chamadas
    accent2: '#B9B9B6', // Prata · prefixos, sub-data
    positive: '#E4E4E1',
    negative: '#8E8E8B',
  },
  // no site, Archivo e JetBrains Mono vêm do next/font (variáveis CSS); a fonte da logo é carregada pelo nome
  fonts: { display: 'Big Shoulders Display', body: 'var(--font-archivo), Arial, sans-serif', mono: 'var(--font-jetbrains), monospace' },
  radius: 0,
  stroke: 2,
  shadow: 'none',
  weights: { display: 900, body: 400, bodyStrong: 600 },
};
