'use client';

import { useState } from 'react';

// Gráfico de colunas do painel. Dentro do brandbook não há cor fora das fotos, então a leitura é por
// ênfase: o que importa em prata clara, o resto em cinza. Quem identifica cada série é a legenda e os
// rótulos, não a cor (o par passa em separação e contraste sobre o preto; croma zero é escolha da marca).
// Colunas finas (no máximo 24 px), topo arredondado, base reta, 2 px de respiro entre partes empilhadas,
// valor só na coluna mais alta, e o resto no toque/foco e na tabela.

export type Parte = { nome: string; valor: number; forte: boolean };
export type Coluna = { rotulo: string; descricao: string; partes: Parte[] };

const TOM = { forte: '#e4e4e1', fraco: '#6f6f6d' };
const ALTURA = 190;

/** Topo redondo da escala (1, 2, 4, 5, 10, 20…), para os degraus do eixo caírem em números limpos. */
function topoDaEscala(max: number): number {
  if (max <= 1) return 1;
  const p = 10 ** Math.floor(Math.log10(max));
  return [1, 2, 4, 5, 10].map((m) => m * p).find((v) => v >= max) ?? max;
}

export function Colunas({ titulo, nota, colunas, vazio }: { titulo: string; nota?: string; colunas: Coluna[]; vazio: string }) {
  const [ativa, setAtiva] = useState<number | null>(null);
  const total = (c: Coluna) => c.partes.reduce((s, p) => s + p.valor, 0);
  const max = Math.max(0, ...colunas.map(total));
  const topo = topoDaEscala(max);
  const degraus = topo % 2 === 0 ? [0, topo / 2, topo] : [0, topo];
  const series = colunas[0]?.partes.map((p) => ({ nome: p.nome, forte: p.forte })) ?? [];
  const maior = colunas.findIndex((c) => total(c) === max);
  const cadaRotulo = Math.max(1, Math.ceil(colunas.length / 7));

  return (
    <section className="border border-grafite bg-grafite/30 p-4 sm:p-6" aria-label={titulo}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-lg font-semibold text-luz">{titulo}</h2>
        {series.length >= 2 && (
          <ul className="flex gap-4 text-sm text-prata">
            {series.map((s) => (
              <li key={s.nome} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-[2px]" style={{ background: s.forte ? TOM.forte : TOM.fraco }} aria-hidden />
                {s.nome}
              </li>
            ))}
          </ul>
        )}
      </div>
      {nota && <p className="mt-1 text-sm text-apoio">{nota}</p>}

      {max === 0 ? (
        <p className="mt-6 border-t border-grafite pt-6 text-prata">{vazio}</p>
      ) : (
        <>
          <div className="mt-6 flex gap-2">
            {/* eixo: os valores que não estão escritos nas colunas */}
            <div className="relative w-7 shrink-0 text-right text-xs text-apoio [font-variant-numeric:tabular-nums]" style={{ height: ALTURA }} aria-hidden>
              {degraus.map((d) => (
                <span key={d} className="absolute right-0 -translate-y-1/2" style={{ top: ALTURA - (d / topo) * ALTURA }}>
                  {d.toLocaleString('pt-BR')}
                </span>
              ))}
            </div>
            <div className="relative min-w-0 flex-1" style={{ height: ALTURA }} onPointerLeave={() => setAtiva(null)}>
              {degraus.map((d) => (
                <div key={d} className="absolute inset-x-0 h-px bg-grafite" style={{ top: ALTURA - (d / topo) * ALTURA, background: d === 0 ? '#4a4a49' : undefined }} aria-hidden />
              ))}
              <div className="absolute inset-0 flex items-end">
                {colunas.map((c, i) => {
                  const partes = c.partes.filter((p) => p.valor > 0);
                  return (
                    <div
                      key={c.rotulo + i}
                      tabIndex={0}
                      role="img"
                      aria-label={c.descricao}
                      onPointerEnter={() => setAtiva(i)}
                      onFocus={() => setAtiva(i)}
                      onBlur={() => setAtiva(null)}
                      className="relative flex h-full min-w-0 flex-1 cursor-default flex-col items-center justify-end outline-none"
                    >
                      {i === maior && ativa === null && <span className="mb-1 text-xs font-semibold text-luz">{total(c).toLocaleString('pt-BR')}</span>}
                      <div className="flex w-[70%] max-w-6 flex-col-reverse gap-[2px]" style={{ opacity: ativa === null || ativa === i ? 1 : 0.45, transition: 'opacity .15s' }}>
                        {partes.map((p, k) => (
                          <div key={p.nome} style={{ height: Math.max(2, (p.valor / topo) * ALTURA - (k > 0 ? 2 : 0)), background: p.forte ? TOM.forte : TOM.fraco, borderRadius: k === partes.length - 1 ? '4px 4px 0 0' : 0 }} />
                        ))}
                      </div>
                      {ativa === i && <span className="pointer-events-none absolute inset-x-0 bottom-0 top-0 border-x border-fumaca/60" aria-hidden />}
                    </div>
                  );
                })}
              </div>
              {/* leitura da coluna tocada: o valor na frente, o nome depois */}
              {ativa !== null && colunas[ativa] && (
                <div
                  className="pointer-events-none absolute top-0 z-10 w-max max-w-[220px] -translate-y-[calc(100%+6px)] border border-fumaca bg-preto px-3 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,.6)]"
                  style={{ left: `${((ativa + 0.5) / colunas.length) * 100}%`, transform: `translate(${ativa < colunas.length / 2 ? '0' : '-100%'}, calc(-100% - 6px))` }}
                  role="status"
                >
                  <p className="text-apoio">{colunas[ativa].rotulo}</p>
                  {colunas[ativa].partes.map((p) => (
                    <p key={p.nome} className="mt-1 flex items-center gap-2 text-prata">
                      <span className="h-[3px] w-3" style={{ background: p.forte ? TOM.forte : TOM.fraco }} aria-hidden />
                      <strong className="font-semibold text-luz">{p.valor.toLocaleString('pt-BR')}</strong>
                      {p.nome.toLowerCase()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="ml-9 mt-2 flex text-xs text-apoio" aria-hidden>
            {colunas.map((c, i) => (
              <span key={c.rotulo + i} className="min-w-0 flex-1 whitespace-nowrap text-center">
                {i % cadaRotulo === 0 ? c.rotulo : ''}
              </span>
            ))}
          </div>

          <details className="mt-4 text-sm text-prata">
            <summary className="rotulo cursor-pointer text-apoio hover:text-luz">VER EM TABELA</summary>
            <table className="mt-3 w-full border-collapse text-left [font-variant-numeric:tabular-nums]">
              <thead>
                <tr className="border-b border-grafite text-apoio">
                  <th className="py-2 pr-4 font-normal">Quando</th>
                  {series.map((s) => <th key={s.nome} className="py-2 pr-4 text-right font-normal">{s.nome}</th>)}
                </tr>
              </thead>
              <tbody>
                {colunas.map((c, i) => (
                  <tr key={c.rotulo + i} className="border-b border-grafite/60">
                    <td className="py-2 pr-4">{c.rotulo}</td>
                    {c.partes.map((p) => <td key={p.nome} className="py-2 pr-4 text-right text-luz">{p.valor.toLocaleString('pt-BR')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </section>
  );
}
