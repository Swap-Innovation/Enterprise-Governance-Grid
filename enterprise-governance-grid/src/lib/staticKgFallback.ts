import graphData from '../data/customer-context-graph.json'
import type { KgEdge, KgNode, KgQueryGroup, KgQueryMeta, KgRunResult } from './kgTypes'

type StaticGraphNode = (typeof graphData.nodes)[number]
type StaticGraphEdge = (typeof graphData.edges)[number]

/** Mock catalog mirrors the live Q1–Q3 Semantics scenarios (no Neo4j). */
export const MOCK_KG_QUERIES: KgQueryMeta[] = [
  {
    id: 'mock-q1-global',
    code: 'Q1',
    title: 'Q1 · Global end-to-end (mock)',
    description: 'Full bundled Customer context graph across global + all NATCOs.',
    sourceFile: 'src/data/customer-context-graph.json',
    group: 'demo',
    resultHint: 'graph',
  },
  {
    id: 'mock-q2-natco',
    code: 'Q2',
    title: 'Q2 · NATCO end-to-end (mock)',
    description: 'Filter the bundled graph to global + one NATCO stack.',
    sourceFile: 'src/data/customer-context-graph.json',
    group: 'demo',
    resultHint: 'graph',
  },
  {
    id: 'mock-q3-product',
    code: 'Q3',
    title: 'Q3 · Data product lineage (mock)',
    description: 'Neighborhood around the Customer 360 product in the bundled graph.',
    sourceFile: 'src/data/customer-context-graph.json',
    group: 'demo',
    resultHint: 'graph',
  },
]

/** @deprecated use MOCK_KG_QUERIES[0] */
export const STATIC_KG_QUERY = MOCK_KG_QUERIES[0]

export const MOCK_KG_GROUPS: KgQueryGroup[] = [{ id: 'demo', label: 'Demo (mock)' }]

/** @deprecated use MOCK_KG_GROUPS */
export const STATIC_KG_GROUPS = MOCK_KG_GROUPS

function toKgNode(n: StaticGraphNode): KgNode {
  return {
    id: n.id,
    label: n.label,
    subtitle: n.subtitle ?? '',
    type: n.type,
    layer: n.layer,
    natco: n.natco ?? 'global',
    contract_ref: n.contract_ref ?? '',
    hub: Boolean((n as { hub?: boolean }).hub),
    position: n.position ?? { x: 0, y: 0 },
  }
}

function toKgEdge(e: StaticGraphEdge): KgEdge {
  return {
    id: e.id,
    from: e.from,
    to: e.to,
    predicate: e.predicate,
  }
}

function resolveProductHub(nodes: KgNode[], productId?: string): KgNode | null {
  if (!productId) return nodes.find((n) => n.type === 'product') ?? null
  const direct = nodes.find(
    (n) => n.type === 'product' && (n.id === productId || n.neo4jId === productId),
  )
  if (direct) return direct

  const key = productId.toLowerCase()
  // Marketplace ids (dp-customer-360, dp-customer-360-de, …) → bundled product-c360
  if (key.includes('customer') || key.includes('c360')) {
    return (
      nodes.find((n) => n.type === 'product' && (n.id.includes('c360') || /customer/i.test(n.label))) ??
      null
    )
  }
  return nodes.find((n) => n.type === 'product') ?? null
}

function filterStaticGraph(opts?: {
  mode?: 'overview' | 'natco' | 'product'
  natco?: string
  productId?: string
}): { nodes: KgNode[]; edges: KgEdge[] } {
  let nodes = graphData.nodes.map(toKgNode)
  const mode = opts?.mode ?? 'overview'
  const productId = opts?.productId
  const natco = opts?.natco

  if (mode === 'product') {
    const product = resolveProductHub(nodes, productId)
    if (product) {
      const keep = new Set<string>([product.id])
      let grew = true
      while (grew) {
        grew = false
        for (const e of graphData.edges) {
          if (keep.has(e.from) && !keep.has(e.to)) {
            keep.add(e.to)
            grew = true
          }
          if (keep.has(e.to) && !keep.has(e.from)) {
            keep.add(e.from)
            grew = true
          }
        }
      }
      nodes = nodes.filter((n) => keep.has(n.id))
    }
  } else if (mode === 'natco' && natco && natco !== 'global') {
    nodes = nodes.filter((n) => n.natco === 'global' || n.natco === natco)
  }

  const ids = new Set(nodes.map((n) => n.id))
  const edges = graphData.edges.map(toKgEdge).filter((e) => ids.has(e.from) && ids.has(e.to))
  return { nodes, edges }
}

function modeForQuery(code?: string): 'overview' | 'natco' | 'product' {
  const c = (code ?? 'Q1').toUpperCase()
  if (c === 'Q2') return 'natco'
  if (c === 'Q3') return 'product'
  return 'overview'
}

export function mockCypherStub(meta: KgQueryMeta): string {
  return [
    `// Mock mode — Neo4j / kg-api not connected`,
    `// Scenario ${meta.code}: ${meta.title.replace(/^[^·]+·\s*/, '')}`,
    `// Source: ${meta.sourceFile}`,
    `// Run locally with Docker Neo4j + npm run dev for live Cypher.`,
  ].join('\n')
}

/** Build a KgRunResult from the bundled customer-context-graph.json. */
export function buildStaticKgResult(opts?: {
  natco?: string
  productId?: string
  meta?: KgQueryMeta | null
}): KgRunResult {
  const meta = opts?.meta ?? MOCK_KG_QUERIES[0]
  const { nodes, edges } = filterStaticGraph({
    mode: modeForQuery(meta.code),
    natco: opts?.natco,
    productId: opts?.productId,
  })
  return {
    source: 'static',
    mode: 'graph',
    title: meta.title,
    description: meta.description,
    queryId: meta.id,
    code: meta.code,
    sourceFile: meta.sourceFile,
    group: meta.group,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    rowCount: nodes.length,
    nodes,
    edges,
    hasGraph: nodes.length > 0,
    hasTable: false,
    graphTables: {
      nodes: {
        columns: ['id', 'type', 'label', 'natco', 'layer'],
        rows: nodes.map((n) => ({
          id: n.id,
          type: n.type,
          label: n.label,
          natco: n.natco,
          layer: n.layer,
        })),
      },
      edges: {
        columns: ['id', 'from', 'to', 'predicate'],
        rows: edges.map((e) => ({
          id: e.id,
          from: e.from,
          to: e.to,
          predicate: e.predicate,
        })),
      },
    },
  }
}

export function staticKgCatalog(): { queries: KgQueryMeta[]; groups: KgQueryGroup[] } {
  return {
    queries: MOCK_KG_QUERIES,
    groups: MOCK_KG_GROUPS,
  }
}

/** True when the app should use bundled mock KG (GitHub Pages or explicit mock). */
export function isMockDemoMode(): boolean {
  const mode = import.meta.env.VITE_DEMO_MODE
  return mode === 'pages' || mode === 'mock'
}
