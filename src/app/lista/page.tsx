import type { Metadata } from 'next';
import Link from 'next/link';
import { BancoIndisponivel } from '@/lib/db';
import { EVENTO, listaAberta } from '@/lib/evento';
import { listar, type Convidado } from '@/lib/lista';
import { logado, senhaConfigurada } from '@/lib/sessao';
import { entrar, sair } from './actions';
import { Tabela } from './tabela';

// Lista da portaria. Só entra com a senha (LISTA_SENHA). Sempre lida na hora, nunca de cache:
// a página aceita nomes até as 23h e a portaria precisa ver quem acabou de entrar.

export const metadata: Metadata = { title: 'Lista da portaria · O.C.U.L.T.O', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Lista({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;

  if (!(await logado())) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-12">
        <p className="rotulo text-fumaca">{EVENTO.nome} · PORTARIA</p>
        <h1 className="titulo mt-3 text-4xl text-luz">LISTA VIP</h1>
        {senhaConfigurada() ? (
          <form action={entrar} className="mt-8 flex flex-col gap-3">
            <label htmlFor="senha" className="rotulo text-prata">
              SENHA DA PORTARIA
            </label>
            <input id="senha" name="senha" type="password" required autoFocus autoComplete="current-password" className="border border-fumaca bg-grafite px-4 py-3 text-lg text-luz outline-none focus:border-prata-clara" />
            {erro && <p className="text-sm text-prata-clara">Senha incorreta.</p>}
            <button className="titulo mt-2 cursor-pointer bg-prata-clara px-5 py-3.5 text-base text-preto hover:bg-white">ABRIR A LISTA</button>
          </form>
        ) : (
          <p className="mt-6 text-prata">A lista ainda não tem senha. Defina a variável LISTA_SENHA (6 caracteres ou mais) na Vercel e publique de novo.</p>
        )}
        <Link href="/" className="rotulo mt-10 text-fumaca underline underline-offset-4 hover:text-luz">
          ← PÁGINA DA FESTA
        </Link>
      </main>
    );
  }

  let convidados: Convidado[] = [];
  let falha = '';
  try {
    convidados = await listar();
  } catch (e) {
    falha = e instanceof BancoIndisponivel ? 'O banco não está configurado (DATABASE_URL).' : 'Não consegui ler a lista agora. Toque em atualizar.';
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rotulo text-fumaca">
            {EVENTO.nome} · {EVENTO.dia} {EVENTO.data} · {listaAberta() ? `LISTA ABERTA ATÉ ${EVENTO.limiteLista.toUpperCase()}` : 'LISTA ENCERRADA'}
          </p>
          <h1 className="titulo mt-2 text-4xl text-luz">LISTA VIP</h1>
        </div>
        <div className="flex gap-2">
          <a href="/lista/csv" className="rotulo border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">
            BAIXAR PLANILHA
          </a>
          <form action={sair}>
            <button className="rotulo cursor-pointer border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">SAIR</button>
          </form>
        </div>
      </header>
      {falha ? <p className="mt-8 border border-fumaca px-4 py-6 text-prata-clara">{falha}</p> : <div className="mt-6"><Tabela convidados={convidados} /></div>}
    </main>
  );
}
