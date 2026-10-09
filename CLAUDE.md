@AGENTS.md

# Como trabalhar neste projeto

Página do evento O.C.U.L.T.O (lista VIP + ingressos). Ler antes de mexer: `README.md`, `CONTEXT.md`,
`ARCHITECTURE.md`, `TODO.md`. Atualizar os quatro (e este) antes de encerrar a sessão.

## Convenções

- Código e comentários em português, como o resto do projeto.
- Todo dado do evento sai de `src/lib/evento.ts`. Não espalhar data, horário ou link pelos componentes.
- Marca: seguir `CONTEXT.md`. Nada de cor fora das fotos dos artistas; logo nunca alterada.
- Movimento novo: primeiro ver se a peça já existe em `src/motion/` ou no estúdio (`D:\dev\remotion-studio\src\motion`).
- Respeitar `prefers-reduced-motion` em toda animação nova.

## Verificações antes de entregar

```bash
pnpm typecheck && pnpm lint
pnpm build        # só com o servidor de desenvolvimento DESLIGADO (o build derruba o dev)
```

Conferir a página a 390 px e a 1440 px: sem rolagem lateral e sem conteúdo cortado na borda direita
(o `overflow-x: clip` esconde a rolagem, mas não conserta coluna larga demais).

## Cuidados

- Porta do projeto: 3300. O servidor de desenvolvimento pode ficar vivo depois de parado; conferir a porta.
- `.data/` (banco local) e `.conferencia/` (capturas) não vão para o repositório.
- Skills do Neon instaladas em `.claude/skills/` (`neon`, `neon-postgres`); a CLI é `npx neon@latest`.
- Segredos só na Vercel. Nunca escrever `DATABASE_URL` ou `LISTA_SENHA` em arquivo versionado, log ou resposta.
- Commit e push: só quando o Humberto pedir. Deploy é pela Vercel, a partir do repositório.
- Não mudar regra da lista nem texto comercial sem o Humberto confirmar.
