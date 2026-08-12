#!/usr/bin/env node
/**
 * Regenerate docs/strategic-questions/SQ*.md from the demo JSON source of truth.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const jsonPath = path.join(ROOT, 'enterprise-governance-grid/src/data/strategic-questions.json')
const outDir = path.join(ROOT, 'docs/strategic-questions')

const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

const fileFor = {
  SQ1: 'SQ01-semantic-layer-definition.md',
  SQ2: 'SQ02-registry-sor.md',
  SQ3: 'SQ03-experience-blueprint.md',
  SQ4: 'SQ04-governance-and-conflict.md',
  SQ5: 'SQ05-lifecycle-versioning.md',
  SQ6: 'SQ06-canonisation.md',
  SQ7: 'SQ07-consumers.md',
  SQ8: 'SQ08-binding-cost.md',
  SQ9: 'SQ09-drift-detection.md',
  SQ10: 'SQ10-stewardship-ops.md',
  SQ11: 'SQ11-ossie-portability.md',
  SQ12: 'SQ12-strategy-amendments.md',
}

function md(q) {
  const lines = []
  lines.push(`# ${q.code} — ${q.title}`)
  lines.push('')
  lines.push('| Field | Value |')
  lines.push('| --- | --- |')
  lines.push(`| Status | ${q.status} |`)
  lines.push(`| Decision | ${q.decisionGate} |`)
  lines.push(`| Owner | ${q.owner} |`)
  lines.push(`| Demo | [/demo/customer360/questions?q=${q.code}](../../enterprise-governance-grid/) (Strategic Qs page) |`)
  lines.push('')
  lines.push('## The question')
  lines.push('')
  lines.push(q.question)
  lines.push('')
  lines.push('## Why it matters')
  lines.push('')
  lines.push(q.whyItMatters)
  lines.push('')
  lines.push('## POC recommendation')
  lines.push('')
  lines.push(q.recommendation)
  lines.push('')
  lines.push('## In scope')
  lines.push('')
  for (const i of q.isIn) lines.push(`- ${i}`)
  lines.push('')
  lines.push('## Out of scope')
  lines.push('')
  for (const i of q.isOut) lines.push(`- ${i}`)
  lines.push('')
  for (const sec of q.detailSections ?? []) {
    lines.push(`## ${sec.heading}`)
    lines.push('')
    for (const p of sec.paragraphs ?? []) {
      lines.push(p)
      lines.push('')
    }
    if (sec.bullets?.length) {
      for (const b of sec.bullets) lines.push(`- ${b}`)
      lines.push('')
    }
  }
  lines.push('## Evidence')
  lines.push('')
  for (const e of q.evidence) lines.push(`- ${e}`)
  lines.push('')
  lines.push('## Deliverable')
  lines.push('')
  lines.push(q.deliverable)
  lines.push('')
  lines.push('## Try in the demo')
  lines.push('')
  for (const p of q.pocProof) {
    lines.push(`- **${p.label}** → \`/demo/customer360/${p.href}\``)
  }
  lines.push('')
  lines.push('## Residual (workstreams)')
  lines.push('')
  lines.push(q.residual)
  lines.push('')
  lines.push('## Related')
  lines.push('')
  lines.push('- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)')
  lines.push('- Interactive board: demo route `questions`')
  lines.push('')
  return lines.join('\n')
}

for (const q of questions) {
  const name = fileFor[q.code]
  if (!name) continue
  fs.writeFileSync(path.join(outDir, name), md(q))
  console.log('wrote', name)
}

console.log('done', questions.length)
