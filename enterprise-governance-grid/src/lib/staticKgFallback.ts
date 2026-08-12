import snapshotIndex from '../data/kg-snapshots/index.json'
import type { KgEdge, KgNode, KgQueryGroup, KgQueryMeta, KgRunResult } from './kgTypes'

type SnapshotFile = {
  meta: KgQueryMeta & { exportedAt?: string }
  source: 'static'
  mode: KgRunResult['mode']
  title?: string
  description?: string
  queryId?: string
  code?: string
  sourceFile?: string
  group?: string
  nodeCount: number
  edgeCount: number
  rowCount?: number
  nodes: KgNode[]
  edges: KgEdge[]
  hasGraph?: boolean
  hasTable?: boolean
  table?: KgRunResult['table']
  graphTables?: KgRunResult['graphTables']
  error?: string
}

const SNAPSHOTS: Record<string, string> = { ...snapshotIndex.snapshots }

const snapshotModules = import.meta.glob('../data/kg-snapshots/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, SnapshotFile | typeof snapshotIndex>

function loadSnapshot(file: string): SnapshotFile | null {
  const key = Object.keys(snapshotModules).find((k) => k.endsWith(`/kg-snapshots/${file}`))
  if (!key) return null
  const data = snapshotModules[key]
  if (!data || !('nodes' in data)) return null
  return data as SnapshotFile
}

export const MOCK_KG_QUERIES: KgQueryMeta[] = (snapshotIndex.queries ?? []).map((q) => ({
  id: q.id,
  code: q.code,
  title: q.title,
  description: q.description,
  sourceFile: q.sourceFile,
  group: q.group,
  resultHint: q.resultHint,
}))

export const MOCK_KG_GROUPS: KgQueryGroup[] = (snapshotIndex.groups ?? [
  { id: 'demo', label: 'Demo (mock)' },
  { id: 'country-stacks', label: 'Country stacks (mock)' },
]) as KgQueryGroup[]

/** @deprecated use MOCK_KG_QUERIES[0] */
export const STATIC_KG_QUERY = MOCK_KG_QUERIES[0]

/** @deprecated use MOCK_KG_GROUPS */
export const STATIC_KG_GROUPS = MOCK_KG_GROUPS

export function mockCypherStub(meta: KgQueryMeta): string {
  return [
    `// Mock mode — snapshot from live Neo4j catalog`,
    `// Scenario ${meta.code}: ${meta.title.replace(/^[^·]+·\s*/, '')}`,
    `// Source: ${meta.sourceFile}`,
    `// Run locally with Docker Neo4j + npm run dev for live Cypher.`,
  ].join('\n')
}

const PRODUCT_FAMILIES = [
  'dp-customer-360',
  'dp-customer-interactions',
  'dp-product-orders',
  'dp-billing-accounts',
  'dp-service-subscriptions',
]

function resolveSnapshotKey(code: string, opts?: { natco?: string; productId?: string }): string {
  const c = code.toUpperCase()
  if (c === 'Q2') {
    const natco = opts?.natco || 'natco-de'
    return `Q2__${natco}`
  }
  if (c === 'Q3') {
    const productId = opts?.productId || 'dp-customer-360'
    const exact = `Q3__${productId}`
    if (SNAPSHOTS[exact]) return exact
    const family = PRODUCT_FAMILIES.find((id) => productId === id || productId.startsWith(`${id}-`))
    if (family && SNAPSHOTS[`Q3__${family}`]) return `Q3__${family}`
    return 'Q3'
  }
  return c
}

/** Build a KgRunResult from exported Neo4j snapshots (all live scenarios). */
export function buildStaticKgResult(opts?: {
  natco?: string
  productId?: string
  meta?: KgQueryMeta | null
}): KgRunResult {
  const meta = opts?.meta ?? MOCK_KG_QUERIES[0]
  if (!meta) {
    return emptyResult()
  }
  const key = resolveSnapshotKey(meta.code, opts)
  const file = SNAPSHOTS[key] ?? SNAPSHOTS[meta.code.toUpperCase()]
  const snap = file ? loadSnapshot(file) : null
  if (!snap) {
    return {
      ...emptyResult(),
      title: meta.title,
      description: meta.description ?? 'Snapshot missing — re-run export-kg-snapshots.mjs',
      queryId: meta.id,
      code: meta.code,
      sourceFile: meta.sourceFile,
      group: meta.group,
      error: `Missing mock snapshot for ${key}`,
    }
  }

  return {
    source: 'static',
    mode: snap.mode ?? 'graph',
    title: snap.title ?? meta.title,
    description: snap.description ?? meta.description,
    queryId: meta.id,
    code: meta.code,
    sourceFile: meta.sourceFile,
    group: meta.group,
    nodeCount: snap.nodeCount,
    edgeCount: snap.edgeCount,
    rowCount: snap.rowCount,
    nodes: snap.nodes,
    edges: snap.edges,
    hasGraph: snap.hasGraph,
    hasTable: snap.hasTable,
    table: snap.table,
    graphTables: snap.graphTables,
  }
}

function emptyResult(): KgRunResult {
  return {
    source: 'static',
    mode: 'graph',
    nodeCount: 0,
    edgeCount: 0,
    nodes: [],
    edges: [],
    hasGraph: false,
    hasTable: false,
  }
}

export function staticKgCatalog(): { queries: KgQueryMeta[]; groups: KgQueryGroup[] } {
  return {
    queries: MOCK_KG_QUERIES,
    groups: MOCK_KG_GROUPS.length
      ? MOCK_KG_GROUPS
      : [
          { id: 'demo', label: 'Demo (mock)' },
          { id: 'country-stacks', label: 'Country stacks (mock)' },
        ],
  }
}

/** True when the app should use bundled mock KG (GitHub Pages or explicit mock). */
export function isMockDemoMode(): boolean {
  const mode = import.meta.env.VITE_DEMO_MODE
  return mode === 'pages' || mode === 'mock'
}
