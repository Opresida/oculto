// Planilha da lista (CSV que o Excel abre com acento certo). Mesma senha da tela da portaria.
import { listar, mostrarWhatsapp } from '@/lib/lista';
import { nomeDaOrigem } from '@/lib/origens';
import { logado } from '@/lib/sessao';

export const dynamic = 'force-dynamic';

const celula = (t: string) => `"${t.replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await logado())) return new Response('Entre em /lista com a senha.', { status: 401 });
  const convidados = await listar();
  const linhas = [
    ['Nome', 'WhatsApp', 'E-mail', 'Origem', 'Entrou na lista em', 'Compareceu', 'Chegou em'].map(celula).join(';'),
    ...convidados.map((c) => [c.nome, mostrarWhatsapp(c.whatsapp), c.email, nomeDaOrigem(c.origem), new Date(c.criadoEm).toLocaleString('pt-BR', { timeZone: 'America/Manaus' }), c.presenteEm ? 'Sim' : 'Não', c.presenteEm ? new Date(c.presenteEm).toLocaleString('pt-BR', { timeZone: 'America/Manaus' }) : ''].map(celula).join(';')),
  ];
  return new Response('﻿' + linhas.join('\r\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="oculto-lista-vip.csv"', 'Cache-Control': 'no-store' },
  });
}
