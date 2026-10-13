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
| `/` | Página do evento. Desde 12/10/2026 (depois da festa): abertura de 4 s, artistas e o agradecimento a quem compareceu; sem formulário, contagem ou ingressos |
| `/lista` | Portaria: a lista de nomes, com busca, filtro por indicação e por situação, **confirmação de presença**, retirada de nome e planilha. Pede senha |
| `/lista/painel` | Comparecimento: inscritos × presentes, por indicação, chegadas por horário, inscrições por dia e leituras em frases; filtro `?origem=` vale para a página toda. Mesma senha |
| `/lista/csv` | Planilha da lista, com as colunas "Compareceu" e "Chegou em" (abre no Excel). Só com a portaria aberta |
| `POST /api/lista` | Recebia nome + WhatsApp + e-mail do formulário; com a lista encerrada responde 410 |

## Publicar (Vercel)

1. Importar este repositório na Vercel (projeto novo, configuração padrão de Next.js).
2. Em *Settings → Environment Variables*, criar:
   - `DATABASE_URL`: endereço de conexão do projeto "oculto" no Neon (painel do Neon → Connect, com *Connection pooling* ligado);
   - `LISTA_SENHA`: senha da portaria (6 caracteres ou mais);
   - `SITE_URL` (opcional): endereço final, se houver domínio próprio.
3. Publicar. A tabela `oculto_lista_vip` se cria sozinha no primeiro nome enviado.

Modelo das variáveis em `.env.example`.

## Estado

- No ar: https://oculto-omega.vercel.app (portaria em `/lista`). Cada push na `main` publica sozinho.
- A festa aconteceu em 11.10.2026. A lista fechou às 23h de Manaus e, em 12/10, a página trocou as inscrições pelo **agradecimento** (a versão com a lista aberta está no git até o commit `481e566`).
- Banco: projeto "oculto" no Neon (us-east-1). É temporário: ao fim do evento, baixar a planilha em `/lista` e apagar o projeto.

Mais detalhes: `CONTEXT.md` (regras e decisões), `ARCHITECTURE.md` (mapa do código), `TODO.md`.
