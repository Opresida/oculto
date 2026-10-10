# TODO

## Pendente

- [ ] Domínio próprio, se o cliente quiser; nesse caso, preencher `SITE_URL`.
- [ ] Depois do evento (a partir de 12/10): ver o painel em `/lista/painel`, baixar a planilha em `/lista` e apagar o projeto "oculto" no Neon (a cópia de segurança vai junto).

## Concluído

- [x] 2026-10-08 · Página do evento: abertura de 4 s, topo com os três artistas, contagem, fitas, line-up, formulário da lista VIP, chamada de ingressos, assinaturas.
- [x] 2026-10-08 · Lista VIP: gravação no banco, sem duplicar WhatsApp, fechamento automático no domingo às 23h.
- [x] 2026-10-08 · Portaria em `/lista`: senha, busca sem acento, retirar nome, planilha.
- [x] 2026-10-08 · Banco no Neon: projeto "oculto" (us-east-1, organização Mazari) criado; gravação testada de ponta a ponta com o build de produção e nome de teste apagado.
- [x] 2026-10-08 · Conferência no computador (1440 px) e no celular (390 px), build de produção e imagem de compartilhamento.
- [x] 2026-10-08 · No ar em https://oculto-omega.vercel.app, com `DATABASE_URL` e `LISTA_SENHA` configuradas; envio de teste gravou no Neon e foi apagado. Corrigido o 404 do primeiro deploy (`vercel.json`).
- [x] 2026-10-08 · Foto nova do Flakkë (loiro, jaqueta de couro) no topo, no line-up e na imagem de compartilhamento; trio reajustado para a jaqueta não cobrir o rosto do DJ Bertolossi.
- [x] 2026-10-08 · E-mail acrescentado à lista: formulário, validação, banco (coluna nova, criada sozinha), portaria e planilha.
- [x] 2026-10-09 · Presença na portaria: botão CONFIRMAR (e DESFAZER), filtro todos / faltam / presentes, régua de presentes, colunas novas na planilha e painel de comparecimento em `/lista/painel`. Banco: coluna `presente_em`, com cópia de segurança antes (branch `antes-presenca-2026-10-09` no Neon).
- [x] 2026-10-09 · Atração bônus (Diego Henrique) na seção do line-up, em bloco próprio, sem mexer no trio do topo.
- [x] 2026-10-09 · Lista Lucas (68 nomes, só nome) importada como exceção, com origem própria; portaria, planilha e painel mostram a origem.
