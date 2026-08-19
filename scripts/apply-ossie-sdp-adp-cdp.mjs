#!/usr/bin/env node
/**
 * Apply Apache Ossie interchange + SDP/ADP/CDP product class across
 * UDP-DT Data Product examples (pack-level) then recompile derived catalogs.
 *
 * Source of truth: mock-data/projects/udp-dt/scopes/
 * Mirrors (contracts/examples/pitch/, mock-data/entities/) are rebuilt by compile.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileProject, mirrorCompiled } from './lib/project-mock-layout.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function writeJson(p, v) {
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
}

function classifyProduct(c) {
  if (c.product_class === 'CDP' || c.characteristics?.ProductClass === 'CDP') return 'CDP'
  const natco = String(c.natco ?? c.scope ?? '')
  if (c.scope === 'natco' || /^natco-/.test(natco) || /-(de|at|hr|hu|pl)$/.test(c.id ?? '')) return 'SDP'
  return 'ADP'
}

function ossieForDt(c, cls) {
  if (cls === 'CDP') return { model: 'customer_360', dataset: 'copilot_customer' }
  if (cls === 'SDP') {
    const n = String(c.natco ?? c.id ?? '')
    if (n.includes('hr')) return { model: 'customer_360', dataset: 'customers_hr' }
    if (n.includes('at')) return { model: 'customer_360', dataset: 'customers_at' }
    return { model: 'customer_360', dataset: 'customers_de' }
  }
  return { model: 'customer_360', dataset: 'customers' }
}

function stampProduct(c, project = 'udp-dt') {
  const cls = classifyProduct(c)
  const ossie =
    project === 'udp-pattern'
      ? {
          model: 'ucp_shopping',
          dataset:
            cls === 'CDP' ? 'checkout_session' : cls === 'SDP' ? 'amazon_listing' : 'product',
        }
      : ossieForDt(c, cls)
  c.product_class = cls
  c.ossie_model = ossie.model
  c.ossie_dataset = ossie.dataset
  c.characteristics = {
    ...(c.characteristics ?? {}),
    ProductClass: cls,
    OssieModel: ossie.model,
    OssieDataset: ossie.dataset,
  }
  return c
}

const dpDir = path.join(root, 'contracts/Data Products/Data Product/examples')
for (const file of fs.readdirSync(dpDir).filter((f) => f.endsWith('.json'))) {
  const p = path.join(dpDir, file)
  const c = stampProduct(readJson(p), 'udp-dt')
  writeJson(p, c)
}

const cdpPath = path.join(dpDir, 'dp-cdp-customer-360-copilot.json')
writeJson(cdpPath, {
  id: 'dp-cdp-customer-360-copilot',
  contract_id: 'ctr-inst-dp-cdp-customer-360-copilot',
  type_contract_id: 'ctr-dp-type-data-product',
  kind: 'data_product',
  asset_type: 'Data Product',
  display_name: 'Customer 360 · Copilot slice',
  name: 'Customer 360 · Copilot slice',
  qualified_name: 'products.dp-cdp-customer-360-copilot',
  source_system: 'entropy_marketplace',
  natco: 'global',
  layer: 'product',
  familyId: 'customer-360',
  scope: 'global',
  product_class: 'CDP',
  ossie_model: 'customer_360',
  ossie_dataset: 'copilot_customer',
  characteristics: {
    Description: 'Consumer-aligned Customer 360 projection for Marketplace copilots and MCP agents.',
    Status: 'Published',
    Owner: 'AI Experience Team',
    ProductClass: 'CDP',
    OssieModel: 'customer_360',
    OssieDataset: 'copilot_customer',
  },
  links: {
    domain: 'domain-customer',
    consumes: ['dp-customer-360'],
    table: 'table-serve-copilot-customer-360',
    ossie_model: 'ossie-dt-customer-360',
  },
  implements_concept_ids: ['concept-global-Customer'],
  metadata: { pack: 'data-products', da: 'DA-10', product_class: 'CDP' },
})

// Patch scopes shards — update every data_product shard and the global semantics ossie-model shard
const scopesRoot = path.join(root, 'mock-data/projects/udp-dt/scopes')

function walkShards(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walkShards(full, acc)
    else if (e.name.endsWith('.json') && !full.includes('entity/apache-ossie') && e.name !== 'knowledge-graph.json') acc.push(full)
  }
  return acc
}

for (const shardFile of walkShards(scopesRoot)) {
  const shard = readJson(shardFile)
  if (!shard?.contracts) continue
  let dirty = false
  for (const [id, c] of Object.entries(shard.contracts)) {
    if (c.kind === 'data_product') {
      shard.contracts[id] = stampProduct(c, 'udp-dt')
      dirty = true
    }
    if (c.kind === 'ossie_semantic_model' && !c.package_file) {
      c.package_file = 'mock-data/projects/udp-dt/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json'
      dirty = true
    }
  }
  // Ensure CDP copilot contract exists in global data-products shard
  if (shardFile.includes('global') && shardFile.endsWith('data-products/cdp.json')) {
    if (!shard.contracts['dp-cdp-customer-360-copilot']) {
      shard.contracts['dp-cdp-customer-360-copilot'] = stampProduct(readJson(cdpPath), 'udp-dt')
      dirty = true
    }
  }
  if (dirty) writeJson(shardFile, shard)
}

// Also patch the graph (stored in scopes/global/semantics/knowledge-graph.json)
const graphPath = path.join(scopesRoot, 'global/semantics/knowledge-graph.json')
if (!fs.existsSync(graphPath)) {
  console.warn('!! no knowledge-graph.json found at', graphPath, '— skipping graph patches')
  // Run compile and exit
  const compiled = compileProject('udp-dt')
  mirrorCompiled('udp-dt', compiled)
  console.log('==> compiled udp-dt (no graph to patch)')
  process.exit(0)
}
const graph = readJson(graphPath)
const have = new Set(graph.nodes.map((n) => n.id))
function addNode(n) {
  if (!have.has(n.id)) {
    graph.nodes.push(n)
    have.add(n.id)
  }
}
function addEdge(from, to, predicate) {
  if (graph.edges.some((e) => e.from === from && e.to === to && e.predicate === predicate)) return
  graph.edges.push({ id: `e-ossie-${graph.edges.length + 1}`, from, to, predicate })
}

addNode({
  id: 'ossie-dt-customer-360',
  type: 'contract',
  label: 'Ossie · customer_360',
  subtitle: 'Apache Ossie interchange',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ossie-dt-customer-360',
  position: { x: 1180, y: -40 },
  hub: true,
})
addNode({
  id: 'ds-customers',
  type: 'table',
  label: 'customers',
  subtitle: 'Ossie dataset · ADP',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ossie-dt-customer-360',
  position: { x: 1180, y: 80 },
})
addNode({
  id: 'ds-customers-de',
  type: 'table',
  label: 'customers_de',
  subtitle: 'Ossie dataset · SDP',
  layer: 'semantics',
  natco: 'natco-de',
  contract_ref: 'ctr-ossie-dt-customer-360',
  position: { x: 200, y: 80 },
})
addNode({
  id: 'dp-cdp-customer-360-copilot',
  type: 'product',
  label: 'Customer 360 · Copilot',
  subtitle: 'CDP · serve.copilot',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-inst-dp-cdp-customer-360-copilot',
  position: { x: 720, y: -80 },
})
addEdge('ns-global', 'ossie-dt-customer-360', 'contains')
addEdge('ossie-dt-customer-360', 'ds-customers', 'contains')
addEdge('ossie-dt-customer-360', 'ds-customers-de', 'contains')
addEdge('ds-customers', 'concept-customer', 'represents')
addEdge('ds-customers-de', 'concept-de-entity', 'represents')
addEdge('ds-customers-de', 'ds-customers', 'feeds')
if (have.has('product-c360')) addEdge('product-c360', 'ds-customers', 'implements')
addEdge('dp-cdp-customer-360-copilot', 'product-c360', 'consumes')
addEdge('dp-cdp-customer-360-copilot', 'concept-customer', 'implements')
addEdge('dp-cdp-customer-360-copilot', 'ds-customers', 'consumes')
graph.meta = {
  ...(graph.meta ?? {}),
  ossie_model: 'customer_360',
  ossie_package: 'mock-data/projects/udp-dt/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
  product_classes: ['SDP', 'ADP', 'CDP'],
}
writeJson(graphPath, graph)

// Recompile derived catalog + KG + coverage from the now-patched scopes
const compiled = compileProject('udp-dt')
mirrorCompiled('udp-dt', compiled)
console.log(`==> recompiled udp-dt: ${Object.keys(compiled.catalog.contracts).length} contracts, ${compiled.graph.nodes?.length ?? 0} nodes`)

const analysis = {
  spec: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md',
  version: '0.2.0.dev0',
  principle: 'Ossie is interchange, not a second SoR (SQ11). Semantic Control Plane keeps concept URIs.',
  ossie_constructs: ['semantic_model', 'datasets', 'fields', 'relationships', 'metrics', 'ai_context', 'custom_extensions'],
  product_classes: {
    SDP: 'Source-aligned — 1:1 with a channel/NATCO system of record',
    ADP: 'Aggregated/integrated — enterprise grain implementing the canonical concept',
    CDP: 'Consumer-aligned — projection for a specific consumer (copilot, checkout, BI)',
  },
  layer_updates: [
    { layer: 'Semantics', change: 'Concept gains OssieDataset / OssieField; Ossie model contract in global pack' },
    { layer: 'Business', change: 'Glossary terms keep mapsTo; metrics export as Ossie metrics' },
    { layer: 'Technical', change: 'Table.source becomes Ossie datasets[].source' },
    { layer: 'Data Products', change: 'ProductClass SDP|ADP|CDP is core; OssieModel + OssieDataset optional' },
    { layer: 'KG', change: 'Ossie model node contains datasets; SDP feeds ADP; CDP consumes ADP' },
  ],
  e2e: {
    'udp-dt': {
      sdp: 'customers_de / customers_at / customers_hr',
      adp: 'customers → global/Customer',
      cdp: 'copilot_customer → Customer 360 Copilot slice',
      package: 'mock-data/projects/udp-dt/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    },
    'udp-pattern': {
      sdp: 'amazon_listing, tiktok_product, tmall_item, gmc_offer',
      adp: 'product + variant → ucp.shopping/Product|Variant',
      cdp: 'checkout_session → Google native checkout',
      package: 'mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    },
  },
}
writeJson(path.join(root, 'contracts/examples/ossie/gap-analysis.json'), analysis)

console.log('==> Ossie + SDP/ADP/CDP applied to UDP-DT catalogs')
console.log('   DP examples stamped in', dpDir)
console.log('   pitch contracts:', Object.keys(catalog.contracts).length)
console.log('   graph nodes:', graph.nodes.length, 'edges:', graph.edges.length)
