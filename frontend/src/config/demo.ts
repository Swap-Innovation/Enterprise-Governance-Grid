export const demoConfig = {
  kgApiBase: '/api/kg',
  mode: import.meta.env.VITE_DEMO_MODE,
  useStaticSnapshots: import.meta.env.VITE_DEMO_MODE === 'pages' || import.meta.env.VITE_DEMO_MODE === 'mock',
} as const
