import dtContracts from '../../../mock-data/projects/udp-dt/derived/catalog.json'
import dtGraph from '../../../mock-data/projects/udp-dt/derived/knowledge-graph.json'
import dtCoverage from '../../../mock-data/projects/udp-dt/derived/coverage.json'
import patternContracts from '../../../mock-data/projects/udp-pattern/derived/catalog.json'
import patternGraph from '../../../mock-data/projects/udp-pattern/derived/knowledge-graph.json'
import patternCoverage from '../../../mock-data/projects/udp-pattern/derived/coverage.json'
import { resolveProjectId, type ProjectId } from './projects'

export function getProjectContracts(demoId?: string | null) {
  return resolveProjectId(demoId) === 'udp-pattern' ? patternContracts : dtContracts
}

export function getProjectContextGraph(demoId?: string | null) {
  return resolveProjectId(demoId) === 'udp-pattern' ? patternGraph : dtGraph
}

export function getProjectCoverage(demoId?: string | null) {
  return resolveProjectId(demoId) === 'udp-pattern' ? patternCoverage : dtCoverage
}

export function projectIdOf(demoId?: string | null): ProjectId {
  return resolveProjectId(demoId)
}
