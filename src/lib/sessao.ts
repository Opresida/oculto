// Acesso à lista (/lista): uma senha só, definida em LISTA_SENHA. A sessão é um cookie assinado
// com a própria senha: trocar a senha derruba quem estava logado.
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const COOKIE = 'oculto_lista';
const DURACAO = 12 * 60 * 60 * 1000; // uma noite de portaria

const senha = () => process.env.LISTA_SENHA || '';
export const senhaConfigurada = () => senha().length >= 6;

const assinar = (texto: string) => createHmac('sha256', senha()).update(texto).digest('hex');

function igual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const senhaConfere = (tentativa: string) => senhaConfigurada() && igual(assinar(`senha:${tentativa}`), assinar(`senha:${senha()}`));

export function novaSessao(): { valor: string; segundos: number } {
  const expira = Date.now() + DURACAO;
  return { valor: `${expira}.${assinar(`sessao:${expira}`)}`, segundos: DURACAO / 1000 };
}

export async function logado(): Promise<boolean> {
  if (!senhaConfigurada()) return false;
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return false;
  const [expira, assinatura] = valor.split('.');
  if (!expira || !assinatura || Number(expira) < Date.now()) return false;
  return igual(assinatura, assinar(`sessao:${expira}`));
}
