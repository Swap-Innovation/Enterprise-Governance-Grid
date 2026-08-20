#!/usr/bin/env node
/**
 * Legacy sync helper — most demo data now lives under mock-data/projects/{id}/.
 * Remaining copies are pitch/scenario docs only.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const copies = [
  ['contracts/examples/scenarios/end-to-end-customer-flow.json', 'mock-data/projects/udp-dt/scenarios/end-to-end-customer-flow.json'],
  ['contracts/examples/scenarios/multi-natco-customer.json', 'mock-data/projects/udp-dt/scenarios/multi-natco-customer.json'],
  ['contracts/examples/scenarios/semantic-options/options-abc.json', 'mock-data/projects/udp-dt/scenarios/options-abc.json'],
]

for (const [from, to] of copies) {
  const src = path.join(root, from)
  const dest = path.join(root, to)
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${from}`)
    continue
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  console.log(`synced ${to}`)
}
