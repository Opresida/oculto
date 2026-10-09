'use client';

import { useEffect, useState } from 'react';
import { FECHA_LISTA } from '@/lib/evento';

// Contagem até o fechamento da lista (domingo, 23h de Manaus). Só começa a contar no navegador:
// o servidor não sabe que horas são para quem está olhando.

const dois = (n: number) => String(n).padStart(2, '0');

export function Contagem() {
  const [falta, setFalta] = useState<number | null>(null);

  useEffect(() => {
    const medir = () => setFalta(FECHA_LISTA.getTime() - Date.now());
    const primeiro = requestAnimationFrame(medir);
    const id = setInterval(medir, 1000);
    return () => {
      cancelAnimationFrame(primeiro);
      clearInterval(id);
    };
  }, []);

  if (falta !== null && falta <= 0) {
    return <p className="rotulo text-prata-clara">LISTA ENCERRADA · A FESTA É AGORA</p>;
  }

  const s = Math.max(0, Math.floor((falta ?? 0) / 1000));
  const partes = [
    { valor: Math.floor(s / 86400), nome: 'DIAS' },
    { valor: Math.floor((s % 86400) / 3600), nome: 'HORAS' },
    { valor: Math.floor((s % 3600) / 60), nome: 'MIN' },
    { valor: s % 60, nome: 'SEG' },
  ];
  return (
    <div>
      <p className="rotulo text-apoio">A LISTA FECHA EM</p>
      <div className="mt-2 flex gap-2 sm:gap-3" role="timer" aria-live="off">
        {partes.map((p) => (
          <div key={p.nome} className="min-w-[64px] border border-fumaca/70 bg-preto/60 px-2 py-2 text-center backdrop-blur sm:min-w-[78px] sm:px-3">
            <div className="titulo text-2xl tabular-nums text-luz sm:text-3xl">{falta === null ? '--' : dois(p.valor)}</div>
            <div className="rotulo mt-1 text-[0.5625rem] text-apoio">{p.nome}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
