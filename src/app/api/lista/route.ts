// Entrada de nomes na lista VIP. Público, por isso tem travas: lista fechada depois do horário,
// campo-isca contra robô e limite de envios por endereço.
import { NextResponse } from 'next/server';
import { BancoIndisponivel } from '@/lib/db';
import { listaAberta } from '@/lib/evento';
import { entrarNaLista, validar } from '@/lib/lista';

const JANELA = 10 * 60 * 1000;
// folgado de propósito: no 4G muita gente sai pelo mesmo endereço, e um grupo se inscreve junto.
// Quem segura repetição é o WhatsApp único; isto aqui só freia enxurrada de robô.
const MAXIMO = 40;
const envios = new Map<string, number[]>();

function passouDoLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA);
  recentes.push(agora);
  envios.set(ip, recentes);
  if (envios.size > 5000) envios.clear();
  return recentes.length > MAXIMO;
}

const responder = (corpo: Record<string, unknown>, status = 200) => NextResponse.json(corpo, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (!listaAberta()) return responder({ ok: false, erro: 'A lista já encerrou.', encerrada: true }, 410);

  let corpo: Record<string, unknown>;
  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return responder({ ok: false, erro: 'Envio inválido.' }, 400);
  }

  // campo-isca: gente não vê nem preenche; robô preenche. Responde "ok" sem gravar.
  if (typeof corpo.site === 'string' && corpo.site.trim() !== '') return responder({ ok: true, nome: 'Convidado', jaEstava: false });
  if (corpo.aceite !== true) return responder({ ok: false, erro: 'Marque que concorda com o uso dos dados para a lista.' }, 400);

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  if (passouDoLimite(ip)) return responder({ ok: false, erro: 'Muitos envios seguidos. Tente de novo em alguns minutos.' }, 429);

  const dados = validar(corpo.nome, corpo.whatsapp);
  if ('erro' in dados) return responder({ ok: false, erro: dados.erro }, 400);

  try {
    return responder(await entrarNaLista(dados.nome, dados.whatsapp));
  } catch (erro) {
    console.error('lista: falha ao gravar', erro instanceof BancoIndisponivel ? erro.message : erro);
    return responder({ ok: false, erro: 'A lista está fora do ar neste momento. Tente de novo em instantes.' }, 503);
  }
}
