import { neo4jToShowcaseId, showcaseContractRef } from './id-map.mjs'

const HIDDEN_LABELS_COMPACT = new Set(['MappingRecord', 'FederationEdge'])

const LABEL_LAYER = {
  Namespace: 'semantics',
  Concept: 'semantics',
  BusinessTerm: 'business',
  DataDomain: 'business',
  DataModel: 'business',
  DataEntity: 'business',
  DataAttribute: 'business',
  System: 'technical',
  Database: 'technical',
  Schema: 'technical',
  Table: 'technical',
  Column: 'technical',
  DataProduct: 'product',
  OutputPort: 'product',
  InputPort: 'product',
  DataContract: 'governance',
  ContractField: 'governance',
  MappingRecord: 'governance',
  FederationEdge: 'semantics',
  AssetTypeContract: 'governance',
  JsonSchema: 'governance',
  ContractAsset: 'governance',
  CrossPackRelation: 'governance',
  Acronym: 'business',
  KPI: 'business',
  DataConcept: 'business',
  TechnologyAsset: 'technical',
  DatabaseView: 'technical',
  ForeignKey: 'technical',
  FileStorage: 'technical',
  Directory: 'technical',
  File: 'technical',
  Field: 'technical',
  Pipeline: 'technical',
  Team: 'org',
  DataProductDomain: 'product',
  DataProductAccess: 'governance',
  GlossaryCategory: 'business',
  Measure: 'business',
  BusinessProcess: 'business',
  BusinessRule: 'business',
  Policy: 'governance',
  Issue: 'governance',
  Report: 'business',
  ReportAttribute: 'business',
  Dataset: 'technical',
  Topic: 'technical',
  ApiEndpoint: 'technical',
  StoredProcedure: 'technical',
  OntologyPackage: 'semantics',
  ValueSet: 'semantics',
  ConceptRelation: 'semantics',
  SemanticPolicy: 'governance',
}

const LABEL_TYPE = {
  Namespace: 'namespace',
  Concept: 'concept',
  BusinessTerm: 'glossary',
  DataEntity: 'entity',
  DataAttribute: 'attribute',
  Table: 'table',
  Column: 'column',
  System: 'system',
  Database: 'database',
  Schema: 'schema',
  DataProduct: 'product',
  OutputPort: 'port',
  InputPort: 'port',
  DataContract: 'contract',
  ContractField: 'field',
  DataDomain: 'domain',
  DataModel: 'model',
  MappingRecord: 'mapping',
  FederationEdge: 'federation',
  AssetTypeContract: 'contract',
  JsonSchema: 'contract',
  ContractAsset: 'contract',
  CrossPackRelation: 'mapping',
  Acronym: 'glossary',
  KPI: 'glossary',
  DataConcept: 'concept',
  TechnologyAsset: 'system',
  DatabaseView: 'table',
  ForeignKey: 'column',
  FileStorage: 'system',
  Directory: 'schema',
  File: 'table',
  Field: 'column',
  Pipeline: 'system',
  Team: 'system',
}

const LAYER_X = {
  semantics: 40,
  business: 280,
  technical: 520,
  product: 760,
  governance: 1000,
  org: 1000,
  consumption: 760,
  ai: 1000,
}

function primaryLabel(labels) {
  return labels.find((l) => LABEL_LAYER[l]) ?? labels[0] ?? 'Node'
}

function nodeKey(n) {
  const props = n.properties ?? {}
  return props.id ?? props.conceptId ?? `neo4j-${String(n.identity)}`
}

function mapId(rawId) {
  return neo4jToShowcaseId[rawId] ?? rawId
}

function isPath(v) {
  return v && typeof v === 'object' && Array.isArray(v.segments)
}

function isNode(v) {
  return v && typeof v === 'object' && Array.isArray(v.labels) && v.properties
}

function isRel(v) {
  return v && typeof v === 'object' && typeof v.type === 'string' && (v.start != null || v.startNodeElementId)
}

function plainProps(props) {
  const out = {}
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null) out[k] = null
    else if (typeof v === 'object' && typeof v.toNumber === 'function') out[k] = v.toNumber()
    else if (typeof v === 'object') out[k] = JSON.parse(JSON.stringify(v))
    else out[k] = v
  }
  return out
}

function addNode(value, nodes, elementIndex, opts) {
  if (!isNode(value)) return null
  const labels = value.labels ?? []
  if (opts.compact && labels.some((l) => HIDDEN_LABELS_COMPACT.has(l))) return null
  const rawId = nodeKey(value)
  const id = mapId(rawId)
  const label = primaryLabel(labels)
  const props = value.properties ?? {}
  const display =
    props.preferredLabel ?? props.displayName ?? props.name ?? props.conceptId ?? props.fullyQualifiedName ?? id
  const natcoGuess =
    props.natco ?? props.slug ?? (String(rawId).match(/natco-\w+/)?.[0] ?? 'global')
  nodes.set(id, {
    id,
    neo4jId: rawId,
    label: String(display),
    subtitle: props.fullyQualifiedName ?? props.uri ?? props.slug ?? props.kind ?? label,
    type: LABEL_TYPE[label] ?? label.toLowerCase(),
    layer: LABEL_LAYER[label] ?? 'technical',
    natco: natcoGuess,
    labels,
    properties: plainProps(props),
    contract_ref: showcaseContractRef[id] ?? '',
    hub: id === 'concept-customer' || id === 'product-c360' || id === 'tbl-c360',
  })
  if (value.elementId) elementIndex.set(value.elementId, id)
  if (value.identity != null) elementIndex.set(String(value.identity), id)
  return id
}

function addEdge(from, to, predicate, edges) {
  if (!from || !to || !predicate) return
  const eid = `${from}-${predicate}-${to}`
  edges.set(eid, { id: eid, from, to, predicate })
}

function resolveNodeRef(ref, elementIndex) {
  if (ref == null) return null
  if (isNode(ref)) return null
  return elementIndex.get(String(ref)) ?? null
}

function absorb(value, nodes, edges, elementIndex, opts, pendingRels) {
  if (value == null) return
  if (Array.isArray(value)) {
    for (const item of value) absorb(item, nodes, edges, elementIndex, opts, pendingRels)
    return
  }
  if (isPath(value)) {
    for (const seg of value.segments) {
      const from = addNode(seg.start, nodes, elementIndex, opts)
      const to = addNode(seg.end, nodes, elementIndex, opts)
      addEdge(from, to, seg.relationship?.type, edges)
    }
    return
  }
  if (isNode(value)) {
    addNode(value, nodes, elementIndex, opts)
    return
  }
  if (isRel(value)) {
    pendingRels.push(value)
  }
}

function layoutNodes(list) {
  const byLayer = new Map()
  for (const n of list) {
    const layer = n.layer ?? 'technical'
    if (!byLayer.has(layer)) byLayer.set(layer, [])
    byLayer.get(layer).push(n)
  }
  const out = []
  for (const [layer, group] of byLayer) {
    group.sort((a, b) => a.label.localeCompare(b.label))
    const x = LAYER_X[layer] ?? 520
    group.forEach((n, i) => {
      out.push({
        ...n,
        position: { x, y: 40 + i * 92 },
      })
    })
  }
  return out
}

function serializeCell(value) {
  if (value == null) return null
  if (isPath(value)) {
    const parts = []
    for (const seg of value.segments ?? []) {
      const a = seg.start?.properties
      const b = seg.end?.properties
      parts.push(
        a?.preferredLabel ?? a?.name ?? a?.id ?? '?',
        `-[:${seg.relationship?.type}]→`,
        b?.preferredLabel ?? b?.name ?? b?.id ?? '?',
      )
    }
    return parts.join(' ')
  }
  if (isNode(value)) {
    const props = value.properties ?? {}
    return props.preferredLabel ?? props.name ?? props.displayName ?? props.id ?? nodeKey(value)
  }
  if (isRel(value)) return value.type
  if (typeof value === 'object' && typeof value.toNumber === 'function') return value.toNumber()
  if (typeof value === 'boolean') return value
  if (typeof value === 'object') {
    try {
      return JSON.parse(JSON.stringify(value))
    } catch {
      return String(value)
    }
  }
  return value
}

/** Convert Neo4j query records into React Flow–ready nodes/edges. */
export function recordsToGraph(records, options = {}) {
  const opts = { compact: options.compact !== false }
  const nodes = new Map()
  const edges = new Map()
  const elementIndex = new Map()
  const pendingRels = []

  for (const record of records) {
    for (const key of record.keys) {
      absorb(record.get(key), nodes, edges, elementIndex, opts, pendingRels)
    }
  }

  for (const rel of pendingRels) {
    const from = resolveNodeRef(rel.startNodeElementId ?? rel.start, elementIndex)
    const to = resolveNodeRef(rel.endNodeElementId ?? rel.end, elementIndex)
    addEdge(from, to, rel.type, edges)
  }

  return {
    nodes: layoutNodes([...nodes.values()]),
    edges: [...edges.values()],
  }
}

/** Prefer scalar columns for Table view; skip raw path/node/rel keys. */
export function recordsToTable(records) {
  if (!records.length) return { columns: [], rows: [] }
  const allKeys = [...records[0].keys]
  const sample = records[0]
  const scalarKeys = allKeys.filter((key) => {
    const v = sample.get(key)
    if (v == null) return true
    if (isPath(v) || isNode(v) || isRel(v)) return false
    if (Array.isArray(v) && v.some((x) => isPath(x) || isNode(x) || isRel(x))) return false
    return true
  })
  const columns = scalarKeys.length ? scalarKeys : allKeys
  const rows = records.map((record) => {
    const row = {}
    for (const key of columns) row[key] = serializeCell(record.get(key))
    return row
  })
  return { columns, rows }
}

export function graphToTables(graph) {
  return {
    nodes: {
      columns: ['id', 'label', 'type', 'layer', 'natco', 'neo4jId'],
      rows: graph.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        layer: n.layer,
        natco: n.natco,
        neo4jId: n.neo4jId ?? n.id,
      })),
    },
    edges: {
      columns: ['from', 'predicate', 'to'],
      rows: graph.edges.map((e) => ({
        from: e.from,
        predicate: e.predicate,
        to: e.to,
      })),
    },
  }
}

export function resultHasGraph(records) {
  for (const record of records) {
    for (const key of record.keys) {
      const v = record.get(key)
      if (isPath(v) || isNode(v)) return true
      if (Array.isArray(v) && v.some((x) => isPath(x) || isNode(x))) return true
    }
  }
  return false
}
