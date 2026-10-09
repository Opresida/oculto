import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono, Unbounded } from 'next/font/google';
import { SITE_URL } from '@/lib/evento';
import './globals.css';

// Tipografia do brandbook (Archivo no texto, JetBrains Mono nos dados) + Unbounded, a fonte larga que o
// cliente escolheu para os títulos. A logo usa Big Shoulders Display, carregada em globals.css.
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'], weight: ['400', '600'] });
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], weight: ['400', '500'] });
const unbounded = Unbounded({ variable: '--font-unbounded', subsets: ['latin'], weight: ['900'] });

const TITULO = 'O.C.U.L.T.O · Lista VIP · 11.10 no Allnight';
const DESCRICAO = 'Domingo, 11.10, véspera de feriado, no Allnight. Coloque seu nome na lista VIP: entrada gratuita até as 23h.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRICAO,
  openGraph: { title: TITULO, description: DESCRICAO, url: '/', siteName: 'O.C.U.L.T.O', type: 'website', locale: 'pt_BR' },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRICAO },
};

export const viewport: Viewport = { themeColor: '#050505', colorScheme: 'dark' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${jetbrains.variable} ${unbounded.variable} antialiased`}>
      <head>
        <link rel="preload" href="/fonts/BigShouldersDisplay-900.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <div className="grao" aria-hidden />
      </body>
    </html>
  );
}
