import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BancoIndisponivel } from '@/lib/db';
import { EVENTO } from '@/lib/evento';
import { listar, type Convidado } from '@/lib/lista';
import { nomeDaOrigem, origensPresentes } from '@/lib/origens';
import { porcento, resumir } from '@/lib/painel';
import { logado } from '@/lib/sessao';
import { Colunas, type Coluna } from './graficos';

// Painel de comparecimento: quem se inscreveu × quem a portaria confirmou. Mesma senha da lista.
// Lido sempre na hora: durante a festa, a cada atualização entram as confirmações novas.
// O filtro por indicação (?origem=) fica num lugar só, acima de tudo, e vale para a página inteira.

export const metadata: Metadata = { title: 'Comparecimento · O.C.U.L.T.O', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const plural = (n: number, um: string, varios: string) => `${n.toLocaleString('pt-BR')} ${n === 1 ? um : varios}`;
const quando = (iso: string) => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Manaus', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const chip = (ativo: boolean) => `rotulo shrink-0 whitespace-nowrap border px-2.5 py-2 ${ativo ? 'border-prata-clara bg-prata-clara text-preto' : 'border-fumaca text-prata hover:border-prata-clara hover:text-luz'}`;

export default async function Painel({ searchParams }: { searchParams: Promise<{ origem?: string }> }) {
  if (!(await logado())) redirect('/lista');
  const { origem: pedida } = await searchParams;

  let todos: Convidado[] = [];
  let falha = '';
  try {
    todos = await listar();
  } catch (e) {
    falha = e instanceof BancoIndisponivel ? 'O banco não está configurado (DATABASE_URL).' : 'Não consegui ler a lista agora. Toque em atualizar.';
  }
  const origens = origensPresentes(todos.map((c) => c.origem));
  const origem = pedida && origens.includes(pedida) ? pedida : null;
  const convidados = origem ? todos.filter((c) => c.origem === origem) : todos;
  const r = resumir(convidados);
  const linkDe = (o: string | null) => (o ? `/lista/painel?origem=${encodeURIComponent(o)}` : '/lista/painel');

  const chegadas: Coluna[] = r.chegadas.map((f) => ({
    rotulo: f.rotulo,
    descricao: `Das ${f.rotulo} às ${f.ate}: ${plural(f.valor, 'chegada', 'chegadas')}`,
    partes: [{ nome: 'Chegadas', valor: f.valor, forte: true }],
  }));
  const porDia: Coluna[] = r.porDia.map((d) => ({
    rotulo: d.rotulo,
    descricao: `${d.rotulo}: ${plural(d.inscritos, 'inscrito', 'inscritos')}, ${plural(d.presentes, 'veio', 'vieram')}`,
    partes: [
      { nome: 'Vieram', valor: d.presentes, forte: true },
      { nome: 'Não confirmados', valor: d.inscritos - d.presentes, forte: false },
    ],
  }));
  // uma coluna por indicação: o site e cada lista que entrou por fora
  const porIndicacao: Coluna[] = r.porOrigem.map((g) => ({
    rotulo: g.nome,
    descricao: `${g.nome}: ${plural(g.inscritos, 'nome', 'nomes')}, ${plural(g.presentes, 'veio', 'vieram')}`,
    partes: [
      { nome: 'Vieram', valor: g.presentes, forte: true },
      { nome: 'Não confirmados', valor: g.inscritos - g.presentes, forte: false },
    ],
  }));
  const listaPorFora = origem !== null && origem !== 'site';
  const entrouEm = listaPorFora && convidados.length ? quando(convidados.reduce((m, c) => (c.criadoEm < m ? c.criadoEm : m), convidados[0].criadoEm)) : '';

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rotulo text-fumaca">
            {EVENTO.nome} · {EVENTO.dia} {EVENTO.data} · PORTARIA
          </p>
          <h1 className="titulo mt-2 text-2xl text-luz sm:text-4xl">COMPARECIMENTO</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/lista" className="rotulo border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">
            ← LISTA
          </Link>
          <Link href={linkDe(origem)} className="rotulo border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">
            ATUALIZAR
          </Link>
        </div>
      </header>

      {/* filtro por indicação: vale para tudo abaixo */}
      {!falha && origens.length > 1 && (
        <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" aria-label="Indicação">
          <Link href={linkDe(null)} aria-current={origem === null ? 'page' : undefined} className={chip(origem === null)}>
            TODAS {todos.length}
          </Link>
          {origens.map((o) => (
            <Link key={o} href={linkDe(o)} aria-current={origem === o ? 'page' : undefined} className={chip(origem === o)}>
              {nomeDaOrigem(o).toUpperCase()} {todos.filter((c) => c.origem === o).length}
            </Link>
          ))}
        </nav>
      )}

      {falha ? (
        <p className="mt-8 border border-fumaca px-4 py-6 text-prata-clara">{falha}</p>
      ) : (
        <>
          {/* o número que o painel responde: de quem se inscreveu, quanto veio */}
          <section className="mt-4 border border-grafite bg-grafite/30 p-4 sm:p-6" aria-label="Resumo">
            {origem && <p className="rotulo mb-3 text-apoio">SÓ {nomeDaOrigem(origem).toUpperCase()}</p>}
            <div className="flex flex-wrap items-end gap-x-5 gap-y-1">
              <p className="text-6xl font-semibold leading-none text-luz sm:text-7xl">{porcento(r.taxa)}</p>
              <p className="pb-1 text-lg text-prata">{r.inscritos === 0 ? 'ninguém nesta lista ainda' : 'dos nomes compareceram'}</p>
            </div>
            <div className="mt-5 h-3 w-full rounded-[2px] bg-fumaca/50" role="img" aria-label={`${plural(r.presentes, 'presente', 'presentes')} de ${plural(r.inscritos, 'nome', 'nomes')}`}>
              <div className="h-3 rounded-[2px] bg-prata-clara" style={{ width: `${Math.round((r.taxa ?? 0) * 100)}%` }} />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                ['Na lista', r.inscritos],
                ['Presentes', r.presentes],
                ['Não confirmados', r.ausentes],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="border-t border-fumaca/60 pt-3">
                  <dt className="text-sm text-apoio">{rotulo}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-luz">{Number(valor).toLocaleString('pt-BR')}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* o que os números dizem, em frases. Só aparece quando há presença confirmada. */}
          <section className="mt-4 border border-grafite bg-grafite/30 p-4 sm:p-6" aria-label="Leitura">
            <h2 className="text-lg font-semibold text-luz">O que os números dizem</h2>
            {r.frases.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3 text-prata-clara">
                {r.frases.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-prata-clara" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-prata">Ainda não há presença confirmada{origem ? ' nesta lista' : ''}. As leituras aparecem aqui conforme a portaria toca em CONFIRMAR.</p>
            )}
          </section>

          <div className="mt-4 flex flex-col gap-4">
            {origem === null && porIndicacao.length > 1 && (
              <Colunas titulo="Por indicação" nota="Quantos nomes cada indicação colocou na lista, e quantos deles vieram." colunas={porIndicacao} vazio="Nenhum nome na lista ainda." />
            )}
            <Colunas titulo="Chegadas por horário" nota="Confirmações da portaria, de meia em meia hora (horário de Manaus)." colunas={chegadas} vazio="Nenhuma chegada confirmada ainda." />
            {listaPorFora ? (
              <section className="border border-grafite bg-grafite/30 p-4 text-prata sm:p-6" aria-label="Inscrições por dia">
                <h2 className="text-lg font-semibold text-luz">Inscrições por dia</h2>
                <p className="mt-2">
                  A {nomeDaOrigem(origem as string)} não passou pelo site: os {convidados.length} nomes entraram de uma vez{entrouEm ? `, em ${entrouEm}` : ''}.
                </p>
              </section>
            ) : (
              <Colunas
                titulo="Inscrições por dia"
                nota={`Quantos se inscreveram pelo site em cada dia, e quantos desses vieram.${origem === null && r.porFora.inscritos ? ` Fora deste gráfico: ${r.porFora.inscritos} nomes de listas por indicação (veja "Por indicação").` : ''}`}
                colunas={porDia}
                vazio="Nenhuma inscrição pelo site ainda."
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}
