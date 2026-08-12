#!/usr/bin/env node
/**
 * Export every kg-api catalog scenario to static snapshots for GitHub Pages mock mode.
 *
 * Prerequisites: Neo4j loaded + kg-api running on :8787
 *
 *   node frontend/scripts/export-kg-snapshots.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../src/data/kg-snapshots')
const BASE = process.env.KG_API_BASE ?? 'http://127.0.0.1:8787'
const PRODUCT_IDS = [
  'dp-customer-360',
  'dp-customer-interactions',
  'dp-product-orders',
  'dp-billing-accounts',
  'dp-service-subscriptions',
]

async function getJson(url, init) {
  const res = await fetch(url, init)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `${res.status} ${url}`)
  return data
}

function slimResult(result, meta) {
  return {
    meta: {
      id: meta.id,
      code: meta.code,
      title: meta.title,
      description: meta.description,
      sourceFile: meta.sourceFile,
      group: meta.group,
      resultHint: meta.resultHint,
      exportedAt: new Date().toISOString(),
    },
    source: 'static',
    mode: result.mode ?? 'graph',
    title: result.title ?? meta.title,
    description: result.description ?? meta.description,
    queryId: meta.id,
    code: meta.code,
    sourceFile: meta.sourceFile,
    group: meta.group,
    nodeCount: result.nodeCount ?? result.nodes?.length ?? 0,
    edgeCount: result.edgeCount ?? result.edges?.length ?? 0,
    rowCount: result.rowCount ?? 0,
    nodes: result.nodes ?? [],
    edges: result.edges ?? [],
    hasGraph: Boolean(result.hasGraph ?? (result.nodes?.length ?? 0) > 0),
    hasTable: Boolean(result.hasTable),
    table: result.table,
    graphTables: result.graphTables,
  }
}

async function runQuery(meta, params = {}) {
  const result = await getJson(`${BASE}/api/kg/queries/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queryId: meta.id,
      mode: 'auto',
      compact: false,
      params,
    }),
  })
  return slimResult(result, meta)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const health = await getJson(`${BASE}/api/kg/health`)
  if (!health.ok) throw new Error(`kg-api unhealthy: ${health.error ?? 'neo4j down'}`)

  const catalog = await getJson(`${BASE}/api/kg/queries`)
  const queries = catalog.queries ?? []
  const groups = catalog.groups ?? []
  if (!queries.length) throw new Error('Empty query catalog')

  const index = {
    exportedAt: new Date().toISOString(),
    queryCount: queries.length,
    groups,
    queries: queries.map(({ id, code, title, description, sourceFile, group, resultHint }) => ({
      id,
      code,
      title,
      description,
      sourceFile,
      group,
      resultHint,
    })),
    snapshots: {},
  }

  for (const q of queries) {
    const code = q.code.toUpperCase()
    console.log(`==> ${code} ${q.title}`)

    if (code === 'Q2') {
      for (const natco of ['natco-de', 'natco-at', 'natco-hr', 'natco-hu', 'natco-pl']) {
        const snap = await runQuery(q, { natco })
        const key = `Q2__${natco}`
        const file = `${key}.json`
        fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(snap))
        index.snapshots[key] = file
        console.log(`    wrote ${file} (${snap.nodeCount} nodes)`)
      }
      // default alias
      index.snapshots.Q2 = index.snapshots['Q2__natco-de']
      continue
    }

    if (code === 'Q3') {
      for (const productId of PRODUCT_IDS) {
        const snap = await runQuery(q, { productId })
        const key = `Q3__${productId}`
        const file = `${key}.json`
        fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(snap))
        index.snapshots[key] = file
        console.log(`    wrote ${file} (${snap.nodeCount} nodes)`)
      }
      index.snapshots.Q3 = index.snapshots['Q3__dp-customer-360']
      continue
    }

    const snap = await runQuery(q)
    const file = `${code}.json`
    fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(snap))
    index.snapshots[code] = file
    console.log(`    wrote ${file} (${snap.nodeCount} nodes)`)
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2))
  console.log(`==> Wrote catalog index (${Object.keys(index.snapshots).length} snapshot keys)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
