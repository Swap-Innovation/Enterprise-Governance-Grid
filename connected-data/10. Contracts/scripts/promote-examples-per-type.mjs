#!/usr/bin/env node
/**
 * Promote pack examples into per-type example.json (+ Type/examples/*).
 * Writes thin examples/index.json (refs only).
 * Project standard: each asset type package owns its instance SoR.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const PACKS = ['Business Catalog', 'Technical Catalog', 'Data Products', 'Semantic Control Plane']

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
}

function isStub(ex) {
  if (!ex || typeof ex !== 'object') return true
  const id = String(ex.id ?? '')
  if (id.startsWith('asset-example-') || id.startsWith('example-')) return true
  if (String(ex.name ?? '').startsWith('example-')) return true
  if (String(ex.display_name ?? '').startsWith('Example ')) return true
  return false
}

function slugFromAsset(a) {
  const raw = a.id || a.name || a.display_name || 'extra'
  return String(raw)
    .replace(/^asset-/, '')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function folderFor(packRoot, assetType) {
  const direct = path.join(packRoot, assetType)
  if (fs.existsSync(path.join(direct, 'contract.json'))) return direct
  // case-insensitive fallback
  for (const ent of fs.readdirSync(packRoot, { withFileTypes: true })) {
    if (ent.isDirectory() && ent.name.toLowerCase() === String(assetType).toLowerCase()) {
      return path.join(packRoot, ent.name)
    }
  }
  return null
}

const report = []

for (const pack of PACKS) {
  const packRoot = path.join(ROOT, pack)
  const samplePath = path.join(packRoot, 'examples', 'index.json')
  const legacySample = path.join(packRoot, 'examples', 'sample-assets.json')
  const sourcePath = fs.existsSync(legacySample) ? legacySample : samplePath
  if (!fs.existsSync(sourcePath)) {
    report.push({ pack, skipped: 'no examples/index.json or sample-assets.json' })
    continue
  }
  const sample = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  const assets = (sample.assets ?? []).filter((a) => a && a.asset_type && !a.ref)
  if (assets.length === 0) {
    report.push({ pack, skipped: 'index already refs-only' })
    continue
  }
  const byType = new Map()
  for (const a of assets) {
    const t = a.asset_type
    if (!t) continue
    if (!byType.has(t)) byType.set(t, [])
    byType.get(t).push(a)
  }

  const moved = []
  for (const [assetType, list] of byType) {
    const folder = folderFor(packRoot, assetType)
    if (!folder) {
      moved.push({ assetType, error: 'no type folder' })
      continue
    }
    const primaryPath = path.join(folder, 'example.json')
    const existing = fs.existsSync(primaryPath) ? JSON.parse(fs.readFileSync(primaryPath, 'utf8')) : null

    // Prefer sample asset that matches existing id, else first sample
    let primary = list[0]
    if (existing && !isStub(existing)) {
      const match = list.find((a) => a.id === existing.id)
      if (match) primary = match
      // keep existing if richer than stub and not in sample? still overwrite from sample (KG SoR)
    }

    writeJson(primaryPath, primary)
    moved.push({ assetType, primary: primary.id, path: path.relative(packRoot, primaryPath) })

    const extras = list.filter((a) => a.id !== primary.id)
    for (const extra of extras) {
      const extraDir = path.join(folder, 'examples')
      const extraPath = path.join(extraDir, `${slugFromAsset(extra)}.json`)
      writeJson(extraPath, extra)
      moved.push({ assetType, extra: extra.id, path: path.relative(packRoot, extraPath) })
    }
  }

  // Write thin index replacing bulky duplicate semantics
  const index = {
    meta: {
      title: `${pack} — example instance index`,
      hierarchy_contract: sample.meta?.hierarchy_contract,
      documentation_standard: sample.meta?.documentation_standard,
      note: 'SoR is per-type example.json (+ Type/examples/*.json). This file is a generated index only.',
      generated: new Date().toISOString().slice(0, 10),
      version: '2.0.0',
    },
    assets: assets.map((a) => {
      const folder = folderFor(packRoot, a.asset_type)
      const primaryPath = folder ? path.join(folder, 'example.json') : null
      let ref = primaryPath ? `${a.asset_type}/example.json` : null
      if (primaryPath && fs.existsSync(primaryPath)) {
        const p = JSON.parse(fs.readFileSync(primaryPath, 'utf8'))
        if (p.id !== a.id) ref = `${a.asset_type}/examples/${slugFromAsset(a)}.json`
      }
      return { id: a.id, asset_type: a.asset_type, kind: a.kind, ref }
    }),
  }
  writeJson(samplePath, index)
  report.push({ pack, assets: assets.length, moved: moved.length })
}

console.log(JSON.stringify(report, null, 2))
