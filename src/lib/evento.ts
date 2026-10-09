// Dados do evento. Tudo que aparece na página sobre a festa sai daqui.
// Regras da lista confirmadas pelo Humberto em 2026-10-08: nome + WhatsApp; entrada gratuita
// pela lista até as 23h; a página aceita nomes até domingo às 23h (horário de Manaus).

export const EVENTO = {
  nome: 'O.C.U.L.T.O',
  slogan: 'ONDE CURTIMOS UMA LIBERDADE TOTALMENTE OBSCURA',
  edicao: '4ª EDIÇÃO',
  realizacao: 'Royals Entretenimento',
  local: 'Allnight',
  cidade: 'Manaus',
  dia: 'DOMINGO',
  data: '11.10',
  dataExtenso: 'domingo, 11 de outubro',
  vespera: 'VÉSPERA DE FERIADO',
  limiteLista: '23h',
};

/** Fim da lista: domingo 11/10/2026 às 23h em Manaus (UTC−4). Vale para a entrada e para o formulário. */
export const FECHA_LISTA = new Date('2026-10-12T03:00:00.000Z');
export const listaAberta = (agora: number = Date.now()) => agora < FECHA_LISTA.getTime();

/** Compra de ingressos. O endereço veio do link da bio; tirei o identificador de clique e marquei a origem. */
export const INGRESSOS = 'https://shopingressos.com.br/comprar/5177/o-c-u-l-t-o?utm_source=pagina-vip&utm_medium=site&utm_campaign=oculto-4';

export type Artista = { id: string; nome: string; selo: string; foto: string; largura: number; altura: number; /** aproxima a foto no cartão do line-up (1 = sem aproximar) */ zoomCartao?: number };

/** Flakkë é o artista principal: fica no centro e na frente em toda montagem. */
export const ARTISTAS: Artista[] = [
  { id: 'jyou', nome: 'JYOU GUERRA', selo: 'NO LINE-UP', foto: '/img/jyou.webp', largura: 786, altura: 1300 },
  { id: 'flakke', nome: 'FLAKKE', selo: 'ATRAÇÃO PRINCIPAL', foto: '/img/flakke.webp', largura: 1000, altura: 1300, zoomCartao: 1.18 },
  { id: 'bertolossi', nome: 'DJ BERTOLOSSI', selo: 'NO LINE-UP', foto: '/img/bertolossi.webp', largura: 949, altura: 1300 },
];

export const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3300');
