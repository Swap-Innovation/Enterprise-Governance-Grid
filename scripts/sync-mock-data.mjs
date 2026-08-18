#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const copies = [
  ['contracts/examples/pitch/customer-context-graph.json', 'mock-data/relationships/customer-context-graph.json'],
  ['contracts/examples/scenarios/end-to-end-customer-flow.json', 'mock-data/scenarios/end-to-end-customer-flow.json'],
  ['contracts/examples/scenarios/multi-natco-customer.json', 'mock-data/scenarios/multi-natco-customer.json'],
  ['contracts/examples/scenarios/semantic-options/options-abc.json', 'mock-data/scenarios/options-abc.json'],
]

for (const [from, to] of copies) {
  const src = path.join(root, from)
  const dest = path.join(root, to)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  console.log(`synced ${to}`)
}
