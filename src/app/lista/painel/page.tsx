import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BancoIndisponivel } from '@/lib/db';
import { EVENTO } from '@/lib/evento';
import { listar, type Convidado } from '@/lib/lista';
import { porcento, resumir } from '@/lib/painel';
import { logado } from '@/lib/sessao';
import { Colunas, type Coluna } from './graficos';

// Painel de comparecimento: quem se inscreveu × quem a portaria confirmou. Mesma senha da lista.
// Lido sempre na hora: durante a festa, a cada atualização entram as confirmações novas.

export const metadata: Metadata = { title: 'Comparecimento · O.C.U.L.T.O', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const plural = (n: number, um: string, varios: string) => `${n.toLocaleString('pt-BR')} ${n === 1 ? um : varios}`;

export default async function Painel() {
  if (!(await logado())) redirect('/lista');

  let convidados: Convidado[] = [];
  let falha = '';
  try {
    convidados = await listar();
  } catch (e) {
    falha = e instanceof BancoIndisponivel ? 'O banco não está configurado (DATABASE_URL).' : 'Não consegui ler a lista agora. Toque em atualizar.';
  }
  const r = resumir(convidados);

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
          <Link href="/lista/painel" className="rotulo border border-fumaca px-4 py-3 text-prata hover:border-prata-clara hover:text-luz">
            ATUALIZAR
          </Link>
        </div>
      </header>

      {falha ? (
        <p className="mt-8 border border-fumaca px-4 py-6 text-prata-clara">{falha}</p>
      ) : (
        <>
          {/* o número que o painel responde: de quem se inscreveu, quanto veio */}
          <section className="mt-8 border border-grafite bg-grafite/30 p-4 sm:p-6" aria-label="Resumo">
            <div className="flex flex-wrap items-end gap-x-5 gap-y-1">
              <p className="text-6xl font-semibold leading-none text-luz sm:text-7xl">{porcento(r.taxa)}</p>
              <p className="pb-1 text-lg text-prata">{r.inscritos === 0 ? 'ninguém se inscreveu ainda' : 'dos inscritos compareceram'}</p>
            </div>
            <div className="mt-5 h-3 w-full rounded-[2px] bg-fumaca/50" role="img" aria-label={`${plural(r.presentes, 'presente', 'presentes')} de ${plural(r.inscritos, 'inscrito', 'inscritos')}`}>
              <div className="h-3 rounded-[2px] bg-prata-clara" style={{ width: `${Math.round((r.taxa ?? 0) * 100)}%` }} />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                ['Inscritos', r.inscritos],
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
              <p className="mt-3 text-prata">Ainda não há presença confirmada. As leituras aparecem aqui conforme a portaria toca em CONFIRMAR na lista.</p>
            )}
          </section>

          <div className="mt-4 flex flex-col gap-4">
            <Colunas titulo="Chegadas por horário" nota="Confirmações da portaria, de meia em meia hora (horário de Manaus)." colunas={chegadas} vazio="Nenhuma chegada confirmada ainda." />
            <Colunas titulo="Inscrições por dia" nota={`Quantos se inscreveram pelo site em cada dia, e quantos desses vieram.${r.porFora.inscritos ? ` Fora deste gráfico: ${r.porFora.inscritos} nomes de listas que entraram por fora do site.` : ''}`} colunas={porDia} vazio="Nenhuma inscrição ainda." />
          </div>
        </>
      )}
    </main>
  );
}
