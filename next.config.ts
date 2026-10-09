import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // PGlite (Postgres embutido, só no desenvolvimento) carrega WASM do disco: não pode ser empacotado.
  serverExternalPackages: ['@electric-sql/pglite'],
};

export default nextConfig;
