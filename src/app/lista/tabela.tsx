'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Convidado } from '@/lib/lista';
import { removerDaLista } from './actions';

const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const mostrarFone = (d: string) => (d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`);
const hora = (iso: string) => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Manaus', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

/** Lista da portaria: busca enquanto digita (sem acento, por nome, telefone ou e-mail) e botão de atualizar. */
export function Tabela({ convidados }: { convidados: Convidado[] }) {
  const [busca, setBusca] = useState('');
  const router = useRouter();
  const filtrados = useMemo(() => {
    const b = semAcento(busca.trim());
    if (!b) return convidados;
    const digitos = b.replace(/\D/g, '');
    return convidados.filter((c) => semAcento(c.nome).includes(b) || (digitos.length >= 3 && c.whatsapp.includes(digitos)) || (b.length >= 3 && c.email.includes(b)));
  }, [busca, convidados]);

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-b border-grafite bg-preto/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar nome, telefone ou e-mail"
          aria-label="Buscar nome, telefone ou e-mail"
          autoFocus
          className="min-w-0 flex-1 border border-fumaca bg-grafite px-4 py-3 text-lg text-luz outline-none placeholder:text-fumaca focus:border-prata-clara"
        />
        <button type="button" onClick={() => router.refresh()} className="rotulo cursor-pointer border border-fumaca px-4 py-3.5 text-prata hover:border-prata-clara hover:text-luz">
          ATUALIZAR
        </button>
      </div>

      <p className="rotulo mt-4 text-fumaca">
        {busca ? `${filtrados.length} DE ${convidados.length}` : `${convidados.length} ${convidados.length === 1 ? 'NOME' : 'NOMES'} NA LISTA`}
      </p>

      <ul className="mt-3 divide-y divide-grafite border-y border-grafite">
        {filtrados.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-luz">{c.nome}</p>
              <p className="rotulo mt-1 text-fumaca">
                {mostrarFone(c.whatsapp)} · {hora(c.criadoEm)}
              </p>
              {c.email && <p className="mt-1 truncate text-sm text-apoio">{c.email}</p>}
            </div>
            <form
              action={removerDaLista}
              onSubmit={(e) => {
                if (!window.confirm(`Tirar ${c.nome} da lista?`)) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={c.id} />
              <button className="rotulo cursor-pointer border border-grafite px-3 py-2 text-fumaca hover:border-prata hover:text-luz" aria-label={`Tirar ${c.nome} da lista`}>
                TIRAR
              </button>
            </form>
          </li>
        ))}
        {filtrados.length === 0 && <li className="rotulo py-8 text-center text-fumaca">{convidados.length === 0 ? 'NINGUÉM NA LISTA AINDA.' : 'NENHUM NOME COM ESSA BUSCA.'}</li>}
      </ul>
    </>
  );
}
