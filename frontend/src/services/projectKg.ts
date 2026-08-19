import {
  buildStaticKgResult,
  mockCypherStub,
  staticKgCatalog,
} from '../lib/staticKgFallback'
import {
  buildPatternKgResult,
  mockPatternCypher,
  patternKgCatalog,
} from '../lib/patternKg'
import type { KgQueryMeta, KgRunResult } from '../lib/kgTypes'
import { resolveProjectId, type ProjectId } from '../data/projects'

export function projectKgCatalog(projectId: ProjectId) {
  return projectId === 'udp-pattern' ? patternKgCatalog() : staticKgCatalog()
}

export function projectMockCypher(projectId: ProjectId, meta: KgQueryMeta) {
  return projectId === 'udp-pattern' ? mockPatternCypher(meta) : mockCypherStub(meta)
}

export function buildProjectKgResult(
  projectId: ProjectId,
  opts: { meta?: KgQueryMeta | null; natco?: string; productId?: string },
): KgRunResult {
  if (projectId === 'udp-pattern') {
    return buildPatternKgResult({
      meta: opts.meta,
      marketplace: opts.natco,
      productId: opts.productId,
    })
  }
  return buildStaticKgResult({
    meta: opts.meta,
    natco: opts.natco,
    productId: opts.productId,
  })
}

export function kgProjectFromDemo(demoId?: string | null) {
  return resolveProjectId(demoId)
}
