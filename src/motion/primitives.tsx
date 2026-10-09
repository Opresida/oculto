import React from 'react';
import { layout, Theme, alpha } from './theme';

export const Fill: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', lineHeight: 1.2, ...style }}>{children}</div>
);

export type Zone = 'center' | 'chest' | 'top';

/** Área dentro da zona segura. `chest` = altura do peito, para conviver com apresentador. */
export const SafeArea: React.FC<{ width: number; height: number; zone?: Zone; align?: 'center' | 'start'; style?: React.CSSProperties; children?: React.ReactNode }> = ({ width, height, zone = 'center', align = 'center', style, children }) => {
  const L = layout(width, height);
  const justify = zone === 'center' ? 'center' : zone === 'top' ? 'flex-start' : 'flex-end';
  const padBottom = zone === 'chest' ? L.bottom + L.contentH * 0.1 : L.bottom;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: justify, alignItems: align === 'center' ? 'center' : 'flex-start', padding: `${L.top}px ${L.side}px ${padBottom}px`, textAlign: align === 'center' ? 'center' : 'left', lineHeight: 1.2, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: L.contentW, width: align === 'start' ? '100%' : undefined, ...style }}>{children}</div>
    </div>
  );
};

/** Bloco cinza com rótulo, no lugar de foto ou vídeo. `rosto` marca onde fica a cabeça do apresentador. */
export const Placeholder: React.FC<{ theme: Theme; u: number; rotulo?: string; rosto?: boolean; rotuloCentro?: boolean; style?: React.CSSProperties }> = ({ theme, u, rotulo = 'vídeo', rosto = false, rotuloCentro = false, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: `repeating-linear-gradient(135deg, ${alpha(theme.colors.muted, 0.32)} 0 ${16 * u}px, ${alpha(theme.colors.muted, 0.22)} ${16 * u}px ${32 * u}px)`, ...style }}>
    {rosto && <div style={{ position: 'absolute', left: '50%', top: '30%', width: '34%', aspectRatio: '1 / 1.2', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${3 * u}px dashed ${alpha(theme.colors.text, 0.45)}` }} />}
    <div style={rotuloCentro ? { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.mono, fontSize: 26 * u, color: theme.colors.text, opacity: 0.75, whiteSpace: 'nowrap' } : { position: 'absolute', left: 16 * u, bottom: 14 * u, fontFamily: theme.fonts.mono, fontSize: 30 * u, color: theme.colors.text, opacity: 0.75 }}>[ {rotulo} ]</div>
  </div>
);

/** id estável para máscaras e caminhos SVG. */
export function useStableId(prefix: string): string {
  // cópia local: o projeto usa React 19, então useId existe sempre (a biblioteca original testa antes)
  return `${prefix}-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
