// Três curvas do padrão O.C.U.L.T.O, sobre o easing.ts da biblioteca.
import { progress, easeOutStrong, easeInOut, clamp } from '../easing';

/** Entrada e foco: opacidade, subida, desfoque saindo. */
export const entrar = (frame: number, inicio: number, duracao: number, de = 0, para = 1) =>
  de + (para - de) * progress(frame, inicio, duracao, easeOutStrong);

/** Movimento de bloco e de câmera. */
export const deslizar = (frame: number, inicio: number, duracao: number, de = 0, para = 1) =>
  de + (para - de) * progress(frame, inicio, duracao, easeInOut);

/** Sobe e volta (0 → 1 → 0). Usado no rack focus. */
export const pulso = (frame: number, inicio: number, duracao: number) =>
  Math.sin(Math.PI * clamp((frame - inicio) / duracao));

/** Cenas do anúncio de artista, em quadros a 30 fps (17,4 s). */
export const CENAS = { pontos: 0, logo: 66, slogan: 165, atracao: 237, data: 345, final: 432, fim: 522 };
