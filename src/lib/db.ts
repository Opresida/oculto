// Banco da lista VIP. Em produção: Neon (DATABASE_URL). No computador, sem DATABASE_URL: um Postgres
// embutido (PGlite) em .data/, só para desenvolver. Em produção sem DATABASE_URL a lista fica fora do ar
// de propósito: melhor avisar do que gravar nome num lugar que some.
import { neon } from '@neondatabase/serverless';

export type Sql = (texto: string, parametros?: unknown[]) => Promise<Record<string, unknown>[]>;

const TABELA = `
  create table if not exists oculto_lista_vip (
    id bigserial primary key,
    nome text not null,
    whatsapp text not null unique,
    criado_em timestamptz not null default now()
  )`;
// o e-mail entrou depois (2026-10-08): a coluna é acrescentada em banco que já existe, sem perder nada
const COLUNA_EMAIL = 'alter table oculto_lista_vip add column if not exists email text';
// presença na portaria (2026-10-09): vazio = ainda não chegou; preenchido = a hora em que a portaria confirmou
const COLUNA_PRESENCA = 'alter table oculto_lista_vip add column if not exists presente_em timestamptz';
// origem (2026-10-09): 'site' = inscrição pelo formulário; outro valor = lista que entrou por fora, como exceção
// (ex.: 'lista-lucas', os 68 nomes anotados antes de existir a lista digital). Essas listas só têm nome, por isso
// o WhatsApp deixa de ser obrigatório NO BANCO; o formulário do site continua exigindo WhatsApp e e-mail.
const COLUNA_ORIGEM = "alter table oculto_lista_vip add column if not exists origem text not null default 'site'";
const WHATSAPP_OPCIONAL = 'alter table oculto_lista_vip alter column whatsapp drop not null';

export class BancoIndisponivel extends Error {}

let pronto: Promise<Sql> | null = null;

async function abrir(): Promise<Sql> {
  const url = process.env.DATABASE_URL;
  let sql: Sql;
  if (url) {
    const http = neon(url);
    sql = async (texto, parametros = []) => (await http.query(texto, parametros)) as Record<string, unknown>[];
  } else if (process.env.NODE_ENV !== 'production') {
    const { PGlite } = await import('@electric-sql/pglite');
    const { mkdirSync } = await import('fs');
    mkdirSync('.data', { recursive: true }); // o PGlite cria a pasta do banco, mas não a pasta-mãe
    const local = new PGlite('.data/pg');
    sql = async (texto, parametros = []) => (await local.query(texto, parametros as never[])).rows as Record<string, unknown>[];
  } else {
    throw new BancoIndisponivel('DATABASE_URL não está configurada');
  }
  // a tabela se cria sozinha no primeiro uso: não há passo de migração para esquecer
  await sql(TABELA);
  await sql(COLUNA_EMAIL);
  await sql(COLUNA_PRESENCA);
  await sql(COLUNA_ORIGEM);
  await sql(WHATSAPP_OPCIONAL);
  return sql;
}

export function banco(): Promise<Sql> {
  if (!pronto) {
    pronto = abrir().catch((erro) => {
      pronto = null; // tenta de novo na próxima chamada
      throw erro;
    });
  }
  return pronto;
}
