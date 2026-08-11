import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_PAGES === 'true' ? '/Enterprise_governance_grid/' : '/',
  server: {
    proxy: {
      '/api/kg': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api/kg': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
})
