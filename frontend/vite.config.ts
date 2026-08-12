import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const isPages = process.env.GITHUB_PAGES === 'true'
/** live = Neo4j + kg-api; mock = local UI-only; pages = GitHub Pages static demo */
const demoMode = isPages ? 'pages' : (process.env.VITE_DEMO_MODE ?? 'live')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isPages ? '/Enterprise_governance_grid/' : '/',
  resolve: {
    alias: {
      // Prefer importing via src/data/examples symlink; alias kept for @examples/*
      '@examples': path.resolve(repoRoot, 'contracts/examples/pitch'),
    },
  },
  define: {
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify(demoMode),
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    fs: {
      allow: [repoRoot],
    },
    proxy: {
      '/api/kg': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    proxy: {
      '/api/kg': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
})
