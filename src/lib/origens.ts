// De onde veio cada nome da lista. Fica num arquivo sem banco para a tela da portaria (que roda no navegador)
// poder usar: importar de lista.ts levaria o código do banco junto e quebraria a página.
// 'site' = inscrição pelo formulário. O resto são listas que entraram por fora, como exceção autorizada.
export const ORIGENS: Record<string, string> = { site: 'Site', 'lista-lucas': 'Lista Lucas' };
export const nomeDaOrigem = (o: string) => ORIGENS[o] ?? o;
