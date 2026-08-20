#!/usr/bin/env node
/**
 * Shard project catalogs into mock-data/projects/{id}/scopes and compile
 * derived catalog + knowledge graph + coverage.
 *
 *   node scripts/compile-project-mock.mjs              # migrate if needed, then compile
 *   node scripts/compile-project-mock.mjs --migrate     # rewrite shards from legacy blobs
 *   node scripts/compile-project-mock.mjs --compile-only
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compileProject,
  loadLegacyCatalog,
  projectDir,
  seedOssiePackage,
  writeAuthoredProject,
  mirrorCompiled,
  listProjectIds,
} from './lib/project-mock-layout.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const forceMigrate = args.has('--migrate')
const compileOnly = args.has('--compile-only')
const projectIds = listProjectIds().length ? listProjectIds() : ['udp-dt', 'udp-pattern']

function scopesNeedMigrate(projectId) {
  const scopes = path.join(projectDir(projectId), 'scopes')
  if (!fs.existsSync(scopes)) return true
  const hasShard = fs.readdirSync(scopes, { withFileTypes: true }).some((e) => e.isDirectory())
  const hasNamespaces = fs.existsSync(path.join(scopes, 'global/semantics/namespaces.json'))
  return !hasShard || !hasNamespaces
}

for (const projectId of projectIds) {
  const shouldMigrate = !compileOnly && (forceMigrate || scopesNeedMigrate(projectId))
  if (shouldMigrate) {
    const { catalog, graph, catalogFile } = loadLegacyCatalog(projectId)
    console.log(`==> shard ${projectId} from ${path.relative(root, catalogFile)}`)
    writeAuthoredProject(projectId, {
      meta: catalog.meta,
      contracts: catalog.contracts,
      graph,
      preserveOssie: true,
    })
    seedOssiePackage(projectId)
  } else {
    seedOssiePackage(projectId)
  }

  const { catalog, graph, coverage } = compileProject(projectId)
  const mirrored = mirrorCompiled(projectId, { catalog, graph })
  console.log(`==> compiled ${projectId}`)
  console.log(`   contracts: ${Object.keys(catalog.contracts).length}`)
  console.log(`   graph: ${graph.nodes?.length ?? 0} nodes / ${graph.edges?.length ?? 0} edges`)
  console.log(`   coverage: ${coverage.summary.gaps} gaps (${coverage.summary.warnings} warnings)`)
  console.log(`   mirrors: ${mirrored.join(', ')}`)
}
