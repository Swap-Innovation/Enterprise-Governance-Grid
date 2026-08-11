import graphData from '../data/customer-context-graph.json'
import type { KgEdge, KgNode, KgQueryGroup, KgQueryMeta, KgRunResult } from './kgTypes'

type StaticGraphNode = (typeof graphData.nodes)[number]
type StaticGraphEdge = (typeof graphData.edges)[number]

export const STATIC_KG_QUERY: KgQueryMeta = {
  id: 'static-overview',
  code: 'Q1',
  title: 'Static · Customer context graph',
  description: 'Bundled demo graph used when Neo4j / kg-api is unavailable (e.g. GitHub Pages).',
  sourceFile: 'src/data/customer-context-graph.json',
  group: 'demo',
  resultHint: 'graph',
}

export const STATIC_KG_GROUPS: KgQueryGroup[] = [{ id: 'demo', label: 'Demo (static)' }]

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

function filterStaticGraph(opts?: {
  natco?: string
  productId?: string
}): { nodes: KgNode[]; edges: KgEdge[] } {
  let nodes = graphData.nodes.map(toKgNode)
  const productId = opts?.productId
  const natco = opts?.natco

  if (productId) {
    const product = nodes.find((n) => n.type === 'product' && (n.id === productId || n.id.includes(productId)))
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
  } else if (natco && natco !== 'global') {
    nodes = nodes.filter((n) => n.natco === 'global' || n.natco === natco)
  }

  const ids = new Set(nodes.map((n) => n.id))
  const edges = graphData.edges.map(toKgEdge).filter((e) => ids.has(e.from) && ids.has(e.to))
  return { nodes, edges }
}

/** Build a KgRunResult from the bundled customer-context-graph.json. */
export function buildStaticKgResult(opts?: {
  natco?: string
  productId?: string
  meta?: KgQueryMeta | null
}): KgRunResult {
  const { nodes, edges } = filterStaticGraph(opts)
  const meta = opts?.meta ?? STATIC_KG_QUERY
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
    queries: [STATIC_KG_QUERY],
    groups: STATIC_KG_GROUPS,
  }
}
