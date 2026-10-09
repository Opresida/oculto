# O.C.U.L.T.O · página do evento

Página da 4ª edição da festa O.C.U.L.T.O (Royals Entretenimento · domingo 11.10.2026 · Allnight, Manaus).
Objetivo principal: colocar nomes na **lista VIP**. Objetivo secundário: levar para a compra de ingresso.

Feita pela BrandSquad. Next.js 16 (App Router) + Tailwind 4, hospedada na Vercel, banco no Neon.

## Rodar no computador

```bash
pnpm install
pnpm dev          # http://localhost:3300
```

Sem `DATABASE_URL`, o desenvolvimento usa um Postgres embutido (PGlite) na pasta `.data/`, que não vai
para o repositório. Para abrir a portaria no computador: `LISTA_SENHA=uma-senha pnpm dev`.

## Rotas

| Rota | O que é |
|---|---|
| `/` | Página do evento: abertura de 4 s, artistas, contagem, formulário da lista, ingressos |
| `/lista` | Portaria: a lista de nomes, com busca, retirada de nome e planilha. Pede senha |
| `/lista/csv` | Planilha da lista (abre no Excel). Só com a portaria aberta |
| `POST /api/lista` | Recebe nome + WhatsApp do formulário |

## Publicar (Vercel)

1. Importar este repositório na Vercel (projeto novo, configuração padrão de Next.js).
2. Em *Settings → Environment Variables*, criar:
   - `DATABASE_URL`: endereço de conexão do projeto "oculto" no Neon (painel do Neon → Connect, com *Connection pooling* ligado);
   - `LISTA_SENHA`: senha da portaria (6 caracteres ou mais);
   - `SITE_URL` (opcional): endereço final, se houver domínio próprio.
3. Publicar. A tabela `oculto_lista_vip` se cria sozinha no primeiro nome enviado.

Modelo das variáveis em `.env.example`.

## Estado

- Lista aceita nomes até **domingo 11.10.2026, 23h de Manaus**; depois disso o formulário fecha sozinho.
- Banco: projeto "oculto" no Neon (us-east-1). É temporário: ao fim do evento, baixar a planilha em `/lista` e apagar o projeto.

Mais detalhes: `CONTEXT.md` (regras e decisões), `ARCHITECTURE.md` (mapa do código), `TODO.md`.
