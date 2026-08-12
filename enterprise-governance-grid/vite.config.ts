import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isPages = process.env.GITHUB_PAGES === 'true'
/** live = Neo4j + kg-api; mock = local UI-only; pages = GitHub Pages static demo */
const demoMode = isPages ? 'pages' : (process.env.VITE_DEMO_MODE ?? 'live')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isPages ? '/Enterprise_governance_grid/' : '/',
  define: {
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify(demoMode),
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
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
