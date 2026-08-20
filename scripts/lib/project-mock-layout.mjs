/**
 * mock-data/projects layout: shard authored catalogs, compile ContractBrowser + KG,
 * and report Ossie / link / graph coverage gaps.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const PROJECTS_ROOT = path.join(root, 'mock-data/projects')

/** Demo projects that must keep a `global` namespace (cannot delete it). */
export const PROTECTED_PROJECT_IDS = new Set(['udp-dt', 'udp-pattern'])

export function isProjectDeletable(projectId) {
  return !PROTECTED_PROJECT_IDS.has(projectId)
}

/**
 * Instance shards live under scopes/{scope}/{pack}/{Asset Type}/…
 * (mirrors contracts/{Pack}/{AssetType}/ type contracts).
 */
export const KIND_SHARD = {
  namespace: ['semantics', path.join('Namespace', 'contracts.json')],
  semantic_concept: ['semantics', path.join('Concept', 'contracts.json')],
  ossie_semantic_model: ['semantics', path.join('Ossie Semantic Model', 'contracts.json')],
  business_term: ['business-catalogue', path.join('Business Term', 'contracts.json')],
  data_domain: ['business-catalogue', path.join('Data Domain', 'contracts.json')],
  data_model: ['business-catalogue', path.join('Data Model', 'contracts.json')],
  data_entity: ['business-catalogue', path.join('Data Entity', 'contracts.json')],
  data_attribute: ['business-catalogue', path.join('Data Attribute', 'contracts.json')],
  data_concept: ['business-catalogue', path.join('Data Concept', 'contracts.json')],
  data_policy: ['business-catalogue', path.join('Policy', 'contracts.json')],
  system: ['technical-catalogue', path.join('System', 'contracts.json')],
  database: ['technical-catalogue', path.join('Database', 'contracts.json')],
  schema: ['technical-catalogue', path.join('Schema', 'contracts.json')],
  table: ['technical-catalogue', path.join('Table', 'contracts.json')],
  column: ['technical-catalogue', path.join('Column', 'contracts.json')],
  pipeline: ['technical-catalogue', path.join('Pipeline', 'contracts.json')],
  topic: ['technical-catalogue', path.join('Topic', 'contracts.json')],
  technical_asset: ['technical-catalogue', path.join('Technology Asset', 'contracts.json')],
  data_contract: ['data-products', path.join('Data Contract', 'contracts.json')],
  kpi: ['data-products', path.join('KPI', 'contracts.json')],
}

/** Legacy flat shard filenames (pre asset-folder layout) — migrated on normalize. */
const LEGACY_FLAT_SHARDS = {
  semantics: {
    'namespaces.json': path.join('Namespace', 'contracts.json'),
    'concepts.json': path.join('Concept', 'contracts.json'),
    'ossie-semantic-model.json': path.join('Ossie Semantic Model', 'contracts.json'),
  },
  'business-catalogue': {
    'domains.json': path.join('Data Domain', 'contracts.json'),
    'models.json': path.join('Data Model', 'contracts.json'),
    'entities.json': path.join('Data Entity', 'contracts.json'),
    'attributes.json': path.join('Data Attribute', 'contracts.json'),
    'concepts.json': path.join('Data Concept', 'contracts.json'),
    'terms.json': path.join('Business Term', 'contracts.json'),
    'policies.json': path.join('Policy', 'contracts.json'),
  },
  'technical-catalogue': {
    'systems.json': path.join('System', 'contracts.json'),
    'databases.json': path.join('Database', 'contracts.json'),
    'schemas.json': path.join('Schema', 'contracts.json'),
    'tables.json': path.join('Table', 'contracts.json'),
    'columns.json': path.join('Column', 'contracts.json'),
    'pipelines.json': path.join('Pipeline', 'contracts.json'),
    'topics.json': path.join('Topic', 'contracts.json'),
    'assets.json': path.join('Technology Asset', 'contracts.json'),
  },
  'data-products': {
    'sdp.json': path.join('Data Product', 'sdp.json'),
    'adp.json': path.join('Data Product', 'adp.json'),
    'cdp.json': path.join('Data Product', 'cdp.json'),
    'contracts.json': path.join('Data Contract', 'contracts.json'),
    'kpis.json': path.join('KPI', 'contracts.json'),
  },
}

const OSSIE_REL = `${path.sep}entity${path.sep}apache-ossie${path.sep}`

export function projectDir(projectId) {
  return path.join(PROJECTS_ROOT, projectId)
}

export function ossiePackagePath(projectId, scopeId = 'global') {
  return path.join(
    projectDir(projectId),
    'scopes',
    scopeId,
    'technical-catalogue',
    'entity',
    'apache-ossie',
    'semantic-model.json',
  )
}

function productFile(contract) {
  const cls = String(contract.product_class ?? '').toUpperCase()
  if (cls === 'SDP') return 'sdp.json'
  if (cls === 'ADP') return 'adp.json'
  if (cls === 'CDP') return 'cdp.json'
  return 'products.json'
}

function assetFolderForKind(kind, contract = {}) {
  if (kind === 'data_product') return 'Data Product'
  const spec = KIND_SHARD[kind]
  if (!spec) return 'unclassified'
  return path.dirname(spec[1])
}

/** Shared empty buckets kept by scaffold (not per-instance files). */
function isSharedBucketFile(file) {
  const base = path.basename(file)
  return (
    base === 'contracts.json' ||
    base === 'sdp.json' ||
    base === 'adp.json' ||
    base === 'cdp.json' ||
    base === 'kpis.json' ||
    base === 'products.json' ||
    base === 'knowledge-graph.json'
  )
}

/**
 * Instance path: scopes/{scope}/{pack}/{Asset Type}/{contract-id}.json
 * (id naming matches contract.id — e.g. domain-global-customer.json)
 */
export function shardRelPath(contract) {
  const scope = contract.natco || 'global'
  if (!contract?.id) {
    if (contract.kind === 'data_product') {
      return path.join('scopes', scope, 'data-products', 'Data Product', productFile(contract))
    }
    const spec = KIND_SHARD[contract.kind]
    if (!spec) return path.join('scopes', scope, 'unclassified', `${contract.kind}.json`)
    return path.join('scopes', scope, spec[0], spec[1])
  }
  if (contract.kind === 'data_product') {
    return path.join('scopes', scope, 'data-products', 'Data Product', `${contract.id}.json`)
  }
  const spec = KIND_SHARD[contract.kind]
  if (!spec) return path.join('scopes', scope, 'unclassified', `${contract.id}.json`)
  const folder = assetFolderForKind(contract.kind, contract)
  return path.join('scopes', scope, spec[0], folder, `${contract.id}.json`)
}

function findContractShardFile(projectId, contractId) {
  const scopesDir = path.join(projectDir(projectId), 'scopes')
  for (const file of walkFiles(scopesDir)) {
    if (!file.endsWith('.json') || isOssieFile(file)) continue
    if (path.basename(file) === 'knowledge-graph.json') continue
    try {
      const shard = readJson(file)
      if (shard?.contracts?.[contractId]) return file
    } catch {
      // skip unreadable
    }
  }
  return null
}

function packOfRel(rel) {
  if (rel.includes(`${path.sep}semantics${path.sep}`)) return 'semantics'
  if (rel.includes(`${path.sep}business-catalogue${path.sep}`)) return 'business'
  if (rel.includes(`${path.sep}technical-catalogue${path.sep}`)) return 'technical'
  if (rel.includes(`${path.sep}data-products${path.sep}`)) return 'products'
  return 'unclassified'
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, acc)
    else acc.push(full)
  }
  return acc
}

function isOssieFile(file) {
  return file.includes(OSSIE_REL)
}

export function clearCatalogShards(projectPath) {
  const scopesDir = path.join(projectPath, 'scopes')
  if (!fs.existsSync(scopesDir)) return
  for (const file of walkFiles(scopesDir)) {
    if (!file.endsWith('.json')) continue
    if (isOssieFile(file)) continue
    fs.unlinkSync(file)
  }
}

export function writeAuthoredProject(projectId, { meta, contracts, graph, preserveOssie = true }) {
  const dir = projectDir(projectId)
  fs.mkdirSync(dir, { recursive: true })
  if (preserveOssie) clearCatalogShards(dir)
  else fs.rmSync(path.join(dir, 'scopes'), { recursive: true, force: true })

  const buckets = new Map()
  for (const contract of Object.values(contracts)) {
    const rel = shardRelPath(contract)
    if (!buckets.has(rel)) buckets.set(rel, {})
    buckets.get(rel)[contract.id] = contract
  }

  for (const [rel, shardContracts] of buckets) {
    const kinds = [...new Set(Object.values(shardContracts).map((c) => c.kind))]
    writeJson(path.join(dir, rel), {
      pack: packOfRel(rel),
      kinds,
      scope: rel.split(path.sep)[1],
      contracts: shardContracts,
    })
  }

  if (graph) {
    writeJson(path.join(dir, 'scopes/global/semantics/knowledge-graph.json'), graph)
  }

  const natcos = meta?.natcos ?? [...new Set(Object.values(contracts).map((c) => c.natco || 'global'))]
  writeJson(path.join(dir, 'project.json'), {
    id: projectId,
    title: meta?.title ?? projectId,
    canonical: meta?.canonical ?? meta?.domain ?? null,
    scopes: natcos,
    ossie: {
      version: '0.2.0.dev0',
      spec: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md',
      path: 'scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    },
    derived: {
      catalog: 'derived/catalog.json',
      knowledge_graph: 'derived/knowledge-graph.json',
      coverage: 'derived/coverage.json',
    },
    catalog_meta: meta ?? {},
    source: meta?.source ?? null,
    generated_at: new Date().toISOString(),
  })
}

function loadOssie(projectId) {
  const file = ossiePackagePath(projectId)
  if (!fs.existsSync(file)) return null
  return readJson(file)
}

function ossieModels(pkg) {
  const models = pkg?.semantic_model
  return Array.isArray(models) ? models : models ? [models] : []
}

export function seedOssiePackage(projectId) {
  const dest = ossiePackagePath(projectId)
  if (fs.existsSync(dest)) return dest
  const srcName = projectId === 'udp-dt' ? 'udp-dt-customer-360.json' : 'udp-pattern-ucp-shopping.json'
  const src = path.join(root, 'contracts/examples/ossie', srcName)
  if (!fs.existsSync(src)) return null
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  const readme = path.join(path.dirname(dest), 'README.md')
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(
      readme,
      `# Apache Ossie entity package

JSON semantic_model for this project (\`0.2.0.dev0\`). Shown in Contracts as the Ossie Semantic Model; datasets feed the Semantics KG and Data Products (SDP / ADP / CDP).

Spec: https://github.com/apache/ossie/blob/main/core-spec/spec.md
`,
    )
  }
  return dest
}

export function compileProject(projectId) {
  const dir = projectDir(projectId)
  const scopesDir = path.join(dir, 'scopes')
  const contracts = {}
  const scopes = new Set()

  for (const file of walkFiles(scopesDir)) {
    if (!file.endsWith('.json')) continue
    if (isOssieFile(file)) continue
    const base = path.basename(file)
    if (base === 'knowledge-graph.json' || base === 'project.json') continue
    const shard = readJson(file)
    if (!shard?.contracts || typeof shard.contracts !== 'object') continue
    for (const [id, contract] of Object.entries(shard.contracts)) {
      contracts[id] = contract
      scopes.add(contract.natco || 'global')
    }
  }

  const graphFile = path.join(dir, 'scopes/global/semantics/knowledge-graph.json')
  const graph = fs.existsSync(graphFile)
    ? readJson(graphFile)
    : { meta: { title: projectId, natcos: [...scopes] }, nodes: [], edges: [] }

  const ossie = loadOssie(projectId)
  const ossieRel = path.relative(root, ossiePackagePath(projectId))
  for (const c of Object.values(contracts)) {
    if (c.kind !== 'ossie_semantic_model') continue
    c.package_file = ossieRel
    c.ossie_format = 'json'
  }

  const coverage = buildCoverage(projectId, contracts, graph, ossie, [...scopes])
  const projectMeta = fs.existsSync(path.join(dir, 'project.json')) ? readJson(path.join(dir, 'project.json')) : {}
  const catalog = {
    meta: {
      ...(projectMeta.catalog_meta ?? {}),
      title: projectMeta.title ?? `${projectId} contracts`,
      project: projectId,
      generated_at: new Date().toISOString(),
      natcos: (projectMeta.scopes ?? [...scopes]).filter(Boolean),
      source: `mock-data/projects/${projectId}/scopes`,
      ossie_package: ossie ? ossieRel : null,
      coverage: {
        gaps: coverage.summary.gaps,
        warnings: coverage.summary.warnings,
        path: `mock-data/projects/${projectId}/derived/coverage.json`,
        highlights: coverage.gaps.slice(0, 8).map((g) => ({ code: g.code, id: g.id, detail: g.detail })),
      },
    },
    contracts,
  }

  writeJson(path.join(dir, 'derived/catalog.json'), catalog)
  writeJson(path.join(dir, 'derived/knowledge-graph.json'), {
    ...graph,
    meta: {
      ...(graph.meta ?? {}),
      project: projectId,
      source: `mock-data/projects/${projectId}/scopes`,
      ossie_package: ossie ? ossieRel : null,
    },
  })
  writeJson(path.join(dir, 'derived/coverage.json'), coverage)

  return { catalog, graph, coverage, ossie }
}

function asList(value) {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string' && v)
  if (typeof value === 'string' && value) return [value]
  return []
}

function parseOssieExtension(model) {
  const ext = model?.custom_extensions?.find((e) => e.vendor_name === 'ENTERPRISE_GOVERNANCE_GRID')
  if (!ext?.data) return {}
  try {
    return typeof ext.data === 'string' ? JSON.parse(ext.data) : ext.data
  } catch {
    return {}
  }
}

export function buildCoverage(projectId, contracts, graph, ossie, scopes) {
  const gaps = []
  const list = Object.values(contracts)
  const byKind = (kind) => list.filter((c) => c.kind === kind)
  const nodes = graph?.nodes ?? []
  const edges = graph?.edges ?? []
  const nodeByContract = new Map()
  for (const n of nodes) {
    if (n.contract_ref) nodeByContract.set(n.contract_ref, n)
    if (n.id) nodeByContract.set(n.id, n)
  }

  const models = ossieModels(ossie)
  const datasets = models.flatMap((m) => m.datasets ?? [])
  const metrics = models.flatMap((m) => m.metrics ?? [])
  const relationships = models.flatMap((m) => m.relationships ?? [])
  const ext = models[0] ? parseOssieExtension(models[0]) : {}
  const sdp = new Set(ext.sdp ?? [])
  const adp = new Set(ext.adp ?? [])
  const cdp = new Set(ext.cdp ?? [])

  if (!ossie) {
    gaps.push({
      severity: 'error',
      code: 'OSSIE_PACKAGE_MISSING',
      id: projectId,
      detail: 'No Apache Ossie JSON at scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    })
  }

  for (const scope of scopes) {
    const inScope = list.filter((c) => (c.natco || 'global') === scope)
    if (!inScope.some((c) => c.kind === 'namespace' || c.kind === 'semantic_concept')) {
      gaps.push({
        severity: 'warning',
        code: 'SCOPE_WITHOUT_SEMANTICS',
        id: scope,
        detail: `${scope} has no namespace or concept contracts`,
      })
    }
  }

  for (const ns of byKind('namespace')) {
    if (!asList(ns.links?.concepts).length) {
      gaps.push({
        severity: 'warning',
        code: 'NAMESPACE_NO_CONCEPTS',
        id: ns.id,
        detail: `${ns.display_name ?? ns.id} has empty links.concepts`,
      })
    }
  }

  for (const c of byKind('semantic_concept')) {
    if (!asList(c.links?.namespace).length && !c.namespace) {
      gaps.push({
        severity: 'warning',
        code: 'CONCEPT_NO_NAMESPACE',
        id: c.id,
        detail: `${c.display_name ?? c.id} is missing links.namespace`,
      })
    }
  }

  for (const p of byKind('data_product')) {
    if (!p.product_class) {
      gaps.push({
        severity: 'warning',
        code: 'PRODUCT_NO_CLASS',
        id: p.id,
        detail: `${p.display_name ?? p.id} has no ProductClass (SDP|ADP|CDP)`,
      })
    }
    if (!p.ossie_dataset) {
      gaps.push({
        severity: 'info',
        code: 'PRODUCT_NO_OSSIE_DATASET',
        id: p.id,
        detail: `${p.display_name ?? p.id} is not bound to an Ossie dataset`,
      })
    }
  }

  const productDatasets = new Set(byKind('data_product').map((p) => p.ossie_dataset).filter(Boolean))
  const tableSources = new Set(
    byKind('table')
      .map((t) => t.ossie_dataset || t.source || t.qualified_name || t.name)
      .filter(Boolean),
  )

  for (const ds of datasets) {
    if (!ds.primary_key?.length) {
      gaps.push({
        severity: 'warning',
        code: 'OSSIE_DATASET_NO_PK',
        id: ds.name,
        detail: `Ossie dataset ${ds.name} has no primary_key`,
      })
    }
    if (!productDatasets.has(ds.name)) {
      gaps.push({
        severity: 'info',
        code: 'OSSIE_DATASET_NO_PRODUCT',
        id: ds.name,
        detail: `Ossie dataset ${ds.name} has no data_product.ossie_dataset binding`,
      })
    }
    const matchedTable = byKind('table').some(
      (t) => t.ossie_dataset === ds.name || t.source === ds.source || t.name === ds.name || t.display_name === ds.name,
    )
    if (!matchedTable && !tableSources.has(ds.source)) {
      gaps.push({
        severity: 'info',
        code: 'OSSIE_DATASET_NO_TABLE',
        id: ds.name,
        detail: `Ossie dataset ${ds.name} (${ds.source}) has no technical table contract`,
      })
    }
    for (const field of ds.fields ?? []) {
      if (!field.datatype) {
        gaps.push({
          severity: 'warning',
          code: 'OSSIE_FIELD_NO_DATATYPE',
          id: `${ds.name}.${field.name}`,
          detail: `Field ${ds.name}.${field.name} has no datatype`,
        })
      }
    }
  }

  for (const model of models) {
    if (!model.ai_context) {
      gaps.push({
        severity: 'info',
        code: 'OSSIE_NO_AI_CONTEXT',
        id: model.name,
        detail: `Ossie model ${model.name} has no ai_context`,
      })
    }
  }

  const skipKgKinds = new Set(['data_contract', 'column', 'schema', 'database', 'technical_asset', 'pipeline', 'topic'])
  for (const c of list) {
    if (skipKgKinds.has(c.kind)) continue
    if (!nodeByContract.has(c.id) && !nodeByContract.has(c.contract_id ?? '')) {
      gaps.push({
        severity: 'info',
        code: 'CONTRACT_NO_KG_NODE',
        id: c.id,
        detail: `${c.kind} ${c.display_name ?? c.id} is not on the Semantics graph`,
      })
    }
  }

  for (const n of nodes) {
    if (!n.contract_ref) {
      gaps.push({
        severity: 'info',
        code: 'KG_NODE_NO_CONTRACT',
        id: n.id,
        detail: `Graph node ${n.label ?? n.id} has no contract_ref`,
      })
    }
  }

  const edgeKeys = new Set(edges.map((e) => `${e.from}>${e.to}`))
  for (const rel of relationships) {
    const fromNode = nodes.find((n) => n.label === rel.from || n.id.includes(rel.from) || n.subtitle?.includes(rel.from))
    const toNode = nodes.find((n) => n.label === rel.to || n.id.includes(rel.to) || n.subtitle?.includes(rel.to))
    if (fromNode && toNode && !edgeKeys.has(`${fromNode.id}>${toNode.id}`) && !edgeKeys.has(`${toNode.id}>${fromNode.id}`)) {
      gaps.push({
        severity: 'info',
        code: 'OSSIE_REL_NO_KG_EDGE',
        id: rel.name,
        detail: `Ossie relationship ${rel.from} → ${rel.to} has no matching KG edge`,
      })
    }
  }

  const termNames = new Set(byKind('business_term').map((t) => (t.name ?? t.display_name ?? '').toLowerCase()))
  for (const metric of metrics) {
    const synonyms = metric.ai_context?.synonyms ?? []
    const hit = termNames.has(metric.name.toLowerCase()) || synonyms.some((s) => termNames.has(String(s).toLowerCase()))
    if (!hit) {
      gaps.push({
        severity: 'info',
        code: 'OSSIE_METRIC_NO_TERM',
        id: metric.name,
        detail: `Ossie metric ${metric.name} has no matching business term`,
      })
    }
  }

  if (projectId === 'udp-dt') {
    for (const scope of ['natco-hu', 'natco-pl']) {
      const dsName = scope === 'natco-hu' ? 'customers_hu' : 'customers_pl'
      if (!datasets.some((d) => d.name === dsName)) {
        gaps.push({
          severity: 'warning',
          code: 'SCOPE_WITHOUT_OSSIE_SDP',
          id: scope,
          detail: `${scope} has no Ossie SDP dataset (HU/PL CRM not in customer_360 package)`,
        })
      }
    }
  }

  const warnings = gaps.filter((g) => g.severity === 'warning' || g.severity === 'error').length
  return {
    project: projectId,
    generated_at: new Date().toISOString(),
    spec: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md',
    summary: {
      contracts: list.length,
      graph_nodes: nodes.length,
      graph_edges: edges.length,
      ossie_datasets: datasets.length,
      ossie_metrics: metrics.length,
      ossie_relationships: relationships.length,
      sdp: [...sdp],
      adp: [...adp],
      cdp: [...cdp],
      gaps: gaps.length,
      warnings,
    },
    gaps,
  }
}

export const LEGACY_SOURCES = {
  'udp-dt': {
    catalog: path.join(projectDir('udp-dt'), 'derived/catalog.json'),
    graph: path.join(projectDir('udp-dt'), 'derived/knowledge-graph.json'),
    fallbackCatalog: path.join(root, 'contracts/examples/pitch/customer-contracts.json'),
    fallbackGraph: path.join(root, 'contracts/examples/pitch/customer-context-graph.json'),
  },
  'udp-pattern': {
    catalog: path.join(projectDir('udp-pattern'), 'derived/catalog.json'),
    graph: path.join(projectDir('udp-pattern'), 'derived/knowledge-graph.json'),
    fallbackCatalog: path.join(root, 'contracts/examples/pitch/pattern-contracts.json'),
    fallbackGraph: path.join(root, 'contracts/examples/pitch/pattern-context-graph.json'),
  },
}

export function loadLegacyCatalog(projectId) {
  const src = LEGACY_SOURCES[projectId]
  const catalogFile = [src.catalog, src.fallbackCatalog, src.pitchCatalog].find((f) => f && fs.existsSync(f))
  const graphFile = [src.graph, src.fallbackGraph, src.pitchGraph].find((f) => f && fs.existsSync(f))
  if (!catalogFile) throw new Error(`No catalog found for ${projectId}`)
  return {
    catalog: readJson(catalogFile),
    graph: graphFile ? readJson(graphFile) : null,
    catalogFile,
    graphFile,
  }
}

export function mirrorCompiled(projectId, { catalog, graph }) {
  const copies = []
  if (projectId === 'udp-dt') {
    copies.push(
      [path.join(root, 'contracts/examples/pitch/customer-contracts.json'), catalog],
      [path.join(root, 'contracts/examples/pitch/customer-context-graph.json'), graph],
      [path.join(root, 'contracts/examples/pitch/tmforum.json'), readJson(path.join(projectDir('udp-dt'), 'tmforum.json'))],
      [path.join(root, 'contracts/examples/pitch/pitch-concepts.json'), readJson(path.join(projectDir('udp-dt'), 'pitch-concepts.json'))],
    )
  }
  if (projectId === 'udp-pattern') {
    copies.push(
      [path.join(root, 'contracts/examples/pitch/pattern-contracts.json'), catalog],
      [path.join(root, 'contracts/examples/pitch/pattern-context-graph.json'), graph],
    )
  }
  for (const [file, data] of copies) writeJson(file, data)
  const ossieSrc = ossiePackagePath(projectId)
  if (fs.existsSync(ossieSrc)) {
    const destName = projectId === 'udp-dt' ? 'udp-dt-customer-360.json' : 'udp-pattern-ucp-shopping.json'
    const dest = path.join(root, 'contracts/examples/ossie', destName)
    fs.copyFileSync(ossieSrc, dest)
    copies.push([dest, null])
  }
  return copies.map(([file]) => path.relative(root, file))
}

export function listProjectIds() {
  if (!fs.existsSync(PROJECTS_ROOT)) return []
  return fs
    .readdirSync(PROJECTS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => fs.existsSync(path.join(PROJECTS_ROOT, e.name, 'project.json')))
    .map((e) => e.name)
    .sort()
}

export function getProjectMeta(projectId) {
  const file = path.join(projectDir(projectId), 'project.json')
  if (!fs.existsSync(file)) return null
  return readJson(file)
}

export function readDerivedCatalog(projectId) {
  const file = path.join(projectDir(projectId), 'derived/catalog.json')
  return fs.existsSync(file) ? readJson(file) : null
}

export function readDerivedGraph(projectId) {
  const file = path.join(projectDir(projectId), 'derived/knowledge-graph.json')
  return fs.existsSync(file) ? readJson(file) : null
}

export function readDerivedCoverage(projectId) {
  const file = path.join(projectDir(projectId), 'derived/coverage.json')
  return fs.existsSync(file) ? readJson(file) : null
}

export function createProject(projectId, options = {}) {
  const id = String(projectId ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!id) {
    const err = new Error('Invalid project id')
    err.status = 400
    throw err
  }
  if (fs.existsSync(projectDir(id))) {
    const err = new Error(`Project already exists: ${id}`)
    err.status = 409
    throw err
  }

  const scopes = Array.isArray(options.scopes) && options.scopes.length ? options.scopes : ['global']
  const title = options.title ?? id
  const nsId = `ns-${id}-global`

  const contracts = {
    [nsId]: {
      id: nsId,
      contract_id: `ctr-inst-${nsId}`,
      type_contract_id: 'ctr-scp-type-namespace',
      kind: 'namespace',
      asset_type: 'Namespace',
      display_name: `${title} · global`,
      name: 'global',
      qualified_name: `${id}/global`,
      source_system: 'semantic_control_plane',
      natco: 'global',
      layer: 'registry',
      characteristics: {
        Prefix: `${id}/`,
        Status: 'draft',
        Description: `Root namespace for ${title}`,
      },
      links: { concepts: [] },
      metadata: { pack: 'semantic-control-plane', da: 'DA-04' },
    },
  }

  writeAuthoredProject(id, {
    meta: { title, natcos: scopes, domain: options.domain ?? id },
    contracts,
    graph: { meta: { title, natcos: scopes, project: id }, nodes: [], edges: [] },
    preserveOssie: false,
  })

  const projectFile = path.join(projectDir(id), 'project.json')
  const meta = readJson(projectFile)
  meta.ui = {
    code: options.code ?? id.toUpperCase(),
    name: options.name ?? title,
    workspace: options.workspace ?? title,
    tagline: options.tagline ?? '',
    description: options.description ?? '',
    footer: options.footer ?? `${title} · Enterprise Governance Grid`,
  }
  writeJson(projectFile, meta)

  const compiled = compileProject(id)
  mirrorCompiled(id, compiled)
  return { meta: readJson(projectFile), ...compiled }
}

export function upsertContract(projectId, contract) {
  if (!getProjectMeta(projectId)) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  if (!contract?.id) {
    const err = new Error('contract.id required')
    err.status = 400
    throw err
  }
  const natco = contract.natco || 'global'
  // Ensure the target asset folder / shard exists before writing.
  ensureScopeScaffold(projectId, natco)
  const existingFile = findContractShardFile(projectId, contract.id)
  const rel = shardRelPath({ ...contract, natco })
  const file = existingFile ?? path.join(projectDir(projectId), rel)
  const shard = fs.existsSync(file)
    ? readJson(file)
    : {
        pack: packOfRel(rel),
        kinds: [contract.kind],
        scope: natco,
        contracts: {},
      }
  if (!Array.isArray(shard.kinds)) shard.kinds = []
  if (!shard.kinds.includes(contract.kind)) shard.kinds.push(contract.kind)
  if (!shard.contracts) shard.contracts = {}
  shard.scope = natco
  shard.pack = packOfRel(path.relative(projectDir(projectId), file))

  const characteristics =
    contract.characteristics && typeof contract.characteristics === 'object'
      ? { ...contract.characteristics }
      : {}
  if (contract.display_name) {
    characteristics.PreferredLabel = contract.display_name
    if ('DisplayName' in characteristics || contract.kind === 'namespace') {
      characteristics.DisplayName = contract.display_name
    }
  }
  if (contract.name && contract.kind === 'namespace') {
    characteristics.Slug = contract.name
  }
  const metadata =
    contract.metadata && typeof contract.metadata === 'object' ? { ...contract.metadata } : {}
  metadata.file = metadata.file ?? `${contract.id}.json`
  metadata.updated_via = metadata.updated_via ?? 'contracts-api'
  metadata.updated_at = new Date().toISOString()

  const saved = {
    ...contract,
    natco,
    characteristics,
    metadata,
  }
  shard.contracts[contract.id] = saved
  writeJson(file, shard)
  const compiled = compileProject(projectId)
  mirrorCompiled(projectId, compiled)
  return {
    ...compiled,
    contract: saved,
    path: path.relative(root, file),
  }
}

const ASSET_KIND_DEFS = {
  namespace: {
    asset_type: 'Namespace',
    type_contract_id: 'ctr-scp-type-namespace',
    source_system: 'semantic_control_plane',
    layer: 'registry',
    idPrefix: 'ns',
  },
  semantic_concept: {
    asset_type: 'Concept',
    type_contract_id: 'ctr-scp-type-concept',
    source_system: 'semantic_control_plane',
    layer: 'registry',
    idPrefix: 'concept',
  },
  ossie_semantic_model: {
    asset_type: 'Ossie Semantic Model',
    type_contract_id: 'ctr-scp-type-ossie-model',
    source_system: 'semantic_control_plane',
    layer: 'interchange',
    idPrefix: 'ossie',
  },
  business_term: {
    asset_type: 'Business Term',
    type_contract_id: 'ctr-biz-type-business-term',
    source_system: 'collibra',
    layer: 'glossary',
    idPrefix: 'term',
  },
  data_domain: {
    asset_type: 'Data Domain',
    type_contract_id: 'ctr-biz-type-data-domain',
    source_system: 'collibra',
    layer: 'semantic',
    idPrefix: 'domain',
  },
  data_model: {
    asset_type: 'Data Model',
    type_contract_id: 'ctr-biz-type-data-model',
    source_system: 'collibra',
    layer: 'semantic',
    idPrefix: 'model',
  },
  data_entity: {
    asset_type: 'Data Entity',
    type_contract_id: 'ctr-biz-type-data-entity',
    source_system: 'collibra',
    layer: 'semantic',
    idPrefix: 'entity',
  },
  data_attribute: {
    asset_type: 'Data Attribute',
    type_contract_id: 'ctr-biz-type-data-attribute',
    source_system: 'collibra',
    layer: 'semantic',
    idPrefix: 'attr',
  },
  data_concept: {
    asset_type: 'Data Concept',
    type_contract_id: 'ctr-biz-type-data-concept',
    source_system: 'collibra',
    layer: 'semantic',
    idPrefix: 'biz-concept',
  },
  data_policy: {
    asset_type: 'Policy',
    type_contract_id: 'ctr-biz-type-policy',
    source_system: 'collibra',
    layer: 'governance',
    idPrefix: 'policy',
  },
  system: {
    asset_type: 'System',
    type_contract_id: 'ctr-tech-type-system',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'sys',
  },
  database: {
    asset_type: 'Database',
    type_contract_id: 'ctr-tech-type-database',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'db',
  },
  schema: {
    asset_type: 'Schema',
    type_contract_id: 'ctr-tech-type-schema',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'schema',
  },
  table: {
    asset_type: 'Table',
    type_contract_id: 'ctr-tech-type-table',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'table',
  },
  column: {
    asset_type: 'Column',
    type_contract_id: 'ctr-tech-type-column',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'col',
  },
  pipeline: {
    asset_type: 'Pipeline',
    type_contract_id: 'ctr-tech-type-pipeline',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'pipe',
  },
  topic: {
    asset_type: 'Topic',
    type_contract_id: 'ctr-tech-type-topic',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'topic',
  },
  technical_asset: {
    asset_type: 'Technology Asset',
    type_contract_id: 'ctr-tech-type-technology-asset',
    source_system: 'collibra',
    layer: 'physical',
    idPrefix: 'tech',
  },
  data_product: {
    asset_type: 'Data Product',
    type_contract_id: 'ctr-dp-type-data-product',
    source_system: 'entropy',
    layer: 'product',
    idPrefix: 'dp',
  },
  data_contract: {
    asset_type: 'Data Contract',
    type_contract_id: 'ctr-dp-type-data-contract',
    source_system: 'entropy',
    layer: 'product',
    idPrefix: 'dc',
  },
  kpi: {
    asset_type: 'KPI',
    type_contract_id: 'ctr-biz-type-kpi',
    source_system: 'collibra',
    layer: 'metrics',
    idPrefix: 'kpi',
  },
}

function uniqueContractId(projectId, baseId) {
  const catalog = readDerivedCatalog(projectId)
  if (!catalog?.contracts?.[baseId]) return baseId
  let i = 2
  while (catalog.contracts[`${baseId}-${i}`]) i += 1
  return `${baseId}-${i}`
}

function buildAssetContract(projectId, scopeId, kind, options = {}) {
  const def = ASSET_KIND_DEFS[kind]
  if (!def) {
    const err = new Error(`Unsupported asset kind: ${kind}`)
    err.status = 400
    throw err
  }
  const label = String(options.displayName ?? options.name ?? def.asset_type).trim() || def.asset_type
  const slug = sanitizeScopeId(options.name ?? label) || def.idPrefix
  const productClass = options.product_class
    ? String(options.product_class).toUpperCase()
    : kind === 'data_product'
      ? 'SDP'
      : undefined
  // Stable id / filename stem: {prefix}-{scope}-{slug} (e.g. domain-global-customer)
  const baseId =
    kind === 'data_product' && productClass
      ? `${def.idPrefix}-${productClass.toLowerCase()}-${scopeId}-${slug}`
      : kind === 'namespace'
        ? `ns-${slug === scopeId ? scopeId : `${scopeId}-${slug}`}`
        : `${def.idPrefix}-${scopeId}-${slug}`
  const id = uniqueContractId(projectId, baseId)
  const contract = {
    id,
    contract_id: `ctr-inst-${id}`,
    type_contract_id: def.type_contract_id,
    kind,
    asset_type: def.asset_type,
    display_name: label,
    name: slug,
    qualified_name: `${scopeId}/${slug}`,
    source_system: def.source_system,
    natco: scopeId,
    layer: def.layer,
    status: 'draft',
    characteristics: {
      Description: options.description ?? `${def.asset_type} in namespace ${scopeId}`,
      Status: 'Draft',
      PreferredLabel: label,
    },
    links: {},
    metadata: {
      pack: KIND_SHARD[kind]?.[0] ?? (kind === 'data_product' ? 'data-products' : 'unclassified'),
      project: projectId,
      created_via: 'contracts-ui',
      file: `${id}.json`,
    },
  }
  if (kind === 'semantic_concept') {
    contract.links = { namespace: [`ns-${scopeId}`] }
    contract.characteristics.ConceptId = slug
    contract.characteristics.Uri = `https://semantics.example/ns/${scopeId}/${slug}`
    contract.characteristics.ConceptKind = 'entity'
  }
  if (kind === 'ossie_semantic_model') {
    contract.ossie_version = '0.2.0.dev0'
    contract.spec_url = 'https://github.com/apache/ossie/blob/main/core-spec/spec.md'
    contract.package_file = path.relative(root, ossiePackagePath(projectId, scopeId))
    ensureOssiePackageScaffold(projectId, scopeId)
  }
  if (kind === 'namespace') {
    contract.characteristics = {
      Slug: slug,
      DisplayName: label,
      Description: options.description ?? `Namespace contract in ${projectId}/${scopeId}`,
      NamespaceKind: scopeId === 'global' ? 'global' : 'scope',
      UriBase: `https://semantics.example/ns/${slug}/`,
      Status: 'active',
    }
    contract.links = { concepts: [] }
  }
  if (productClass) {
    contract.product_class = productClass
    contract.characteristics.ProductClass = productClass
  }
  return contract
}

/**
 * Create a typed asset contract under scopes/{scope}/{pack}/{AssetType}/…
 * Does not invent demo payload — only a well-formed draft shell.
 */
export function createAssetContract(projectId, options = {}) {
  const meta = getProjectMeta(projectId)
  if (!meta) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  const kind = String(options.kind ?? '').trim()
  if (!kind || !ASSET_KIND_DEFS[kind]) {
    const err = new Error(`Unsupported or missing kind: ${kind || '(empty)'}`)
    err.status = 400
    throw err
  }
  const scopeId = sanitizeScopeId(options.scope ?? options.natco ?? 'global')
  if (!scopeId) {
    const err = new Error('Invalid scope')
    err.status = 400
    throw err
  }
  if (kind === 'namespace' && scopeId === 'global' && !options.name && !options.displayName) {
    const err = new Error('Use + Namespace to create a new scope namespace')
    err.status = 400
    throw err
  }
  ensureScopeScaffold(projectId, scopeId)
  const contract = buildAssetContract(projectId, scopeId, kind, options)
  const compiled = upsertContract(projectId, contract)
  return { contract, ...compiled }
}

const STANDARD_SCOPE_PACKS = ['semantics', 'data-products', 'business-catalogue', 'technical-catalogue']

/** Standard asset folders + shard files under each pack — created empty for every namespace. */
const SCOPE_PACK_SHARDS = {
  semantics: [
    { file: path.join('Namespace', 'contracts.json'), kinds: ['namespace'] },
    { file: path.join('Concept', 'contracts.json'), kinds: ['semantic_concept'] },
    { file: path.join('Ossie Semantic Model', 'contracts.json'), kinds: ['ossie_semantic_model'] },
  ],
  'business-catalogue': [
    { file: path.join('Data Domain', 'contracts.json'), kinds: ['data_domain'] },
    { file: path.join('Data Model', 'contracts.json'), kinds: ['data_model'] },
    { file: path.join('Data Entity', 'contracts.json'), kinds: ['data_entity'] },
    { file: path.join('Data Attribute', 'contracts.json'), kinds: ['data_attribute'] },
    { file: path.join('Data Concept', 'contracts.json'), kinds: ['data_concept'] },
    { file: path.join('Business Term', 'contracts.json'), kinds: ['business_term'] },
    { file: path.join('Policy', 'contracts.json'), kinds: ['data_policy'] },
  ],
  'technical-catalogue': [
    { file: path.join('System', 'contracts.json'), kinds: ['system'] },
    { file: path.join('Database', 'contracts.json'), kinds: ['database'] },
    { file: path.join('Schema', 'contracts.json'), kinds: ['schema'] },
    { file: path.join('Table', 'contracts.json'), kinds: ['table'] },
    { file: path.join('Column', 'contracts.json'), kinds: ['column'] },
    { file: path.join('Pipeline', 'contracts.json'), kinds: ['pipeline'] },
    { file: path.join('Topic', 'contracts.json'), kinds: ['topic'] },
    { file: path.join('Technology Asset', 'contracts.json'), kinds: ['technical_asset'] },
  ],
  'data-products': [
    { file: path.join('Data Product', 'sdp.json'), kinds: ['data_product'] },
    { file: path.join('Data Product', 'adp.json'), kinds: ['data_product'] },
    { file: path.join('Data Product', 'cdp.json'), kinds: ['data_product'] },
    { file: path.join('Data Contract', 'contracts.json'), kinds: ['data_contract'] },
    { file: path.join('KPI', 'contracts.json'), kinds: ['kpi'] },
  ],
}

function emptyShard(pack, kinds, scopeId) {
  return {
    pack: packOfRel(path.join('scopes', scopeId, pack, 'x.json')),
    kinds: kinds.length ? kinds : [],
    scope: scopeId,
    contracts: {},
  }
}

function ensureShardFile(projectId, scopeId, pack, file, kinds) {
  const full = path.join(projectDir(projectId), 'scopes', scopeId, pack, file)
  if (fs.existsSync(full)) return false
  writeJson(full, emptyShard(pack, kinds, scopeId))
  return true
}

function emptyOssiePackage(projectId, scopeId) {
  return {
    version: '0.2.0.dev0',
    comment: `Apache Ossie interchange package for ${projectId}/${scopeId}. SQ11: Ossie is export, not a second SoR.`,
    spec: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md',
    semantic_model: [],
  }
}

function ensureOssiePackageScaffold(projectId, scopeId) {
  const packageFile = ossiePackagePath(projectId, scopeId)
  const dir = path.dirname(packageFile)
  fs.mkdirSync(dir, { recursive: true })
  const readme = path.join(dir, 'README.md')
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(
      readme,
      `# Apache Ossie entity package

JSON semantic_model for scope \`${scopeId}\` (\`0.2.0.dev0\`). Shown in Contracts as the Ossie Semantic Model; datasets feed the Semantics KG and Data Products (SDP / ADP / CDP).

Spec: https://github.com/apache/ossie/blob/main/core-spec/spec.md
`,
    )
  }
  if (!fs.existsSync(packageFile)) {
    writeJson(packageFile, emptyOssiePackage(projectId, scopeId))
    return true
  }
  return false
}

/** Move contracts from legacy flat shards into per-asset folders (idempotent). */
function migrateLegacyFlatShards(projectId, scopeId) {
  let migrated = 0
  for (const [pack, mapping] of Object.entries(LEGACY_FLAT_SHARDS)) {
    for (const [legacyName, nextRel] of Object.entries(mapping)) {
      const legacyFile = path.join(projectDir(projectId), 'scopes', scopeId, pack, legacyName)
      if (!fs.existsSync(legacyFile)) continue
      const legacy = readJson(legacyFile)
      const nextFile = path.join(projectDir(projectId), 'scopes', scopeId, pack, nextRel)
      const next = fs.existsSync(nextFile)
        ? readJson(nextFile)
        : emptyShard(pack, legacy.kinds ?? [], scopeId)
      if (!next.contracts) next.contracts = {}
      if (!Array.isArray(next.kinds)) next.kinds = []
      for (const kind of legacy.kinds ?? []) {
        if (!next.kinds.includes(kind)) next.kinds.push(kind)
      }
      for (const [id, contract] of Object.entries(legacy.contracts ?? {})) {
        if (!next.contracts[id]) {
          next.contracts[id] = contract
          migrated += 1
        }
      }
      next.scope = scopeId
      next.pack = packOfRel(path.join('scopes', scopeId, pack, nextRel))
      writeJson(nextFile, next)
      fs.unlinkSync(legacyFile)
    }
  }
  return migrated
}

/** Ensure every scope folder has a namespace contract so it appears in ContractBrowser. */
function ensureNamespaceContract(projectId, scopeId) {
  const file = path.join(
    projectDir(projectId),
    'scopes',
    scopeId,
    'semantics',
    'Namespace',
    'contracts.json',
  )
  const shard = fs.existsSync(file)
    ? readJson(file)
    : emptyShard('semantics', ['namespace'], scopeId)
  if (!Array.isArray(shard.kinds)) shard.kinds = []
  if (!shard.kinds.includes('namespace')) shard.kinds.push('namespace')
  if (!shard.contracts) shard.contracts = {}
  const id = `ns-${scopeId}`
  if (shard.contracts[id]) return false
  const hasNs = Object.values(shard.contracts).some((c) => c?.kind === 'namespace')
  if (hasNs) return false
  shard.contracts[id] = defaultNamespaceContract(projectId, scopeId)
  shard.scope = scopeId
  shard.pack = 'semantics'
  writeJson(file, shard)
  return true
}

function ensureScopeScaffold(projectId, scopeId, { ensureNamespace = false } = {}) {
  const scopeRoot = path.join(projectDir(projectId), 'scopes', scopeId)
  migrateLegacyFlatShards(projectId, scopeId)
  for (const pack of STANDARD_SCOPE_PACKS) {
    const dir = path.join(scopeRoot, pack)
    fs.mkdirSync(dir, { recursive: true })
    const readme = path.join(dir, 'README.md')
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(
        readme,
        `# ${pack}\n\nManaged by Projects API namespace scaffold for scope \`${scopeId}\`.\n\nEach asset type has its own folder with a \`contracts.json\` (or class shard) for instance contracts.\n`,
      )
    }
    for (const shard of SCOPE_PACK_SHARDS[pack] ?? []) {
      ensureShardFile(projectId, scopeId, pack, shard.file, shard.kinds)
    }
  }
  ensureOssiePackageScaffold(projectId, scopeId)
  if (ensureNamespace) ensureNamespaceContract(projectId, scopeId)
  return {}
}

export function normalizeProjectScopeStructure(projectId, options = {}) {
  const meta = getProjectMeta(projectId)
  if (!meta) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  const scopesDir = path.join(projectDir(projectId), 'scopes')
  const diskScopes = fs.existsSync(scopesDir)
    ? fs
        .readdirSync(scopesDir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
        .map((e) => e.name)
    : []
  const scopes = Array.from(new Set([...(meta.scopes ?? []), ...diskScopes, 'global']))
  for (const scopeId of scopes) {
    ensureScopeScaffold(projectId, scopeId, {
      ensureNamespace: options.ensureNamespace !== false,
    })
  }
  meta.scopes = Array.from(new Set([...(meta.scopes ?? []), ...scopes]))
  writeJson(path.join(projectDir(projectId), 'project.json'), meta)
  const compiled = compileProject(projectId)
  mirrorCompiled(projectId, compiled)
  return { scopes, ...compiled }
}

function sanitizeScopeId(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function defaultNamespaceContract(projectId, scopeId) {
  const scopeLabel = scopeId === 'global' ? 'Global' : scopeId.replace(/^natco-/, '').toUpperCase()
  return {
    id: `ns-${scopeId}`,
    contract_id: `ctr-inst-namespace-${scopeId}`,
    type_contract_id: 'ctr-scp-type-namespace',
    kind: 'namespace',
    asset_type: 'Namespace',
    display_name: scopeLabel,
    name: scopeId,
    qualified_name: `ns.${scopeId}`,
    source_system: 'semantic_control_plane',
    natco: scopeId,
    characteristics: {
      Slug: scopeId,
      DisplayName: scopeLabel,
      Description: `Namespace for ${projectId}/${scopeId}`,
      NamespaceKind: scopeId === 'global' ? 'global' : 'scope',
      UriBase: `https://semantics.example/ns/${scopeId}/`,
      Status: 'active',
    },
    links: { concepts: [] },
  }
}

export function createNamespace(projectId, namespaceInput, options = {}) {
  const meta = getProjectMeta(projectId)
  if (!meta) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  const scopeId = sanitizeScopeId(namespaceInput)
  if (!scopeId) {
    const err = new Error('Invalid namespace id')
    err.status = 400
    throw err
  }
  // Creating a namespace scaffolds per-asset folders + empty contract JSON + Ossie package stub.
  ensureScopeScaffold(projectId, scopeId)
  const contract = {
    ...defaultNamespaceContract(projectId, scopeId),
    ...options.contract,
    natco: scopeId,
    name: options.name ?? scopeId,
    display_name: options.displayName ?? options.name ?? scopeId,
  }
  const rel = shardRelPath(contract)
  const shardFile = path.join(projectDir(projectId), rel)
  const existing = fs.existsSync(shardFile) ? readJson(shardFile) : null
  writeJson(shardFile, {
    pack: 'semantics',
    kinds: Array.from(new Set([...(existing?.kinds ?? []), 'namespace'])),
    scope: scopeId,
    contracts: {
      ...(existing?.contracts ?? {}),
      [contract.id]: contract,
    },
  })
  meta.scopes = Array.from(new Set([...(meta.scopes ?? []), scopeId]))
  writeJson(path.join(projectDir(projectId), 'project.json'), meta)
  const compiled = compileProject(projectId)
  mirrorCompiled(projectId, compiled)
  return { scopeId, contract, ...compiled }
}

export function listNamespaceScopeIds(projectId) {
  const meta = getProjectMeta(projectId)
  if (!meta) return []
  const ids = new Set()
  const catalog = readDerivedCatalog(projectId)
  if (catalog?.contracts) {
    for (const c of Object.values(catalog.contracts)) {
      if (c?.kind === 'namespace' && c.natco) ids.add(c.natco)
    }
  }
  const scopesDir = path.join(projectDir(projectId), 'scopes')
  if (fs.existsSync(scopesDir)) {
    for (const entry of fs.readdirSync(scopesDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) ids.add(entry.name)
    }
  }
  for (const s of meta.scopes ?? []) ids.add(s)
  return [...ids].sort((a, b) => {
    if (a === 'global') return -1
    if (b === 'global') return 1
    return a.localeCompare(b)
  })
}

/**
 * Consistent delete policy for all namespaces (including global):
 * - Protected demo projects cannot delete `global`
 * - Cannot delete the last remaining namespace in a project
 */
export function isNamespaceDeletable(projectId, namespaceInput) {
  const scopeId = sanitizeScopeId(namespaceInput)
  if (!scopeId) return false
  if (PROTECTED_PROJECT_IDS.has(projectId) && scopeId === 'global') return false
  const scopes = listNamespaceScopeIds(projectId)
  if (!scopes.includes(scopeId)) return false
  if (scopes.length <= 1) return false
  return true
}

export function deleteNamespace(projectId, namespaceInput) {
  const meta = getProjectMeta(projectId)
  if (!meta) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  const scopeId = sanitizeScopeId(namespaceInput)
  if (!scopeId) {
    const err = new Error('Invalid namespace id')
    err.status = 400
    throw err
  }
  if (!isNamespaceDeletable(projectId, scopeId)) {
    const scopes = listNamespaceScopeIds(projectId)
    const err = new Error(
      PROTECTED_PROJECT_IDS.has(projectId) && scopeId === 'global'
        ? 'Cannot delete global namespace on protected demo projects'
        : scopes.length <= 1
          ? 'Cannot delete the last remaining namespace'
          : `Cannot delete namespace: ${scopeId}`,
    )
    err.status = 403
    throw err
  }
  // Fully remove the namespace scaffold (contracts + empty shard files) and its presence
  // in `project.json` so the UI and derived catalog don't resurrect it on normalize.
  const scopeDir = path.join(projectDir(projectId), 'scopes', scopeId)
  if (fs.existsSync(scopeDir)) {
    fs.rmSync(scopeDir, { recursive: true, force: true })
  }

  meta.scopes = Array.from(new Set([...(meta.scopes ?? [])].filter((s) => s !== scopeId)))
  writeJson(path.join(projectDir(projectId), 'project.json'), meta)

  const compiled = compileProject(projectId)
  mirrorCompiled(projectId, compiled)
  return { deleted: scopeId, ...compiled }
}

export function listNamespaces(projectId) {
  const meta = getProjectMeta(projectId)
  if (!meta) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  return listNamespaceScopeIds(projectId).map((scopeId) => ({
    id: scopeId,
    scope: scopeId,
    deletable: isNamespaceDeletable(projectId, scopeId),
    path: `mock-data/projects/${projectId}/scopes/${scopeId}`,
  }))
}

export function deleteContract(projectId, contractId) {
  if (!getProjectMeta(projectId)) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  const file = findContractShardFile(projectId, contractId)
  if (!file) {
    const err = new Error(`Contract not found: ${contractId}`)
    err.status = 404
    throw err
  }
  const shard = readJson(file)
  delete shard.contracts[contractId]
  const remaining = Object.keys(shard.contracts ?? {}).length
  if (remaining === 0 && !isSharedBucketFile(file)) {
    fs.unlinkSync(file)
  } else {
    writeJson(file, shard)
  }
  const compiled = compileProject(projectId)
  mirrorCompiled(projectId, compiled)
  return compiled
}

export function deleteProject(projectId) {
  if (!isProjectDeletable(projectId)) {
    const err = new Error(`Cannot delete protected demo project: ${projectId}`)
    err.status = 403
    throw err
  }
  const dir = projectDir(projectId)
  if (!fs.existsSync(dir)) {
    const err = new Error(`Project not found: ${projectId}`)
    err.status = 404
    throw err
  }
  fs.rmSync(dir, { recursive: true, force: true })
  return { deleted: projectId, path: dir }
}
