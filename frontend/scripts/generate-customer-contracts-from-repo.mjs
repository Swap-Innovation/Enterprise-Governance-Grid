/**
 * Harvest pack example instances into a diagnostic JSON.
 *
 * Demo SoR is `mock-data/projects/udp-dt/scopes/` compiled by
 * `scripts/compile-project-mock.mjs`. This script does not overwrite that tree.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const CONTRACTS_DIR = path.join(ROOT, 'contracts')
// Output: diagnostic snapshot only — NOT the UI SoR (that is derived/catalog.json compiled by compile-project-mock.mjs)
const OUT_PATH = path.join(ROOT, 'mock-data/projects/udp-dt/derived/from-packs.json')

const SKIP_NAMES = new Set([
  'sample-assets.json',
  'index.json',
  'namespaces.json',
  'multi-natco-customer.json',
  'end-to-end-customer-flow.json',
  'customer-contracts.json',
  'customer-context-graph.json',
  'multi-natco-customer-assets.json',
  'technical-catalog-assets.json',
  'pitch-concepts.json',
  'tmforum.json',
  '00. README.md',
])

function walkJsonFiles(dir) {
  const out = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...walkJsonFiles(full))
    } else if (e.isFile() && e.name.endsWith('.json')) {
      out.push(full)
    }
  }
  return out
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function mapKindForBrowser(kind, assetType) {
  // ContractBrowser maps kind -> pack.
  // Keep it compatible with `frontend/src/components/ContractBrowser.tsx`.
  if (kind === 'concept') return 'semantic_concept'
  if (kind === 'column') return 'column'

  // Keep the technical catalog stack as first-class kinds so the browser
  // can show System → Database → Schema → Table → Column folders.
  if (kind === 'system' || kind === 'database' || kind === 'schema' || kind === 'table') return kind
  if (kind === 'pipeline' || kind === 'topic') return kind

  // Remaining technical-catalog items collapse into a generic bucket.
  const technicalAsAssets = new Set([
    'technical_asset',
    'api_endpoint',
    'stored_procedure',
    'dataset',
    'directory',
    'field',
    'foreign_key',
    'file_storage',
    'file',
    'json_schema',
    'value_set',
    'ontology_package',
    'measure',
    'report',
    'report_attribute',
    'issue',
  ])
  if (technicalAsAssets.has(kind)) return 'technical_asset'

  // Business
  if (
    kind === 'business_term' ||
    kind === 'data_domain' ||
    kind === 'data_model' ||
    kind === 'data_entity' ||
    kind === 'data_attribute' ||
    kind === 'data_concept'
  ) {
    return kind
  }

  // Products
  if (kind === 'data_product') return 'data_product'
  if (kind === 'data_contract') return 'data_contract'

  // Semantics
  if (kind === 'namespace') return 'namespace'

  // Otherwise ignore for folder listings.
  return null
}

function inferNatcoFromId(id) {
  if (typeof id !== 'string') return null
  const m = id.match(/(natco-(?:de|at|hr|hu|pl))|ns-natco-(?:de|at|hr|hu|pl)|concept-natco-(?:de|at|hr|hu|pl)/i)
  return m ? m[1] ?? m[0].replace(/^ns-/, '') : null
}

function inferNatcoFromQualifiedName(qn) {
  if (typeof qn !== 'string') return null
  const m = qn.match(/natco-(?:de|at|hr|hu|pl)/i)
  return m?.[0] ?? null
}

function isContractAssetInstance(data) {
  if (!data || typeof data !== 'object') return false
  if (data.meta || data.assets || data.namespaces) return false
  if (!('id' in data)) return false
  if (!('contract_id' in data) && !('type_contract_id' in data)) return false
  if (!('kind' in data)) return false
  return true
}

const allFiles = walkJsonFiles(CONTRACTS_DIR)
const contracts = {}
const natcoSet = new Set()

for (const file of allFiles) {
  const rel = path.relative(CONTRACTS_DIR, file)
  const name = path.basename(file)
  if (SKIP_NAMES.has(name)) continue

  // Include:
  // - Type-level `example.json` (e.g. `.../Data Entity/example.json`)
  // - Pack/Type-level `examples/*.json` (e.g. `.../Data Entity/examples/*.json`)
  // Exclude master `contracts/examples/**` scenario/pitch files.
  if (rel.startsWith(`examples${path.sep}`)) continue
  const inExamplesSubdir = rel.includes(`${path.sep}examples${path.sep}`)
  const isTypeExample = name === 'example.json'
  if (!isTypeExample && !inExamplesSubdir) continue
  if (!isTypeExample && !name.endsWith('.json')) continue

  const data = readJson(file)
  if (!data) continue
  if (!isContractAssetInstance(data)) continue

  const mappedKind = mapKindForBrowser(data.kind, data.asset_type)
  if (!mappedKind) continue

  const inferredNatco = data.natco ?? inferNatcoFromId(data.id) ?? inferNatcoFromQualifiedName(data.qualified_name)
  const natco = inferredNatco ?? 'global'
  natcoSet.add(natco)

  // Normalize for the UI: ensure stable fields exist.
  contracts[data.id] = {
    ...data,
    kind: mappedKind,
    natco,
    // ContractBrowser uses these for display fallbacks.
    name: data.name ?? data.display_name ?? data.title,
    display_name: data.display_name ?? data.name ?? data.id,
  }
}

const natcos = Array.from(natcoSet)
  .sort((a, b) => (a === 'global' ? -1 : b === 'global' ? 1 : a.localeCompare(b)))
  .filter(Boolean)

const out = {
  meta: {
    title: 'Customer multi-pack contracts (generated)',
    domain: 'customer',
    sid_version: 'R20.0',
    generated_at: new Date().toISOString(),
    natcos,
  },
  contracts,
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2))

console.log('==> diagnostic snapshot written to', path.relative(ROOT, OUT_PATH))
console.log('   natcos:', natcos.join(', '))
console.log('   contracts:', Object.keys(contracts).length)
console.log('   NOTE: UI reads derived/catalog.json — run: node scripts/compile-project-mock.mjs')

