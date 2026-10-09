// Curvas e utilitários de tempo. Tudo é função pura do quadro.

export type Easing = (t: number) => number;

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Só para contadores e barras de progresso. */
export const linear: Easing = (t) => t;
/** Ease-out forte (expo). */
export const easeOutStrong: Easing = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeIn: Easing = (t) => t * t * t;
export const easeInOut: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Passa do ponto e volta. `amount` controla o exagero. */
export const overshoot = (amount = 1.70158): Easing => (t) => {
  const c3 = amount + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + amount * Math.pow(t - 1, 2);
};
export const bounce: Easing = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) { const x = t - 1.5 / d1; return n1 * x * x + 0.75; }
  if (t < 2.5 / d1) { const x = t - 2.25 / d1; return n1 * x * x + 0.9375; }
  const x = t - 2.625 / d1;
  return n1 * x * x + 0.984375;
};

export type SpringConfig = { damping?: number; stiffness?: number; mass?: number };
export const SPRING_SOFT: SpringConfig = { damping: 20, stiffness: 100 };
export const SPRING_SNAPPY: SpringConfig = { damping: 14, stiffness: 160 };
export const SPRING_BOUNCY: SpringConfig = { damping: 9, stiffness: 170 };

/** Mola amortecida analítica: 0 em frame<=0, tende a 1. */
export function spring(frame: number, fps: number, config: SpringConfig = {}): number {
  const { damping = 14, stiffness = 140, mass = 1 } = config;
  if (frame <= 0) return 0;
  const t = frame / fps;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

/** 0→1 entre `start` e `start+length`, com curva. */
export function progress(frame: number, start: number, length: number, easing: Easing = easeOutStrong): number {
  return easing(clamp((frame - start) / length));
}

export function interpolate(value: number, input: [number, number], output: [number, number], easing: Easing = easeOutStrong): number {
  const t = clamp((value - input[0]) / (input[1] - input[0]));
  return output[0] + (output[1] - output[0]) * easing(t);
}

/** 0 até o início da saída, 1 no último quadro. Sempre 0 se `enabled` for falso. */
export function exitProgress(frame: number, durationInFrames: number, length: number, enabled = true): number {
  if (!enabled) return 0;
  return clamp((frame - (durationInFrames - length)) / length);
}

/** Aleatório com semente fixa (mulberry32). */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const msToFrames = (ms: number, fps: number) => (ms / 1000) * fps;
export const framesToMs = (frame: number, fps: number) => (frame / fps) * 1000;
