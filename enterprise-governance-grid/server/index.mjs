import http from 'node:http'
import { URL } from 'node:url'
import neo4j from 'neo4j-driver'
import { KG_VIEWS, VIEW_CATALOG } from './views.mjs'
import { recordsToGraph, recordsToTable, graphToTables } from './adapter.mjs'
import { loadQueryCatalog, catalogMeta } from './parse-cypher-catalog.mjs'

const PORT = Number(process.env.KG_API_PORT ?? 8787)
const NEO4J_URI = process.env.NEO4J_URI ?? 'bolt://127.0.0.1:7687'
const NEO4J_USER = process.env.NEO4J_USER ?? 'neo4j'
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD ?? 'contracts-kg'

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD), {
  disableLosslessIntegers: true,
})

const QUERY_CATALOG = loadQueryCatalog()
const QUERY_BY_ID = new Map(QUERY_CATALOG.map((q) => [q.id, q]))

const WRITE_RE = /\b(CREATE|MERGE|DELETE|DETACH\s+DELETE|SET\s+|REMOVE\s+|DROP|LOAD\s+CSV|FOREACH)\b/i

function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  })
  res.end(payload)
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const err = new Error('Invalid JSON body')
    err.status = 400
    throw err
  }
}

async function checkHealth() {
  const session = driver.session({ defaultAccessMode: neo4j.session.READ })
  try {
    const r = await session.run('RETURN 1 AS ok')
    return {
      ok: true,
      neo4j: true,
      result: r.records[0]?.get('ok') === 1,
      queryCount: QUERY_CATALOG.length,
    }
  } catch (err) {
    return { ok: false, neo4j: false, error: err.message, queryCount: QUERY_CATALOG.length }
  } finally {
    await session.close()
  }
}

const DEMO_PARAM_DEFAULTS = {
  productId: 'dp-customer-360',
  natco: 'natco-de',
}

function withDemoParams(params = {}) {
  return {
    ...DEMO_PARAM_DEFAULTS,
    ...(params && typeof params === 'object' ? params : {}),
  }
}

async function executeCypher(cypher, params = {}, options = {}) {
  const trimmed = String(cypher ?? '').trim()
  if (!trimmed) {
    const err = new Error('Empty Cypher')
    err.status = 400
    throw err
  }
  if (WRITE_RE.test(trimmed)) {
    const err = new Error('Write queries are blocked in this demo API (read-only)')
    err.status = 403
    throw err
  }

  const compact = options.compact !== false
  const bound = withDemoParams(params)
  const session = driver.session({ defaultAccessMode: neo4j.session.READ })
  try {
    const result = await session.run(trimmed, bound)
    const table = recordsToTable(result.records)
    const finalGraph = recordsToGraph(result.records, { compact })
    const graphTables = graphToTables(finalGraph)

    return {
      source: 'neo4j',
      mode: 'both',
      cypher: trimmed,
      params: bound,
      compact,
      nodeCount: finalGraph.nodes.length,
      edgeCount: finalGraph.edges.length,
      rowCount: table.rows.length,
      nodes: finalGraph.nodes,
      edges: finalGraph.edges,
      table,
      graphTables,
      hasGraph: finalGraph.nodes.length > 0,
      hasTable: table.rows.length > 0,
      summary: {
        counters: result.summary?.counters?._stats ?? undefined,
        resultAvailableAfter: result.summary?.resultAvailableAfter,
      },
    }
  } finally {
    await session.close()
  }
}

async function runView(viewId, queryParams) {
  const view = KG_VIEWS[viewId]
  if (!view) {
    const err = new Error(`Unknown view: ${viewId}`)
    err.status = 404
    throw err
  }

  const params = { ...view.params }
  if (viewId === 'natco-stack' && queryParams.get('natco')) {
    params.natco = queryParams.get('natco')
  }

  const data = await executeCypher(view.cypher, params, { compact: true, mode: 'graph' })
  return {
    ...data,
    view: viewId,
    title: view.title,
    description: view.description,
  }
}

async function runCatalogQuery(queryId, options = {}) {
  const q = QUERY_BY_ID.get(queryId)
  if (!q) {
    const err = new Error(`Unknown query: ${queryId}`)
    err.status = 404
    throw err
  }
  const mode = options.mode ?? (q.resultHint === 'table' ? 'table' : q.resultHint === 'graph' ? 'graph' : 'auto')
  const compact = options.compact ?? !String(q.code).startsWith('N')
  const data = await executeCypher(q.cypher, options.params, { compact, mode })
  return {
    ...data,
    queryId: q.id,
    code: q.code,
    title: q.title,
    description: q.description,
    sourceFile: q.sourceFile,
    group: q.group,
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  try {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (req.method === 'GET' && (path === '/api/kg/health' || path === '/health')) {
      const health = await checkHealth()
      sendJson(res, health.ok ? 200 : 503, health)
      return
    }

    if (req.method === 'GET' && path === '/api/kg/views') {
      sendJson(res, 200, { views: VIEW_CATALOG })
      return
    }

    if (req.method === 'GET' && path === '/api/kg/queries') {
      sendJson(res, 200, {
        queries: catalogMeta(QUERY_CATALOG),
        groups: [
          { id: 'demo', label: 'Lineage scenarios · Q1–Q7' },
          { id: 'country-stacks', label: 'NATCO end-to-end · N1–N5' },
        ],
      })
      return
    }

    const queryMatch = path.match(/^\/api\/kg\/queries\/([^/]+)$/)
    if (req.method === 'GET' && queryMatch) {
      const q = QUERY_BY_ID.get(decodeURIComponent(queryMatch[1]))
      if (!q) {
        sendJson(res, 404, { error: 'Unknown query' })
        return
      }
      sendJson(res, 200, q)
      return
    }

    if (req.method === 'POST' && path === '/api/kg/queries/run') {
      const body = await readBody(req)
      if (!body.queryId) {
        sendJson(res, 400, { error: 'queryId required' })
        return
      }
      const data = await runCatalogQuery(body.queryId, {
        mode: body.mode,
        compact: body.compact,
        params: body.params,
      })
      sendJson(res, 200, data)
      return
    }

    if (req.method === 'POST' && path === '/api/kg/run') {
      const body = await readBody(req)
      const data = await executeCypher(body.cypher, body.params ?? {}, {
        mode: body.mode ?? 'auto',
        compact: body.compact !== false,
      })
      sendJson(res, 200, data)
      return
    }

    const viewMatch = path.match(/^\/api\/kg\/views\/([^/]+)$/)
    if (req.method === 'GET' && viewMatch) {
      const data = await runView(decodeURIComponent(viewMatch[1]), url.searchParams)
      sendJson(res, 200, data)
      return
    }

    sendJson(res, 404, {
      error: 'Not found',
      paths: [
        'GET /api/kg/health',
        'GET /api/kg/views',
        'GET /api/kg/views/:id',
        'GET /api/kg/queries',
        'GET /api/kg/queries/:id',
        'POST /api/kg/queries/run',
        'POST /api/kg/run',
      ],
    })
  } catch (err) {
    const status = err.status ?? 500
    sendJson(res, status, { error: err.message ?? 'Server error', source: 'neo4j' })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[kg-api] listening on http://127.0.0.1:${PORT}`)
  console.log(`[kg-api] neo4j ${NEO4J_URI} (user=${NEO4J_USER})`)
  console.log(`[kg-api] loaded ${QUERY_CATALOG.length} Cypher queries from neo4j-contracts-kg/cypher`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await driver.close()
    server.close(() => process.exit(0))
  })
}
