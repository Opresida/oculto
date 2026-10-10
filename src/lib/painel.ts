// Contas do painel de comparecimento: quem se inscreveu × quem a portaria confirmou.
// Funções puras, sem banco: recebem a lista e devolvem os números e as frases que o painel mostra.
import { FECHA_LISTA } from './evento';
import type { Convidado } from './lista';

/** Manaus é UTC−4 o ano todo (sem horário de verão): basta deslocar e ler em UTC. */
const FUSO_MS = 4 * 3600 * 1000;
const local = (iso: string) => new Date(new Date(iso).getTime() - FUSO_MS);
const dois = (n: number) => String(n).padStart(2, '0');
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIAS_NA = ['no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'];

export type Faixa = { rotulo: string; ate: string; valor: number };
export type Dia = { rotulo: string; quando: string; inscritos: number; presentes: number };
export type Resumo = {
  inscritos: number;
  presentes: number;
  ausentes: number;
  /** presentes ÷ inscritos, de 0 a 1; null quando não há inscritos */
  taxa: number | null;
  ate23: number;
  depois23: number;
  chegadas: Faixa[];
  porDia: Dia[];
  pico: Faixa | null;
  /** nomes que entraram por fora do site (listas de exceção) e quantos deles vieram */
  porFora: { inscritos: number; presentes: number };
  frases: string[];
};

const MEIA_HORA = 30 * 60 * 1000;
const hora = (d: Date) => `${dois(d.getUTCHours())}h${dois(d.getUTCMinutes())}`;

/** Chegadas agrupadas de meia em meia hora, sem buracos entre a primeira e a última. */
function chegadasPorFaixa(convidados: Convidado[]): Faixa[] {
  const tempos = convidados.filter((c) => c.presenteEm).map((c) => local(c.presenteEm as string).getTime());
  if (tempos.length === 0) return [];
  const passo = Math.max(...tempos) - Math.min(...tempos) > 16 * 3600 * 1000 ? 2 * MEIA_HORA : MEIA_HORA;
  const inicio = Math.floor(Math.min(...tempos) / passo) * passo;
  const fim = Math.floor(Math.max(...tempos) / passo) * passo;
  const faixas: Faixa[] = [];
  for (let t = inicio; t <= fim && faixas.length < 60; t += passo) {
    faixas.push({ rotulo: hora(new Date(t)), ate: hora(new Date(t + passo)), valor: tempos.filter((x) => x >= t && x < t + passo).length });
  }
  return faixas;
}

/** Inscrições por dia, com quantos de cada dia apareceram. */
function inscricoesPorDia(convidados: Convidado[]): Dia[] {
  if (convidados.length === 0) return [];
  const DIA = 24 * 3600 * 1000;
  const diaDe = (iso: string) => Math.floor(local(iso).getTime() / DIA);
  const dias = convidados.map((c) => diaDe(c.criadoEm));
  const saida: Dia[] = [];
  for (let d = Math.min(...dias); d <= Math.max(...dias) && saida.length < 31; d++) {
    const data = new Date(d * DIA);
    const doDia = convidados.filter((c) => diaDe(c.criadoEm) === d);
    saida.push({
      rotulo: `${DIAS[data.getUTCDay()]} ${dois(data.getUTCDate())}/${dois(data.getUTCMonth() + 1)}`,
      quando: DIAS_NA[data.getUTCDay()],
      inscritos: doDia.length,
      presentes: doDia.filter((c) => c.presenteEm).length,
    });
  }
  return saida;
}

const pessoas = (n: number) => (n === 1 ? '1 pessoa' : `${n} pessoas`);

export function resumir(convidados: Convidado[]): Resumo {
  const inscritos = convidados.length;
  const presentes = convidados.filter((c) => c.presenteEm).length;
  const taxa = inscritos > 0 ? presentes / inscritos : null;
  const limite = FECHA_LISTA.getTime();
  const ate23 = convidados.filter((c) => c.presenteEm && new Date(c.presenteEm).getTime() <= limite).length;
  const chegadas = chegadasPorFaixa(convidados);
  // o gráfico por dia só faz sentido para quem se inscreveu pelo site: lista que entra por fora chega toda de uma vez
  const doSite = convidados.filter((c) => c.origem === 'site');
  const deFora = convidados.filter((c) => c.origem !== 'site');
  const porFora = { inscritos: deFora.length, presentes: deFora.filter((c) => c.presenteEm).length };
  const porDia = inscricoesPorDia(doSite);
  const pico = chegadas.reduce<Faixa | null>((m, f) => (f.valor > (m?.valor ?? 0) ? f : m), null);

  // as frases só afirmam o que os números sustentam; com pouca gente, ficam de fora
  const frases: string[] = [];
  if (presentes > 0 && taxa !== null) {
    const em10 = Math.round(taxa * 10);
    const verbo = (n: number) => (n === 1 ? 'veio' : 'vieram');
    frases.push(inscritos >= 10 && em10 >= 1 ? `De cada 10 inscritos, ${em10} ${verbo(em10)}.` : `${presentes} de ${inscritos} inscritos ${verbo(presentes)}.`);
    if (pico && pico.valor >= 2) frases.push(`Pico de chegada: das ${pico.rotulo} às ${pico.ate}, com ${pessoas(pico.valor)}.`);
    frases.push(
      presentes - ate23 === 0
        ? `Todos os presentes chegaram até as 23h, dentro da entrada gratuita.`
        : `${pessoas(ate23)} ${ate23 === 1 ? 'chegou' : 'chegaram'} até as 23h (entrada gratuita); ${pessoas(presentes - ate23)} depois.`,
    );
    const presentesSite = doSite.filter((c) => c.presenteEm).length;
    if (porFora.inscritos >= 5 && doSite.length >= 5) {
      frases.push(`Das inscrições pelo site vieram ${Math.round((presentesSite / doSite.length) * 100)}%; das listas que entraram por fora, ${Math.round((porFora.presentes / porFora.inscritos) * 100)}%.`);
    }
    const comparaveis = porDia.filter((d) => d.inscritos >= 5);
    if (comparaveis.length >= 2) {
      const melhor = comparaveis.reduce((m, d) => (d.presentes / d.inscritos > m.presentes / m.inscritos ? d : m));
      frases.push(`Quem se inscreveu ${melhor.quando} foi quem mais compareceu: ${Math.round((melhor.presentes / melhor.inscritos) * 100)}%.`);
    }
  }

  return { inscritos, presentes, ausentes: inscritos - presentes, taxa, ate23, depois23: presentes - ate23, chegadas, porDia, pico, porFora, frases };
}

export const porcento = (taxa: number | null) => (taxa === null ? '—' : `${Math.round(taxa * 100)}%`);
