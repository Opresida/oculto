// Regras da lista VIP: validar, gravar sem repetir, listar e remover.
import { banco } from './db';

export type Convidado = { id: number; nome: string; whatsapp: string; email: string; criadoEm: string };

/** Nome com espaços arrumados e iniciais maiúsculas ("de", "da", "dos" ficam minúsculos). */
export function arrumarNome(bruto: string): string {
  const minusculas = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
  return bruto
    .normalize('NFC')
    .replace(/[^\p{L}\s'.-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('pt-BR')
    .split(' ')
    .map((p, i) => (i > 0 && minusculas.has(p) ? p : p.charAt(0).toLocaleUpperCase('pt-BR') + p.slice(1)))
    .join(' ');
}

/** Só os dígitos, sem o 55 da frente. Devolve null se não for um telefone brasileiro com DDD. */
export function arrumarWhatsapp(bruto: string): string | null {
  let d = bruto.replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d.length === 11 && d[2] !== '9') return null;
  if (/^(\d)\1+$/.test(d)) return null;
  return d;
}

/** E-mail em minúsculas e sem espaços. Devolve null se não tiver cara de e-mail. */
export function arrumarEmail(bruto: string): string | null {
  const e = bruto.trim().toLowerCase();
  if (e.length < 6 || e.length > 120) return null;
  return /^[a-z0-9._%+-]+@[a-z0-9-]+(.[a-z0-9-]+)*.[a-z]{2,}$/.test(e) && !e.includes('..') ? e : null;
}

export const mostrarWhatsapp = (d: string) => (d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`);

export type Entrada = { ok: true; nome: string; jaEstava: boolean } | { ok: false; erro: string };

export function validar(nomeBruto: unknown, whatsappBruto: unknown, emailBruto: unknown): { nome: string; whatsapp: string; email: string } | { erro: string } {
  if (typeof nomeBruto !== 'string' || typeof whatsappBruto !== 'string' || typeof emailBruto !== 'string') return { erro: 'Preencha nome, WhatsApp e e-mail.' };
  const nome = arrumarNome(nomeBruto);
  if (nome.length < 5 || nome.length > 80 || nome.split(' ').length < 2) return { erro: 'Escreva nome e sobrenome, como no documento.' };
  const whatsapp = arrumarWhatsapp(whatsappBruto);
  if (!whatsapp) return { erro: 'WhatsApp inválido. Use DDD + número.' };
  const email = arrumarEmail(emailBruto);
  if (!email) return { erro: 'E-mail inválido. Confira se digitou certo.' };
  return { nome, whatsapp, email };
}

/** Grava o nome. Se o WhatsApp já está na lista, não duplica: devolve o nome que já estava (e completa o e-mail, se faltava). */
export async function entrarNaLista(nome: string, whatsapp: string, email: string): Promise<Entrada> {
  const sql = await banco();
  const novo = await sql('insert into oculto_lista_vip (nome, whatsapp, email) values ($1, $2, $3) on conflict (whatsapp) do nothing returning nome', [nome, whatsapp, email]);
  if (novo.length > 0) return { ok: true, nome: String(novo[0].nome), jaEstava: false };
  await sql('update oculto_lista_vip set email = $2 where whatsapp = $1 and email is null', [whatsapp, email]);
  const antigo = await sql('select nome from oculto_lista_vip where whatsapp = $1', [whatsapp]);
  return { ok: true, nome: String(antigo[0]?.nome ?? nome), jaEstava: true };
}

export async function listar(): Promise<Convidado[]> {
  const sql = await banco();
  const linhas = await sql('select id, nome, whatsapp, email, criado_em from oculto_lista_vip order by lower(nome), id');
  return linhas.map((l) => ({ id: Number(l.id), nome: String(l.nome), whatsapp: String(l.whatsapp), email: String(l.email ?? ''), criadoEm: new Date(l.criado_em as string).toISOString() }));
}

export async function remover(id: number): Promise<void> {
  const sql = await banco();
  await sql('delete from oculto_lista_vip where id = $1', [id]);
}
