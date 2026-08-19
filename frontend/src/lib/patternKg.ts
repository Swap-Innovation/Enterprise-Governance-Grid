import graph from '../../../mock-data/projects/udp-pattern/derived/knowledge-graph.json'
import type { KgEdge, KgNode, KgQueryGroup, KgQueryMeta, KgRunResult } from './kgTypes'

type GraphNode = (typeof graph.nodes)[number]
type GraphEdge = (typeof graph.edges)[number]

function toKgNode(n: GraphNode): KgNode {
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

function toKgEdge(e: GraphEdge): KgEdge {
  return { id: e.id, from: e.from, to: e.to, predicate: e.predicate }
}

export const PATTERN_KG_QUERIES: KgQueryMeta[] = [
  {
    id: 'pattern-p1-global-e2e',
    code: 'P1',
    title: 'P1 · UCP global end-to-end · all marketplaces',
    description: 'ucp.shopping Product / Variant, Pattern Brand overlay, Merchant Center feed, Amazon / TikTok / Tmall federation',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
  {
    id: 'pattern-p2-marketplace-stack',
    code: 'P2',
    title: 'P2 · One marketplace stack ($marketplace)',
    description: 'Local listing identity + source table federated to ucp.shopping/Product or Variant',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
  {
    id: 'pattern-p3-product-lineage',
    code: 'P3',
    title: 'P3 · Data product lineage ($productId)',
    description: 'Marketplace product implements UCP concept and consumes channel tables',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
  {
    id: 'pattern-p4-listing-represents',
    code: 'P4',
    title: 'P4 · Technical listings represent UCP Product',
    description: 'Source tables and columns represent local IDs + ucp.shopping/Product and Variant',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
  {
    id: 'pattern-p5-brand-glossary',
    code: 'P5',
    title: 'P5 · Brand overlay mapsTo UCP Product',
    description: 'Glossary Brand maps to pattern-global/Brand, which mapsTo ucp.shopping/Product',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
  {
    id: 'pattern-p6-ossie-sdp-adp-cdp',
    code: 'P6',
    title: 'P6 · Ossie interchange · SDP → ADP → CDP',
    description: 'Apache Ossie ucp_shopping datasets: amazon_listing (SDP) feeds product (ADP); Google checkout CDP consumes Variant GID',
    sourceFile: 'mock-data/projects/udp-pattern/derived/knowledge-graph.json',
    group: 'pattern',
    resultHint: 'graph',
  },
]

export const PATTERN_KG_GROUPS: KgQueryGroup[] = [
  { id: 'pattern', label: 'UDP-Pattern · UCP + Ossie · P1–P6' },
]

function graphToResult(meta: KgQueryMeta, nodes: GraphNode[], edges: GraphEdge[]): KgRunResult {
  const kgNodes = nodes.map(toKgNode)
  const kgEdges = edges.map(toKgEdge)
  return {
    source: 'static',
    mode: 'graph',
    title: meta.title,
    description: meta.description,
    queryId: meta.id,
    code: meta.code,
    sourceFile: meta.sourceFile,
    group: meta.group,
    nodeCount: kgNodes.length,
    edgeCount: kgEdges.length,
    nodes: kgNodes,
    edges: kgEdges,
    hasGraph: kgNodes.length > 0,
    hasTable: false,
  }
}

function neighborhood(seedIds: string[]) {
  const keep = new Set(seedIds)
  let grew = true
  while (grew) {
    grew = false
    for (const e of graph.edges) {
      if (keep.has(e.from) || keep.has(e.to)) {
        if (!keep.has(e.from) || !keep.has(e.to)) {
          keep.add(e.from)
          keep.add(e.to)
          grew = true
        }
      }
    }
  }
  const nodes = graph.nodes.filter((n) => keep.has(n.id))
  const edges = graph.edges.filter((e) => keep.has(e.from) && keep.has(e.to))
  return { nodes, edges }
}

export function patternKgCatalog() {
  return { queries: PATTERN_KG_QUERIES, groups: PATTERN_KG_GROUPS }
}

export function mockPatternCypher(meta: KgQueryMeta): string {
  return [
    `// UDP-Pattern mock KG — canonical model is UCP shopping`,
    `// ${meta.code}: ${meta.title.replace(/^[^·]+·\s*/, '')}`,
    `// Spec: https://ucp.dev/2026-04-08/specification/reference/`,
    `// Google: https://developers.google.com/merchant/ucp/guides`,
    `// Brands: SPANX · Zyliss · Pura · NaturVet`,
    `// Marketplaces: Amazon · TikTok Shop · Tmall Global + Merchant Center`,
  ].join('\n')
}

export function buildPatternKgResult(opts?: {
  meta?: KgQueryMeta | null
  marketplace?: string
  productId?: string
}): KgRunResult {
  const meta = opts?.meta ?? PATTERN_KG_QUERIES[0]
  const code = meta.code.toUpperCase()
  const marketplace = opts?.marketplace || 'amazon'

  if (code === 'P2') {
    const { nodes, edges } = neighborhood([
      'ns-ucp',
      'ns-pattern',
      'concept-product',
      'concept-variant',
      'dp-brand-catalog-360',
      'tbl-product-360',
      `ns-${marketplace}`,
      `concept-${marketplace}-listing`,
      `tbl-${marketplace}-listing`,
      `col-${marketplace}-id`,
    ])
    return graphToResult(meta, nodes, edges)
  }

  if (code === 'P3') {
    const productId = opts?.productId || 'dp-brand-catalog-360'
    const seed: string[] =
      productId.includes('fulfillment')
        ? ['dp-fulfillment-ops', 'concept-fulfillment', 'tbl-product-360']
        : productId.includes('performance')
          ? ['dp-marketplace-performance', 'concept-order', 'ns-ucp']
          : productId.includes('advertising')
            ? ['dp-catalog-advertising', 'concept-product', 'dp-brand-catalog-360']
            : productId.includes('social')
              ? ['dp-social-commerce', 'ns-tiktok', 'concept-tiktok-listing', 'dp-brand-catalog-360']
              : productId.includes('intelligence')
                ? ['dp-pattern-intelligence', 'concept-merchant-profile', 'ns-ucp']
                : ['dp-brand-catalog-360', 'concept-product', 'concept-variant', 'tbl-product-360', 'col-product-gid']
    if (graph.nodes.some((n) => n.id === productId) && !seed.includes(productId)) seed.push(productId)
    const { nodes, edges } = neighborhood(seed)
    return graphToResult(meta, nodes, edges)
  }

  if (code === 'P4') {
    const { nodes, edges } = neighborhood([
      'tbl-product-360',
      'col-product-gid',
      'col-variant-gid',
      'tbl-amazon-listing',
      'tbl-tiktok-listing',
      'tbl-tmall-listing',
      'tbl-gmc-offer',
      'concept-product',
      'concept-variant',
    ])
    return graphToResult(meta, nodes, edges)
  }

  if (code === 'P5') {
    const { nodes, edges } = neighborhood(['gloss-brand', 'concept-brand', 'concept-product', 'ns-pattern', 'ns-ucp'])
    return graphToResult(meta, nodes, edges)
  }

  if (code === 'P6') {
    const { nodes, edges } = neighborhood([
      'ossie-pattern-ucp-shopping',
      'ds-product',
      'ds-amazon-listing',
      'dp-brand-catalog-360',
      'dp-cdp-google-checkout',
      'concept-product',
      'concept-checkout',
    ])
    return graphToResult(meta, nodes, edges)
  }

  return graphToResult(meta, graph.nodes, graph.edges)
}
