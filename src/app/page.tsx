import { Abertura } from '@/components/abertura';
import { Contagem } from '@/components/contagem';
import { Fitas } from '@/components/fita';
import { FormLista } from '@/components/form-lista';
import { LogoVivo } from '@/components/logo-vivo';
import { Revela } from '@/components/revela';
import { Rodape } from '@/components/rodape';
import { Trio } from '@/components/trio';
import { ARTISTAS, EVENTO, INGRESSOS } from '@/lib/evento';

// Página do evento. Objetivo principal: nome na lista VIP. Objetivo secundário: venda de ingresso.
// Ordem: abertura (4 s) → topo com os artistas e a contagem → fitas → line-up → lista → ingressos → assinaturas.

const botaoCheio = 'titulo inline-flex items-center justify-center whitespace-nowrap bg-prata-clara px-6 py-5 text-sm text-preto transition-colors hover:bg-white';
const botaoFio = 'titulo inline-flex items-center justify-center whitespace-nowrap border border-prata-clara px-6 py-5 text-sm text-luz transition-colors hover:bg-prata-clara hover:text-preto';

export default function Pagina() {
  return (
    <>
      <Abertura />

      {/* ——— topo ——— */}
      <header className="relative isolate overflow-hidden">
        {/* ambiente em cinza: a pista do Allnight respirando, ondas finas e luz de cima */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="respira absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(/img/pista.webp)' }} />
          <div className="absolute inset-0" style={{ background: 'repeating-radial-gradient(circle at 70% 50%, transparent 0 40px, rgba(255,255,255,.045) 40px 42px)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.86) 0%, rgba(5,5,5,.35) 30%, rgba(5,5,5,.55) 70%, #050505 100%)' }} />
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-6 sm:px-10 sm:pt-8">
          <div className="text-3xl leading-none text-luz sm:text-4xl" style={{ fontFamily: 'var(--font-archivo), sans-serif', letterSpacing: '-0.01em' }}>
            <span className="font-semibold">11</span>
            <span className="text-prata">OUT</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo pequena, já em WebP */}
          <img src="/img/royals.webp" alt="Royals Entretenimento" width={520} height={176} className="h-10 w-auto sm:h-12" style={{ filter: 'grayscale(1) brightness(1.35)' }} />
          <div className="flex flex-col items-end gap-1">
            <span className="rotulo text-[0.5625rem] text-apoio">LOCAL</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- logo pequena, já em WebP */}
            <img src="/img/allnight.webp" alt="Allnight" width={360} height={317} className="h-10 w-auto sm:h-12" style={{ filter: 'grayscale(1) brightness(.95)' }} />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-6 pt-8 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-12 lg:pt-10">
          <div className="min-w-0">
            {/* a peça tem respiro dos lados; no computador puxa para alinhar com o texto */}
            <LogoVivo className="w-full max-w-[520px] lg:-ml-[9.5%]" />
            <p className="rotulo mt-6 text-prata">
              {EVENTO.edicao} · {EVENTO.dia} {EVENTO.data} · {EVENTO.vespera}
            </p>
            <h1 className="titulo prata mt-3 text-[clamp(3rem,13vw,6.5rem)]" style={{ filter: 'drop-shadow(0 8px 0 rgba(5,5,5,.85))' }}>
              Lista VIP
            </h1>
            <p className="mt-5 max-w-md text-lg text-prata-clara">
              Entrada gratuita até as {EVENTO.limiteLista} para quem está na lista. Coloque seu nome agora.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#lista" className={botaoCheio}>ENTRAR NA LISTA VIP</a>
              <a href={INGRESSOS} target="_blank" rel="noopener noreferrer" className={botaoFio}>COMPRAR INGRESSO ↗</a>
            </div>
            <div className="mt-9"><Contagem /></div>
          </div>
          <div className="min-w-0"><Trio /></div>
        </div>
      </header>

      <Fitas />

      <main>
        {/* ——— line-up ——— */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24" aria-labelledby="lineup">
          <Revela>
            <p className="rotulo text-apoio">01 · LINE-UP</p>
            <h2 id="lineup" className="titulo mt-3 text-4xl text-luz sm:text-6xl">Quem toca.</h2>
          </Revela>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {/* o artista principal vem primeiro no celular e fica no meio no computador */}
            {[ARTISTAS[1], ARTISTAS[0], ARTISTAS[2]].map((a, i) => (
              <Revela key={a.id} efeito="acende" className={`group relative overflow-hidden border border-grafite bg-grafite/40 ${a.id === 'flakke' ? 'sm:order-2' : i === 1 ? 'sm:order-1' : 'sm:order-3'}`}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,.2) 0%, transparent 72%)' }} aria-hidden />
                  {/* eslint-disable-next-line @next/next/no-img-element -- recorte com transparência, já em WebP */}
                  <img src={a.foto} alt={a.nome} width={a.largura} height={a.altura} loading="lazy" className="absolute left-1/2 w-auto max-w-none -translate-x-1/2 object-contain" style={{ height: `${96 * (a.zoomCartao ?? 1)}%`, bottom: `${-96 * ((a.zoomCartao ?? 1) - 1)}%` }} />
                  <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(180deg, transparent, #050505)' }} aria-hidden />
                </div>
                <div className="relative -mt-12 px-5 pb-6">
                  <p className="rotulo flex items-center gap-2 text-prata">
                    <span className="h-2 w-2 bg-prata-clara" aria-hidden />
                    {a.selo}
                  </p>
                  <h3 className="titulo mt-2 text-2xl text-luz lg:text-3xl">{a.nome}</h3>
                </div>
              </Revela>
            ))}
          </div>
        </section>

        {/* ——— lista VIP ——— */}
        <section id="lista" className="relative isolate scroll-mt-6 overflow-hidden border-y border-grafite" aria-labelledby="titulo-lista">
          <div className="absolute inset-0 -z-10" aria-hidden>
            <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(/img/neon.webp)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #050505 0%, rgba(5,5,5,.7) 50%, rgba(5,5,5,.88) 100%)' }} />
          </div>
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <Revela>
              <p className="rotulo text-apoio">02 · LISTA VIP</p>
              <h2 id="titulo-lista" className="titulo prata mt-3 text-4xl sm:text-6xl">Seu nome na lista.</h2>
              <ul className="mt-8 flex flex-col gap-5 text-lg text-prata-clara">
                {[
                  ['ENTRADA', `Gratuita até as ${EVENTO.limiteLista} para quem está na lista.`],
                  ['QUANDO', `${EVENTO.dataExtenso.charAt(0).toUpperCase() + EVENTO.dataExtenso.slice(1)}, véspera de feriado.`],
                  ['ONDE', `${EVENTO.local}, ${EVENTO.cidade}.`],
                  ['PRAZO', `A lista aceita nomes até domingo, ${EVENTO.limiteLista}.`],
                ].map(([rotulo, texto]) => (
                  <li key={rotulo} className="flex gap-4 border-t border-fumaca/60 pt-4">
                    <span className="rotulo w-20 shrink-0 pt-1.5 text-apoio">{rotulo}</span>
                    <span>{texto}</span>
                  </li>
                ))}
              </ul>
            </Revela>
            <Revela atraso={120}><FormLista /></Revela>
          </div>
        </section>

        {/* ——— ingressos ——— */}
        <section className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-10 sm:py-24" aria-labelledby="ingressos">
          <Revela>
            <p className="rotulo text-apoio">03 · INGRESSOS</p>
            <h2 id="ingressos" className="titulo mx-auto mt-3 max-w-3xl text-4xl text-luz sm:text-6xl">Vai chegar depois das 23h?</h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-prata">Garanta seu ingresso e entre a qualquer hora.</p>
            <a href={INGRESSOS} target="_blank" rel="noopener noreferrer" className={`${botaoCheio} mt-8`}>COMPRAR INGRESSO ↗</a>
            <p className="rotulo mt-5 text-fumaca">VENDA PELO SHOP INGRESSOS</p>
          </Revela>
        </section>
      </main>

      <Rodape />
    </>
  );
}
