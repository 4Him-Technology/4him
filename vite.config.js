import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Em produção usamos caminhos relativos (funciona no subcaminho /Telemedicina do GitHub Pages).
  base: mode === 'production' ? './' : '/',
  logLevel: 'error', // Suppress warnings, only show errors
  build: {
    outDir: 'docs',      // GitHub Pages serve a pasta /docs
    emptyOutDir: true,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Alias "@" -> "src", declarado explicitamente.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
