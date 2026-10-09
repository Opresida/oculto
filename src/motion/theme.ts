import type { ReactNode } from 'react';

export type Theme = {
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accent2: string;
    positive: string;
    negative: string;
    /** Acento usado em TEXTO. Defina quando o acento puro não tem contraste sobre o fundo (ex.: laranja sobre claro). */
    accentText?: string;
  };
  fonts: { display: string; body: string; mono: string }; // nomes do Google Fonts
  radius: number; // raio de borda base, em px
  stroke: number; // espessura de traço base, em px
  shadow: 'none' | 'soft' | 'hard';
  /** Extensão opcional: pesos usados de cada família. Padrão: display 700, body 400, bodyStrong 700. */
  weights?: { display?: number; body?: number; bodyStrong?: number };
};

/** Props comuns a toda peça. */
export type BaseProps = {
  frame: number;
  fps?: number;
  width: number;
  height: number;
  theme: Theme;
  /** Liga/desliga a animação de saída. */
  exit?: boolean;
  durationInFrames?: number;
};

/** Props comuns às transições. `progress` vai de 0 a 1. */
export type TransitionProps = {
  progress: number;
  from: ReactNode;
  to: ReactNode;
  width: number;
  height: number;
  theme: Theme;
};

export type PieceMeta = {
  component: string;
  name: string;
  category: string;
  durationInFrames: number;
  purpose: string;
  props: string;
  kind?: 'piece' | 'transition';
};

export const FORMATS = {
  vertical: { width: 1080, height: 1920, label: '1080×1920' },
  feed: { width: 1080, height: 1350, label: '1080×1350' },
  wide: { width: 1920, height: 1080, label: '1920×1080' },
};

/** Medidas relativas e zona segura. `u` = 1 em 1080 px no lado menor. */
export function layout(width: number, height: number) {
  const u = Math.min(width, height) / 1080;
  const aspect = height / width;
  let top: number;
  let bottom: number;
  if (aspect > 1.6) {
    top = (250 * height) / 1920;
    bottom = (400 * height) / 1920;
  } else if (aspect > 1.05) {
    top = height * 0.07;
    bottom = height * 0.12;
  } else {
    top = height * 0.08;
    bottom = height * 0.1;
  }
  const side = width * 0.08;
  return { u, top, bottom, side, contentW: width - side * 2, contentH: height - top - bottom, cx: width / 2, cy: top + (height - top - bottom) / 2, wide: aspect < 1, aspect };
}

/** Cor de acento para texto: `accentText` do tema, ou o próprio acento. */
export const accentInk = (theme: Theme): string => theme.colors.accentText ?? theme.colors.accent;

export const fw = (theme: Theme, role: 'display' | 'body' | 'bodyStrong'): number => {
  const d = { display: 700, body: 400, bodyStrong: 700 };
  return (theme.weights && theme.weights[role]) || d[role];
};

const hexToRgb = (hex: string): number[] => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
export function mixColor(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = Math.min(1, Math.max(0, t));
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
export function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
const lum = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** Escolhe entre text e bg do tema a cor mais legível sobre `bgHex`. */
export const readableOn = (bgHex: string, theme: Theme) =>
  contrast(bgHex, theme.colors.text) >= contrast(bgHex, theme.colors.bg) ? theme.colors.text : theme.colors.bg;

export function shadowCss(theme: Theme, u: number): string {
  if (theme.shadow === 'soft') return `0 ${18 * u}px ${48 * u}px ${alpha(theme.colors.text, 0.18)}`;
  if (theme.shadow === 'hard') return `${14 * u}px ${14 * u}px 0 ${theme.colors.text}`;
  return 'none';
}

// ——— Temas de exemplo ———

export const editorial: Theme = {
  colors: { bg: '#F3EFE7', surface: '#FFFFFF', text: '#1B1A17', muted: '#6F6A61', accent: '#D9481C', accent2: '#2D5BD0', positive: '#2E7D4F', negative: '#C0362C' },
  fonts: { display: 'DM Serif Display', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
  radius: 0,
  stroke: 6,
  shadow: 'none',
  weights: { display: 400, body: 400, bodyStrong: 600 },
};

export const noturno: Theme = {
  colors: { bg: '#0A0E16', surface: '#141B29', text: '#EAF0FF', muted: '#7F8BA6', accent: '#38D9FF', accent2: '#FF9F1C', positive: '#3EE08F', negative: '#FF5D73' },
  fonts: { display: 'Space Grotesk', body: 'Manrope', mono: 'JetBrains Mono' },
  radius: 14,
  stroke: 4,
  shadow: 'soft',
  weights: { display: 700, body: 400, bodyStrong: 700 },
};

export const organico: Theme = {
  colors: { bg: '#EFE4D3', surface: '#F9F2E7', text: '#3A2A1F', muted: '#8A7360', accent: '#BF5F36', accent2: '#6B7C46', positive: '#5B7D3F', negative: '#B0432D' },
  fonts: { display: 'Young Serif', body: 'Nunito', mono: 'Red Hat Mono' },
  radius: 40,
  stroke: 5,
  shadow: 'soft',
  weights: { display: 400, body: 400, bodyStrong: 800 },
};

export const pop: Theme = {
  colors: { bg: '#FFE03D', surface: '#FFFFFF', text: '#111111', muted: '#4D4D4D', accent: '#FF2E93', accent2: '#2952FF', positive: '#00A651', negative: '#FF3B1F' },
  fonts: { display: 'Archivo Black', body: 'Archivo', mono: 'Space Mono' },
  radius: 20,
  stroke: 8,
  shadow: 'hard',
  weights: { display: 400, body: 500, bodyStrong: 800 },
};

export const themes = { editorial, noturno, organico, pop };
export type ThemeKey = keyof typeof themes;

export const themeLabels: Record<ThemeKey, string> = {
  editorial: 'Editorial claro',
  noturno: 'Noturno tecnológico',
  organico: 'Orgânico acolhedor',
  pop: 'Pop alto contraste',
};

/** Nome exato no Google Fonts e pesos usados por tema. */
export const fontSpecs: Record<ThemeKey, { role: string; family: string; weights: number[] }[]> = {
  editorial: [
    { role: 'display', family: 'DM Serif Display', weights: [400] },
    { role: 'body', family: 'IBM Plex Sans', weights: [400, 600] },
    { role: 'mono', family: 'IBM Plex Mono', weights: [500, 700] },
  ],
  noturno: [
    { role: 'display', family: 'Space Grotesk', weights: [500, 700] },
    { role: 'body', family: 'Manrope', weights: [400, 700] },
    { role: 'mono', family: 'JetBrains Mono', weights: [500, 700] },
  ],
  organico: [
    { role: 'display', family: 'Young Serif', weights: [400] },
    { role: 'body', family: 'Nunito', weights: [400, 800] },
    { role: 'mono', family: 'Red Hat Mono', weights: [500, 700] },
  ],
  pop: [
    { role: 'display', family: 'Archivo Black', weights: [400] },
    { role: 'body', family: 'Archivo', weights: [500, 800] },
    { role: 'mono', family: 'Space Mono', weights: [400, 700] },
  ],
};

export function googleFontsUrl(keys: ThemeKey[] = Object.keys(themes) as ThemeKey[]): string {
  const seen = new Map<string, Set<number>>();
  keys.forEach((k) => fontSpecs[k].forEach((f) => {
    const s = seen.get(f.family) || new Set<number>();
    f.weights.forEach((w) => s.add(w));
    seen.set(f.family, s);
  }));
  const fam = [...seen.entries()].map(([name, w]) => `family=${name.replace(/ /g, '+')}:wght@${[...w].sort((a, b) => a - b).join(';')}`);
  return `https://fonts.googleapis.com/css2?${fam.join('&')}&display=swap`;
}
