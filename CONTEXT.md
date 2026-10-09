# Contexto · regras e decisões

## O evento

- **O.C.U.L.T.O**, 4ª edição. Realização: Royals Entretenimento. Local: Allnight (Manaus). Apoio: Lounge Sertanejo.
- **Domingo, 11.10.2026**, véspera de feriado.
- Line-up: **Flakkë** (artista principal: sempre na frente, no centro e maior), **Jyou Guerra**, **DJ Bertolossi**.
- Ingressos: Shop Ingressos (endereço em `src/lib/evento.ts`).

## Decisões do Humberto (2026-10-08)

- A página existe para **capturar nomes para a lista VIP**; a venda de ingresso é a segunda chamada.
- Campos do formulário: **nome + WhatsApp + e-mail** (o e-mail foi pedido pelo Humberto na noite de 08/10, com o site já no ar). Nada além disso.
- Regra da lista: **entrada gratuita até as 23h** para quem está na lista.
- O formulário aceita nomes **até domingo, 23h** (horário de Manaus). Depois fecha sozinho.
- Front na Vercel, em **projeto novo**; banco **temporário** no Neon.
- Repositório: `github.com/Opresida/oculto`.
- Página interativa, com abertura de 4 segundos, fotos dos artistas com movimento, logos do evento e a logo da BrandSquad.

## Marca (brandbook O.C.U.L.T.O v1.0)

- Cores: Preto `#050505`, Grafite `#1C1C1D`, Fumaça `#4A4A49`, Prata `#B9B9B6`, Prata Clara `#E4E4E1`, Branco. Proporção 80/15/5.
- **Pessoa em cores, ambiente em cinza.** A única cor da página vem das fotos dos artistas.
- Logo em Big Shoulders Display 900: não se altera. Texto em Archivo, dados em JetBrains Mono.
- Títulos em **Unbounded 900** ("larga"): a fonte que o cliente escolheu na arte de contagem regressiva.
- Logos de parceiros em prata. Sem emoji, sem ponto de exclamação. Grão por cima de tudo.
- A logo da BrandSquad é a única com cor própria (o ponto laranja), e fica só na assinatura do rodapé.

## Cuidados

- Não inventar condição comercial nem regra de entrada: o texto diz só o que o Humberto confirmou.
- Os dados da lista são de pessoas reais (nome, telefone e e-mail): ficam atrás da senha da portaria, e o banco é apagado depois do evento.
- Segredos (`DATABASE_URL`, `LISTA_SENHA`) vivem só na Vercel. Nunca no repositório.
