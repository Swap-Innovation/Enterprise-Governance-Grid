import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CYPHER_DIR = path.resolve(__dirname, '../neo4j/cypher')

/**
 * Parse Neo4j Browser–style Cypher files into a query catalog.
 * Supports:
 *   // ============================================================
 *   // VIEW G1 — Title
 *   // description
 *   // ============================================================
 *   MATCH ... RETURN ...;
 *
 *   // --- E1 Germany (natco-de) ---
 *   MATCH ... RETURN ...;
 *
 *   // Q1 — Title
 *   MATCH ... RETURN ...;
 */
export function parseCypherCatalog(fileText, sourceFile) {
  const lines = fileText.split(/\r?\n/)
  const queries = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Block header: VIEW G1 — …
    if (/^\/\/\s*=+\s*$/.test(line)) {
      i += 1
      const titleLine = lines[i] ?? ''
      const titleMatch = titleLine.match(/^\/\/\s*(?:VIEW\s+)?([A-Z]?\d+[A-Z]?|[A-Z]\d+)\s*[—–\-]+\s*(.+)\s*$/i)
      if (!titleMatch) {
        i += 1
        continue
      }
      const code = titleMatch[1].trim()
      const title = titleMatch[2].trim()
      i += 1
      const descParts = []
      while (i < lines.length && /^\/\//.test(lines[i]) && !/^\/\/\s*=+\s*$/.test(lines[i])) {
        const d = lines[i].replace(/^\/\/\s?/, '').trim()
        if (d) descParts.push(d)
        i += 1
      }
      if (i < lines.length && /^\/\/\s*=+\s*$/.test(lines[i])) i += 1
      while (i < lines.length && !lines[i].trim()) i += 1
      const { cypher, next } = readStatement(lines, i)
      i = next
      if (cypher) {
        queries.push({
          id: slugId(sourceFile, code, title),
          code,
          title: `${code} · ${title}`,
          description: descParts.join(' '),
          sourceFile,
          group: groupFor(code, sourceFile),
          resultHint: hintFor(cypher),
          cypher,
        })
      }
      continue
    }

    // Inline country: // --- E1 Germany (natco-de) ---
    const eMatch = line.match(/^\/\/\s*---\s*([A-Z]?\d+)\s+(.+?)\s*---\s*$/i)
    if (eMatch) {
      const code = eMatch[1].trim()
      const title = eMatch[2].trim()
      i += 1
      while (i < lines.length && !lines[i].trim()) i += 1
      const { cypher, next } = readStatement(lines, i)
      i = next
      if (cypher) {
        queries.push({
          id: slugId(sourceFile, code, title),
          code,
          title: `${code} · ${title}`,
          description: title,
          sourceFile,
          group: 'country-stacks',
          resultHint: 'graph',
          cypher,
        })
      }
      continue
    }

    // Demo Qn: // Q1 — Title
    const qMatch = line.match(/^\/\/\s*(Q\d+)\s*[—–\-]+\s*(.+)\s*$/i)
    if (qMatch) {
      const code = qMatch[1].trim()
      const title = qMatch[2].trim()
      i += 1
      while (i < lines.length && !lines[i].trim()) i += 1
      const { cypher, next } = readStatement(lines, i)
      i = next
      if (cypher) {
        queries.push({
          id: slugId(sourceFile, code, title),
          code,
          title: `${code} · ${title}`,
          description: title,
          sourceFile,
          group: 'demo',
          resultHint: hintFor(cypher),
          cypher,
        })
      }
      continue
    }

    i += 1
  }

  return queries
}

function readStatement(lines, start) {
  const buf = []
  let i = start
  while (i < lines.length) {
    const raw = lines[i]
    // Stop at next section header
    if (
      /^\/\/\s*=+\s*$/.test(raw) ||
      /^\/\/\s*---\s*[A-Z]?\d+/i.test(raw) ||
      /^\/\/\s*Q\d+\s*[—–\-]/i.test(raw)
    ) {
      break
    }
    // Skip pure comment lines inside statement area (keep blank)
    if (/^\/\//.test(raw)) {
      i += 1
      continue
    }
    buf.push(raw)
    if (/;\s*$/.test(raw)) {
      i += 1
      break
    }
    i += 1
  }
  const cypher = buf.join('\n').replace(/;\s*$/, '').trim()
  return { cypher, next: i }
}

function slugId(sourceFile, code, title) {
  const base = path.basename(sourceFile, '.cypher')
  const t = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  return `${base}-${code.toLowerCase()}-${t}`
}

function groupFor(code, sourceFile) {
  if (/^N\d/i.test(code)) return 'country-stacks'
  if (/^E\d/i.test(code)) return 'country-stacks'
  if (/^G\d/i.test(code)) return 'showcase'
  if (/^Q\d/i.test(code)) return 'demo'
  if (sourceFile.includes('show-e2e')) return 'showcase'
  return 'demo'
}

function hintFor(cypher) {
  const u = cypher.toUpperCase()
  if (u.includes(' MATCH P') || u.includes('= (') && u.includes('RETURN P')) return 'graph'
  if (/\bRETURN\b[\s\S]*\bAS\b/i.test(cypher) && !/\bRETURN\s+p/i.test(cypher)) return 'table'
  return 'auto'
}

export function loadQueryCatalog() {
  const files = [
    '06-queries-demo.cypher',
  ]
  const all = []
  for (const file of files) {
    const full = path.join(CYPHER_DIR, file)
    if (!fs.existsSync(full)) continue
    const text = fs.readFileSync(full, 'utf8')
    all.push(...parseCypherCatalog(text, file))
  }
  return all
}

export function catalogMeta(queries) {
  return queries.map(({ id, code, title, description, sourceFile, group, resultHint }) => ({
    id,
    code,
    title,
    description,
    sourceFile,
    group,
    resultHint,
  }))
}

export { CYPHER_DIR }
