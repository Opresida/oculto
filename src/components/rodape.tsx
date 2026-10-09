import { EVENTO } from '@/lib/evento';

// Assinaturas do evento em prata (regra do brandbook para logos de parceiros) e a assinatura da BrandSquad.

const LOGOS = [
  { rotulo: 'REALIZAÇÃO', src: '/img/royals.webp', alt: 'Royals Entretenimento', w: 520, h: 176, classe: 'h-12 sm:h-14', filtro: 'grayscale(1) brightness(1.35)' },
  { rotulo: 'LOCAL', src: '/img/allnight.webp', alt: 'Allnight', w: 360, h: 317, classe: 'h-16 sm:h-20', filtro: 'grayscale(1) brightness(.95)' },
  { rotulo: 'APOIO', src: '/img/lounge-sertanejo.webp', alt: 'Lounge Sertanejo', w: 420, h: 236, classe: 'h-14 sm:h-16', filtro: 'grayscale(1) brightness(1.2) contrast(1.1)' },
];

/** A logo da BrandSquad como no site dela: caixa "bs" com a luz de status e o nome. */
function BrandSquad() {
  return (
    <span className="inline-flex items-center gap-2.5 text-prata-clara" aria-label="BrandSquad">
      <span className="relative grid h-8 w-8 shrink-0 place-items-center border-[3px] border-current text-[13px] font-extrabold leading-none tracking-tighter" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
        bs
        <span className="absolute -right-[6px] -top-[6px] h-2.5 w-2.5 rounded-full bg-[#FF6B1A]" />
      </span>
      <span className="text-lg font-semibold leading-none tracking-[-0.05em]">brandsquad</span>
    </span>
  );
}

export function Rodape() {
  return (
    <footer className="border-t border-grafite px-5 pb-10 pt-14 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8 sm:gap-x-20">
          {LOGOS.map((l) => (
            <div key={l.rotulo} className="flex flex-col items-center gap-3">
              <span className="rotulo text-apoio">{l.rotulo}</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- logo pequena, já em WebP */}
              <img src={l.src} alt={l.alt} width={l.w} height={l.h} loading="lazy" className={`${l.classe} w-auto`} style={{ filter: l.filtro }} />
            </div>
          ))}
        </div>

        <p className="rotulo max-w-xl text-center leading-relaxed text-fumaca">
          {EVENTO.nome} · {EVENTO.edicao} · {EVENTO.dia} {EVENTO.data} · {EVENTO.local.toUpperCase()}, {EVENTO.cidade.toUpperCase()}
          <br />
          Seu nome e WhatsApp são usados só para a lista de entrada e os avisos desta festa.
        </p>

        <a href="https://www.brandsquad.com.br" target="_blank" rel="noopener" className="flex flex-col items-center gap-3 opacity-80 transition-opacity hover:opacity-100">
          <span className="rotulo text-fumaca">DESENVOLVIDO POR</span>
          <BrandSquad />
        </a>
      </div>
    </footer>
  );
}
