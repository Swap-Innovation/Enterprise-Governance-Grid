import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type ViewMode = 'pitch' | 'explore'

type PitchContextValue = {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
}

const PitchContext = createContext<PitchContextValue | null>(null)

export function PitchProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('pitch')
  const value = useMemo(() => ({ mode, setMode }), [mode])
  return <PitchContext.Provider value={value}>{children}</PitchContext.Provider>
}

export function usePitchMode() {
  const ctx = useContext(PitchContext)
  if (!ctx) throw new Error('usePitchMode must be used within PitchProvider')
  return ctx
}
