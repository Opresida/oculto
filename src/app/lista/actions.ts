'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { remover } from '@/lib/lista';
import { COOKIE, logado, novaSessao, senhaConfere } from '@/lib/sessao';

export async function entrar(dados: FormData) {
  await new Promise((r) => setTimeout(r, 600)); // freia tentativa em série
  if (!senhaConfere(String(dados.get('senha') ?? ''))) redirect('/lista?erro=1');
  const sessao = novaSessao();
  (await cookies()).set(COOKIE, sessao.valor, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/lista', maxAge: sessao.segundos });
  redirect('/lista');
}

export async function sair() {
  (await cookies()).set(COOKIE, '', { path: '/lista', maxAge: 0 });
  redirect('/lista');
}

export async function removerDaLista(dados: FormData) {
  if (!(await logado())) redirect('/lista');
  const id = Number(dados.get('id'));
  if (Number.isInteger(id) && id > 0) await remover(id);
  revalidatePath('/lista');
}
