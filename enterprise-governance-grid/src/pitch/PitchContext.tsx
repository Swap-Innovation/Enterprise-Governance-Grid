import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type ViewMode = 'pitch' | 'explore'

export type ContractPack = 'technical' | 'business' | 'semantics' | 'products'

export type DemoStep = {
  id: string
  title: string
  narration: string
  /** Demo app page segment under /demo/:id/ */
  route: 'marketplace' | 'contracts' | 'semantics' | 'studio' | 'governance' | 'guided'
  hash?: string
  graphNodeId?: string
  contractId?: string
  scope?: string
  pack?: ContractPack
  forceExplore?: boolean
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'marketplace',
    title: 'Marketplace · discover products',
    narration: 'Find Customer 360 and NATCO source products — each with owner, domain, and implements link.',
    route: 'marketplace',
  },
  {
    id: 'problem',
    title: 'The fracture',
    narration: 'NATCOs name Customer differently — Kunde, Kupac, Ügyfél, Klient — and catalogs diverge.',
    route: 'governance',
    hash: 'problem',
  },
  {
    id: 'idea',
    title: 'One meaning backbone',
    narration: 'Semantic Control Plane holds TM Forum SID meaning once; catalogs and products bind to it.',
    route: 'studio',
    hash: 'idea',
  },
  {
    id: 'architecture',
    title: 'How the grid works',
    narration: 'Mapping, federation, and the knowledge graph connect business, technical, and product assets.',
    route: 'studio',
    hash: 'architecture',
  },
  {
    id: 'contracts-global',
    title: 'Contracts · Global (TM Forum)',
    narration: 'Browse Global folder — Semantics (SID Customer), Technical hub, Business term, Data Product.',
    route: 'contracts',
    hash: 'contracts',
    scope: 'global',
    pack: 'semantics',
    contractId: 'ctr-sem-customer',
    graphNodeId: 'concept-customer',
  },
  {
    id: 'contracts-de',
    title: 'Contracts · Germany NATCO',
    narration: 'Open natco-de — local Semantics (Kunde), Business glossary, Technical CRM table, all aligned to Global.',
    route: 'contracts',
    hash: 'contracts',
    scope: 'natco-de',
    pack: 'semantics',
    contractId: 'ctr-sem-de-entity',
    graphNodeId: 'concept-de-entity',
  },
  {
    id: 'graph-align',
    title: 'Live KG · Global ↔ NATCO',
    narration: 'Traverse the knowledge graph — SID Customer federates every NATCO concept and CRM source.',
    route: 'semantics',
    hash: 'context-graph',
    graphNodeId: 'concept-customer',
    contractId: 'ctr-sem-customer',
  },
  {
    id: 'graph-de-source',
    title: 'Live KG · Germany source',
    narration: 'NATCO table represents local Kunde and global Customer — then feeds Customer 360.',
    route: 'semantics',
    hash: 'context-graph',
    graphNodeId: 'tbl-de-customer',
    contractId: 'ctr-tech-de-table',
    scope: 'natco-de',
    pack: 'technical',
  },
  {
    id: 'graph-product',
    title: 'Live KG · Data Product',
    narration: 'Customer 360 implements SID Customer and consumes all five NATCO sources.',
    route: 'semantics',
    hash: 'context-graph',
    graphNodeId: 'product-c360',
    contractId: 'ctr-prod-global-c360',
    scope: 'global',
    pack: 'products',
  },
  {
    id: 'outcomes',
    title: 'The ask',
    narration: 'Stand up Global + one NATCO end-to-end — then federate the rest.',
    route: 'governance',
    hash: 'outcomes',
  },
]

type PitchContextValue = {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
  demoActive: boolean
  demoStepIndex: number
  demoStep: DemoStep | null
  startDemo: () => void
  stopDemo: () => void
  nextDemo: () => void
  prevDemo: () => void
  goDemoStep: (index: number) => void
  graphNodeId: string | null
  setGraphNodeId: (id: string | null) => void
  contractId: string | null
  setContractId: (id: string | null) => void
  contractScope: string | null
  setContractScope: (scope: string | null) => void
  contractPack: ContractPack | null
  setContractPack: (pack: ContractPack | null) => void
}

const PitchContext = createContext<PitchContextValue | null>(null)

export function PitchProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('pitch')
  const [demoActive, setDemoActive] = useState(false)
  const [demoStepIndex, setDemoStepIndex] = useState(0)
  const [graphNodeId, setGraphNodeId] = useState<string | null>('tbl-c360')
  const [contractId, setContractId] = useState<string | null>(null)
  const [contractScope, setContractScope] = useState<string | null>('global')
  const [contractPack, setContractPack] = useState<ContractPack | null>('semantics')

  const applyStep = useCallback((step: DemoStep, index: number) => {
    setDemoStepIndex(index)
    if (step.forceExplore) setMode('explore')
    else setMode('pitch')
    if (step.graphNodeId) setGraphNodeId(step.graphNodeId)
    if (step.contractId) setContractId(step.contractId)
    if (step.scope) setContractScope(step.scope)
    if (step.pack) setContractPack(step.pack)
    if (step.hash) {
      requestAnimationFrame(() => {
        document.getElementById(step.hash!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  const startDemo = useCallback(() => {
    setDemoActive(true)
    applyStep(DEMO_STEPS[0], 0)
  }, [applyStep])

  const stopDemo = useCallback(() => {
    setDemoActive(false)
  }, [])

  const nextDemo = useCallback(() => {
    setDemoStepIndex((i) => {
      const next = Math.min(i + 1, DEMO_STEPS.length - 1)
      applyStep(DEMO_STEPS[next], next)
      if (next === DEMO_STEPS.length - 1) {
        /* keep active until user closes */
      }
      return next
    })
  }, [applyStep])

  const prevDemo = useCallback(() => {
    setDemoStepIndex((i) => {
      const prev = Math.max(i - 1, 0)
      applyStep(DEMO_STEPS[prev], prev)
      return prev
    })
  }, [applyStep])

  const goDemoStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, DEMO_STEPS.length - 1))
      applyStep(DEMO_STEPS[clamped], clamped)
      setDemoActive(true)
    },
    [applyStep],
  )

  const value = useMemo(
    () => ({
      mode,
      setMode,
      demoActive,
      demoStepIndex,
      demoStep: demoActive ? DEMO_STEPS[demoStepIndex] ?? null : null,
      startDemo,
      stopDemo,
      nextDemo,
      prevDemo,
      goDemoStep,
      graphNodeId,
      setGraphNodeId,
      contractId,
      setContractId,
      contractScope,
      setContractScope,
      contractPack,
      setContractPack,
    }),
    [
      mode,
      demoActive,
      demoStepIndex,
      startDemo,
      stopDemo,
      nextDemo,
      prevDemo,
      goDemoStep,
      graphNodeId,
      contractId,
      contractScope,
      contractPack,
    ],
  )

  return <PitchContext.Provider value={value}>{children}</PitchContext.Provider>
}

export function usePitchMode() {
  const ctx = useContext(PitchContext)
  if (!ctx) throw new Error('usePitchMode must be used within PitchProvider')
  return ctx
}
