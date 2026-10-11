// De onde veio cada nome da lista. Fica num arquivo sem banco para a tela da portaria (que roda no navegador)
// poder usar: importar de lista.ts levaria o código do banco junto e quebraria a página.
// 'site' = inscrição pelo formulário. O resto são listas por indicação que entraram por fora, só com o nome,
// sempre a pedido do Humberto e por script (não existe botão de adicionar nome na portaria).
export const ORIGENS: Record<string, string> = {
  site: 'Site',
  'lista-lucas': 'Lista Lucas',
  'lista-renan': 'Lista Renan',
  'aniversario-mara-lima': 'Aniversário Mara Lima',
};
export const nomeDaOrigem = (o: string) => ORIGENS[o] ?? o;

/** Ordem nos filtros e nos gráficos: o site primeiro, depois as listas na ordem em que chegaram. */
export const ORDEM_ORIGENS = ['site', 'lista-lucas', 'lista-renan', 'aniversario-mara-lima'];

/** As origens que aparecem na lista, na ordem certa (uma origem nova, ainda sem lugar na ordem, vai para o fim). */
export function origensPresentes(origens: string[]): string[] {
  const tem = new Set(origens);
  return [...ORDEM_ORIGENS.filter((o) => tem.has(o)), ...[...tem].filter((o) => !ORDEM_ORIGENS.includes(o)).sort()];
}
