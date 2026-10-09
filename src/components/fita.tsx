import { EVENTO } from '@/lib/evento';

// Fitas corridas, como nos vídeos: uma prata e uma preta, inclinadas, correndo em sentidos opostos.
const TEXTO = [EVENTO.nome, `${EVENTO.dia} ${EVENTO.data}`, EVENTO.vespera, EVENTO.local.toUpperCase(), 'LISTA VIP ATÉ AS 23H'];

function Trilho({ clara, aoContrario }: { clara: boolean; aoContrario?: boolean }) {
  // o texto vai duas vezes: quando a primeira metade sai, a segunda ocupa o lugar e o laço não aparece
  const metade = Array.from({ length: 4 }, () => TEXTO).flat();
  return (
    <div className={`overflow-hidden border-y-2 py-3 ${clara ? 'border-white/80 bg-prata-clara text-preto' : 'border-prata-clara bg-preto text-prata-clara'}`}>
      <div className={`fita-trilho ${aoContrario ? 'ao-contrario' : ''}`}>
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center" aria-hidden={copia === 1}>
            {metade.map((t, i) => (
              <span key={i} className="rotulo flex items-center whitespace-nowrap text-sm">
                <span className="px-5">{t}</span>
                <span className={`h-2 w-2 ${clara ? 'bg-preto' : 'bg-prata-clara'}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Fitas() {
  return (
    <div className="relative overflow-x-clip py-10" aria-label={TEXTO.join(' · ')}>
      <div className="-mx-8 -rotate-3"><Trilho clara /></div>
      <div className="-mx-8 -mt-5 rotate-2"><Trilho clara={false} aoContrario /></div>
    </div>
  );
}
