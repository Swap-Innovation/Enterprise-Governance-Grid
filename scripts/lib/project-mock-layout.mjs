/**
 * mock-data/projects layout: shard authored catalogs, compile ContractBrowser + KG,
 * and report Ossie / link / graph coverage gaps.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const PROJECTS_ROOT = path.join(root, 'mock-data/projects')

export const KIND_SHARD = {
  namespace: ['semantics', 'namespaces.json'],
  semantic_concept: ['semantics', 'concepts.json'],
  ossie_semantic_model: ['semantics', 'ossie-semantic-model.json'],
  business_term: ['business-catalogue', 'terms.json'],
  data_domain: ['business-catalogue', 'domains.json'],
  data_model: ['business-catalogue', 'models.json'],
  data_entity: ['business-catalogue', 'entities.json'],
  data_attribute: ['business-catalogue', 'attributes.json'],
  data_concept: ['business-catalogue', 'concepts.json'],
  system: ['technical-catalogue', 'systems.json'],
  database: ['technical-catalogue', 'databases.json'],
  schema: ['technical-catalogue', 'schemas.json'],
  table: ['technical-catalogue', 'tables.json'],
  column: ['technical-catalogue', 'columns.json'],
  pipeline: ['technical-catalogue', 'pipelines.json'],
  topic: ['technical-catalogue', 'topics.json'],
  technical_asset: ['technical-catalogue', 'assets.json'],
  data_contract: ['data-products', 'contracts.json'],
}

const OSSIE_REL = `${path.sep}entity${path.sep}apache-ossie${path.sep}`

export function projectDir(projectId) {
  return path.join(PROJECTS_ROOT, projectId)
}

export function ossiePackagePath(projectId) {
  return path.join(
    projectDir(projectId),
    'scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
  )
}

function productFile(contract) {
  const cls = String(contract.product_class ?? '').toUpperCase()
  if (cls === 'SDP') return 'sdp.json'
  if (cls === 'ADP') return 'adp.json'
  if (cls === 'CDP') return 'cdp.json'
  return 'products.json'
}

export function shardRelPath(contract) {
  const scope = contract.natco || 'global'
  if (contract.kind === 'data_product') {
    return path.join('scopes', scope, 'data-products', productFile(contract))
  }
  const spec = KIND_SHARD[contract.kind]
  if (!spec) return path.join('scopes', scope, 'unclassified', `${contract.kind}.json`)
  return path.join('scopes', scope, spec[0], spec[1])
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
    catalog: path.join(root, 'contracts/examples/pitch/customer-contracts.json'),
    graph: path.join(root, 'contracts/examples/pitch/customer-context-graph.json'),
    fallbackCatalog: path.join(root, 'mock-data/entities/customer-contracts.json'),
    fallbackGraph: path.join(root, 'mock-data/relationships/customer-context-graph.json'),
  },
  'udp-pattern': {
    catalog: path.join(root, 'mock-data/projects/udp-pattern/entities.json'),
    graph: path.join(root, 'mock-data/projects/udp-pattern/relationships.json'),
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
      [path.join(root, 'mock-data/entities/customer-contracts.json'), catalog],
      [path.join(root, 'mock-data/relationships/customer-context-graph.json'), graph],
    )
  }
  if (projectId === 'udp-pattern') {
    copies.push(
      [path.join(root, 'contracts/examples/pitch/pattern-contracts.json'), catalog],
      [path.join(root, 'contracts/examples/pitch/pattern-context-graph.json'), graph],
      [path.join(projectDir(projectId), 'entities.json'), catalog],
      [path.join(projectDir(projectId), 'relationships.json'), graph],
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
