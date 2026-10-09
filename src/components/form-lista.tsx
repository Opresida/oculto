'use client';

import { useEffect, useState } from 'react';
import { EVENTO, FECHA_LISTA, INGRESSOS } from '@/lib/evento';

// Formulário da lista VIP: nome e WhatsApp. Depois do horário (domingo, 23h de Manaus) ele dá lugar
// ao aviso de lista encerrada; o servidor também recusa, então não adianta mexer no relógio do celular.

type Estado = { fase: 'livre' } | { fase: 'enviando' } | { fase: 'erro'; texto: string } | { fase: 'dentro'; nome: string; jaEstava: boolean };

/** (92) 99999-9999 enquanto digita */
function mascara(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const campo = 'w-full border border-fumaca bg-preto/70 px-4 py-4 text-lg text-luz outline-none transition-colors placeholder:text-fumaca focus:border-prata-clara';

export function FormLista() {
  const [estado, setEstado] = useState<Estado>({ fase: 'livre' });
  const [whatsapp, setWhatsapp] = useState('');
  const [aberta, setAberta] = useState(true);

  useEffect(() => {
    const medir = () => setAberta(Date.now() < FECHA_LISTA.getTime());
    const primeiro = requestAnimationFrame(medir);
    const id = setInterval(medir, 30000);
    return () => {
      cancelAnimationFrame(primeiro);
      clearInterval(id);
    };
  }, []);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setEstado({ fase: 'enviando' });
    try {
      const r = await fetch('/api/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: dados.get('nome'), whatsapp: dados.get('whatsapp'), aceite: dados.get('aceite') === 'on', site: dados.get('site') }),
      });
      const j = (await r.json()) as { ok: boolean; nome?: string; jaEstava?: boolean; erro?: string; encerrada?: boolean };
      if (j.encerrada) setAberta(false);
      if (j.ok && j.nome) setEstado({ fase: 'dentro', nome: j.nome, jaEstava: Boolean(j.jaEstava) });
      else setEstado({ fase: 'erro', texto: j.erro ?? 'Não deu certo. Tente de novo.' });
    } catch {
      setEstado({ fase: 'erro', texto: 'Sem conexão. Confira a internet e tente de novo.' });
    }
  }

  async function chamar() {
    const dados = { title: 'O.C.U.L.T.O · Lista VIP', text: `Domingo, ${EVENTO.data}, no ${EVENTO.local}. Coloca teu nome na lista: entrada gratuita até as ${EVENTO.limiteLista}.`, url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(dados);
      else {
        await navigator.clipboard.writeText(`${dados.text} ${dados.url}`);
        window.alert('Link copiado.');
      }
    } catch {
      /* a pessoa fechou a janela de compartilhar */
    }
  }

  if (estado.fase === 'dentro') {
    const primeiro = estado.nome.split(' ')[0];
    return (
      <div className="border border-prata-clara bg-preto/70 p-6 sm:p-8" role="status">
        <div className="pontos flex gap-2" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-3 w-3 bg-prata-clara" />)}
        </div>
        <p className="rotulo mt-6 text-apoio">{estado.jaEstava ? 'VOCÊ JÁ ESTAVA NA LISTA' : 'CONFIRMADO'}</p>
        <h3 className="titulo prata mt-2 text-4xl sm:text-5xl">{primeiro}, seu nome está na lista.</h3>
        <p className="mt-5 text-prata">
          Na portaria, diga <strong className="font-semibold text-luz">{estado.nome}</strong>. Entrada gratuita até as {EVENTO.limiteLista} de {EVENTO.dataExtenso}, no {EVENTO.local}.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={chamar} className="titulo cursor-pointer bg-prata-clara px-6 py-4 text-sm text-preto hover:bg-white">
            CHAMAR ALGUÉM
          </button>
          <a href={INGRESSOS} target="_blank" rel="noopener noreferrer" className="titulo border border-prata-clara px-6 py-4 text-center text-sm text-luz hover:bg-prata-clara hover:text-preto">
            GARANTIR INGRESSO ↗
          </a>
        </div>
      </div>
    );
  }

  if (!aberta) {
    return (
      <div className="border border-fumaca bg-preto/70 p-6 sm:p-8">
        <p className="rotulo text-apoio">LISTA ENCERRADA</p>
        <h3 className="titulo mt-2 text-3xl text-luz sm:text-4xl">A lista fechou às {EVENTO.limiteLista}.</h3>
        <p className="mt-4 text-prata">Ainda dá para entrar com ingresso.</p>
        <a href={INGRESSOS} target="_blank" rel="noopener noreferrer" className="titulo mt-6 inline-block bg-prata-clara px-6 py-4 text-sm text-preto hover:bg-white">
          COMPRAR INGRESSO ↗
        </a>
      </div>
    );
  }

  const enviando = estado.fase === 'enviando';
  return (
    <form onSubmit={enviar} className="flex flex-col gap-4 border border-fumaca bg-preto/70 p-5 backdrop-blur sm:p-8" noValidate={false}>
      <div>
        <label htmlFor="nome" className="rotulo text-prata">NOME COMPLETO</label>
        <input id="nome" name="nome" required minLength={5} maxLength={80} autoComplete="name" placeholder="Como está no documento" className={`${campo} mt-2`} />
      </div>
      <div>
        <label htmlFor="whatsapp" className="rotulo text-prata">WHATSAPP</label>
        <input id="whatsapp" name="whatsapp" required inputMode="tel" autoComplete="tel-national" placeholder="(92) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(mascara(e.target.value))} className={`${campo} mt-2`} />
      </div>
      {/* campo-isca: fora da tela e fora da ordem do teclado; só robô preenche */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="site">Site</label>
        <input id="site" name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-prata">
        <input type="checkbox" name="aceite" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#e4e4e1]" />
        <span>Concordo em usar meu nome e WhatsApp para a lista de entrada e os avisos desta festa.</span>
      </label>
      {estado.fase === 'erro' && <p className="border border-prata-clara px-4 py-3 text-sm text-luz" role="alert">{estado.texto}</p>}
      <button disabled={enviando} className="titulo mt-1 flex cursor-pointer items-center justify-center gap-3 bg-prata-clara px-6 py-5 text-base text-preto transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70">
        {enviando ? (
          <>
            <span className="pontos flex gap-1.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-2 w-2 bg-preto" />)}
            </span>
            ENVIANDO
          </>
        ) : (
          'ENTRAR NA LISTA'
        )}
      </button>
    </form>
  );
}
