# Arquitetura · mapa do código

Next.js 16 (App Router, React 19), Tailwind 4, pnpm. Sem biblioteca de animação: o movimento é CSS e
as peças de motion trazidas do estúdio de vídeo.

## Pastas

```
src/
  app/
    layout.tsx            fontes, metadados, camada de grão
    globals.css           cores do brandbook, classes da marca (.titulo, .rotulo, .prata, .grao, .revela, .acende)
    page.tsx              a página: abertura → topo → fitas → line-up → lista → ingressos → rodapé
    opengraph-image.png   imagem que aparece ao compartilhar o link (1200×630)
    api/lista/route.ts    POST do formulário
    lista/                portaria: page.tsx (senha + lista), actions.ts (entrar, sair, tirar nome),
                          tabela.tsx (busca, filtro e CONFIRMAR / DESFAZER / TIRAR), csv/route.ts (planilha),
                          painel/page.tsx + painel/graficos.tsx (comparecimento em gráficos)
  components/
    abertura.tsx          tela de entrada de 4 s (uma vez por visita); avisa "oculto:aberto" ao sair
    logo-vivo.tsx         roda a peça de motion da logo e escala para a largura disponível
    trio.tsx              os três artistas, com profundidade (mouse no computador, rolagem no celular)
    contagem.tsx          contagem até o fechamento da lista
    fita.tsx              duas fitas corridas cruzadas
    form-lista.tsx        formulário, confirmação e estado de lista encerrada
    revela.tsx            entrada das seções ao chegar na tela
    rodape.tsx            Royals, Allnight, Lounge Sertanejo e a assinatura BrandSquad
  lib/
    evento.ts             TODOS os dados do evento: textos, prazo da lista, link de ingresso, artistas (ARTISTAS = o trio; BONUS = atração bônus)
    db.ts                 conexão: Neon em produção, PGlite no computador; cria a tabela sozinho
    lista.ts              limpar e validar nome/WhatsApp/e-mail; gravar, listar, confirmar presença, remover
    painel.ts             contas do comparecimento (funções puras): taxa, chegadas por meia hora, inscrições por dia, frases
    sessao.ts             sessão da portaria (cookie assinado com LISTA_SENHA, 12 h)
  motion/                 peças copiadas do estúdio Remotion (D:\dev\remotion-studio): funções puras do quadro
public/
  img/                    recortes dos artistas, logos e fundos, já em WebP
  fonts/                  Big Shoulders Display 900 (a fonte da logo)
```

## Banco

Projeto "oculto" no Neon (us-east-1), Postgres 18. Uma tabela, criada no primeiro uso (`src/lib/db.ts`):

```sql
oculto_lista_vip (id bigserial, nome text, whatsapp text unique [pode ser vazio], criado_em timestamptz, email text, presente_em timestamptz, origem text default 'site')
```

`presente_em` vazio = ainda não chegou; preenchido = a hora em que a portaria tocou em CONFIRMAR (tocar duas vezes mantém a primeira hora). Colunas novas entram por `alter table ... add column if not exists` em `db.ts`: quem já está na lista não é tocado.

`origem` diz de onde veio o nome: `site` (formulário) ou uma lista que entrou por fora, como exceção (`lista-lucas`). Só essas listas têm WhatsApp vazio; o formulário continua exigindo. Os nomes das origens ficam em `src/lib/origens.ts`, um arquivo sem banco, porque a tela da portaria roda no navegador e não pode importar `lista.ts` (que traz o banco junto).

O WhatsApp é único: a mesma pessoa enviando duas vezes não duplica, só recebe "você já está na lista".

## Proteções do formulário

- Prazo: depois de `FECHA_LISTA` a rota responde 410 e a página mostra a lista encerrada.
- Campo-isca invisível (`site`): robô preenche, recebe "ok" e nada é gravado.
- Aceite obrigatório do uso dos dados.
- Limite de 40 envios a cada 10 minutos por endereço (folgado, porque no 4G muita gente divide o mesmo).
- Em produção sem `DATABASE_URL`, a rota responde 503 com aviso, em vez de fingir que gravou.

## Variáveis de ambiente

`DATABASE_URL` (Neon), `LISTA_SENHA` (portaria, 6+ caracteres), `SITE_URL` (opcional).

## O que mudar e onde

- Texto, data, horário, link de ingresso, artistas: `src/lib/evento.ts`.
- Cores e classes da marca: `src/app/globals.css`.
- Duração da abertura: `DURACAO` em `src/components/abertura.tsx`.
