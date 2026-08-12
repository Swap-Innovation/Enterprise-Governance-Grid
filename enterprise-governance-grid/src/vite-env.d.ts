/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_MODE?: 'live' | 'mock' | 'pages'
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
