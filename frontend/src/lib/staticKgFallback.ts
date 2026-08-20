/**
 * UDP-DT static KG — reads from mock-data/projects/udp-dt/derived/knowledge-graph.json.
 * Falls back to per-scenario Neo4j snapshots when they exist (re-generate with
 * npm run kg:export-mock after connecting to live Neo4j).
 */
import derivedGraph from '../../../mock-data/projects/udp-dt/derived/knowledge-graph.json'
import snapshotIndex from '../../../mock-data/projects/udp-dt/kg-snapshots/index.json'
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

type GraphNode = (typeof derivedGraph.nodes)[number]
type GraphEdge = (typeof derivedGraph.edges)[number]

function toDtKgNode(n: GraphNode): KgNode {
  return {
    id: n.id,
    label: n.label,
    subtitle: n.subtitle,
    type: n.type,
    layer: n.layer,
    natco: n.natco,
    contract_ref: n.contract_ref,
    hub: 'hub' in n ? Boolean(n.hub) : false,
    position: n.position,
    neo4jId: n.id,
  }
}

function toDtKgEdge(e: GraphEdge): KgEdge {
  return { id: e.id, from: e.from, to: e.to, predicate: e.predicate }
}

const ALL_DT_NODES: KgNode[] = (derivedGraph.nodes as GraphNode[]).map(toDtKgNode)
const ALL_DT_EDGES: KgEdge[] = (derivedGraph.edges as GraphEdge[]).map(toDtKgEdge)

function filterByNatco(nodes: KgNode[], edges: KgEdge[], natco?: string) {
  if (!natco || natco === 'global') return { nodes, edges }
  const keep = new Set(nodes.filter((n) => !n.natco || n.natco === 'global' || n.natco === natco).map((n) => n.id))
  const filteredNodes = nodes.filter((n) => keep.has(n.id))
  const filteredEdges = edges.filter((e) => keep.has(e.from) && keep.has(e.to))
  return { nodes: filteredNodes, edges: filteredEdges }
}

function filterByProduct(nodes: KgNode[], edges: KgEdge[], productId?: string) {
  if (!productId) return { nodes, edges }
  const anchor = nodes.find(
    (n) => n.id === productId || n.id.includes(productId) || (n.contract_ref && n.contract_ref.includes(productId)),
  )
  if (!anchor) return { nodes, edges }
  // walk 2 hops from the product node
  const reachable = new Set<string>([anchor.id])
  for (let hop = 0; hop < 2; hop++) {
    for (const e of edges) {
      if (reachable.has(e.from)) reachable.add(e.to)
      if (reachable.has(e.to)) reachable.add(e.from)
    }
  }
  return {
    nodes: nodes.filter((n) => reachable.has(n.id)),
    edges: edges.filter((e) => reachable.has(e.from) && reachable.has(e.to)),
  }
}

// ── Snapshot support (Neo4j exports) ─────────────────────────────────────────

const SNAPSHOTS: Record<string, string> = { ...snapshotIndex.snapshots }

const snapshotModules = import.meta.glob('../../../mock-data/projects/udp-dt/kg-snapshots/*.json', {
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

const PRODUCT_FAMILIES = [
  'dp-customer-360',
  'dp-customer-interactions',
  'dp-product-orders',
  'dp-billing-accounts',
  'dp-service-subscriptions',
]

function resolveSnapshotKey(code: string, opts?: { natco?: string; productId?: string }): string {
  const c = code.toUpperCase()
  if (c === 'Q2') return `Q2__${opts?.natco || 'natco-de'}`
  if (c === 'Q3') {
    const productId = opts?.productId || 'dp-customer-360'
    if (SNAPSHOTS[`Q3__${productId}`]) return `Q3__${productId}`
    const family = PRODUCT_FAMILIES.find((id) => productId === id || productId.startsWith(`${id}-`))
    if (family && SNAPSHOTS[`Q3__${family}`]) return `Q3__${family}`
    return 'Q3'
  }
  return c
}

// ── Mock KG queries derived from the graph itself ──────────────────────────

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
    `// Mock mode — derived from mock-data/projects/udp-dt/derived/knowledge-graph.json`,
    `// Scenario ${meta.code}: ${meta.title.replace(/^[^·]+·\s*/, '')}`,
    `// Run locally with Docker Neo4j + npm run dev for live Cypher execution.`,
  ].join('\n')
}

/**
 * Build a KgRunResult for UDP-DT.
 * Priority: Neo4j snapshot (if present) → derived/knowledge-graph filtered by scenario.
 */
export function buildStaticKgResult(opts?: {
  natco?: string
  productId?: string
  meta?: KgQueryMeta | null
}): KgRunResult {
  const meta = opts?.meta ?? MOCK_KG_QUERIES[0]

  // Try Neo4j snapshot first
  if (meta) {
    const key = resolveSnapshotKey(meta.code, opts)
    const file = SNAPSHOTS[key] ?? SNAPSHOTS[meta.code.toUpperCase()]
    const snap = file ? loadSnapshot(file) : null
    if (snap) {
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
  }

  // Fall back to derived/knowledge-graph.json, filtered by scenario context
  const code = meta?.code?.toUpperCase() ?? ''
  let nodes = ALL_DT_NODES
  let edges = ALL_DT_EDGES

  if (code === 'Q2' || opts?.natco) {
    ;({ nodes, edges } = filterByNatco(nodes, edges, opts?.natco))
  } else if ((code === 'Q3' || code === 'Q6') && opts?.productId) {
    ;({ nodes, edges } = filterByProduct(nodes, edges, opts.productId))
  }

  return {
    source: 'static',
    mode: 'graph',
    title: meta?.title ?? 'UDP-DT Knowledge Graph',
    description: meta?.description ?? 'Compiled from mock-data/projects/udp-dt/derived/knowledge-graph.json',
    queryId: meta?.id,
    code: meta?.code,
    sourceFile: 'mock-data/projects/udp-dt/derived/knowledge-graph.json',
    group: meta?.group,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes,
    edges,
    hasGraph: nodes.length > 0,
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
