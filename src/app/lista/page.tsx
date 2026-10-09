import type { Metadata } from 'next';
import Link from 'next/link';
import { BancoIndisponivel } from '@/lib/db';
import { EVENTO, listaAberta } from '@/lib/evento';
import { listar, type Convidado } from '@/lib/lista';
import { porcento } from '@/lib/painel';
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

  const presentes = convidados.filter((c) => c.presenteEm).length;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rotulo text-fumaca">
            {EVENTO.nome} · {EVENTO.dia} {EVENTO.data} · {listaAberta() ? `LISTA ABERTA ATÉ ${EVENTO.limiteLista.toUpperCase()}` : 'LISTA ENCERRADA'}
          </p>
          <h1 className="titulo mt-2 text-4xl text-luz">LISTA VIP</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/lista/painel" className="rotulo border border-prata-clara px-4 py-3 text-luz hover:bg-prata-clara hover:text-preto">
            PAINEL
          </Link>
          <a href="/lista/csv" className="rotulo border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">
            BAIXAR PLANILHA
          </a>
          <form action={sair}>
            <button className="rotulo cursor-pointer border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">SAIR</button>
          </form>
        </div>
      </header>
      {falha ? (
        <p className="mt-8 border border-fumaca px-4 py-6 text-prata-clara">{falha}</p>
      ) : (
        <>
          {/* quantos já chegaram: a régua enche a cada CONFIRMAR */}
          <div className="mt-6" role="img" aria-label={`${presentes} presentes de ${convidados.length} inscritos`}>
            <p className="rotulo flex justify-between text-prata">
              <span>
                <strong className="font-medium text-luz">{presentes}</strong> PRESENTES DE {convidados.length}
              </span>
              <span className="text-luz">{porcento(convidados.length ? presentes / convidados.length : null)}</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-[2px] bg-fumaca/50">
              <div className="h-2 rounded-[2px] bg-prata-clara" style={{ width: `${convidados.length ? Math.round((presentes / convidados.length) * 100) : 0}%` }} />
            </div>
          </div>
          <div className="mt-4"><Tabela convidados={convidados} /></div>
        </>
      )}
    </main>
  );
}
