import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createProject as createProjectApi,
  deleteProjectApi,
  fetchProjectCatalog,
  fetchProjectCoverage,
  fetchProjectGraph,
  fetchProjects,
  fetchProjectsHealth,
  isProjectDeletable,
  type ContractCatalog,
  type ProjectRegistryEntry,
} from '../services/projectsApi'
import {
  PROJECT_LIST,
  discoverLocalProjects,
  projectFromRegistry,
  type ProjectDef,
} from '../data/projects'
import dtContracts from '../../../mock-data/projects/udp-dt/derived/catalog.json'
import dtGraph from '../../../mock-data/projects/udp-dt/derived/knowledge-graph.json'
import dtCoverage from '../../../mock-data/projects/udp-dt/derived/coverage.json'
import patternContracts from '../../../mock-data/projects/udp-pattern/derived/catalog.json'
import patternGraph from '../../../mock-data/projects/udp-pattern/derived/knowledge-graph.json'
import patternCoverage from '../../../mock-data/projects/udp-pattern/derived/coverage.json'

type GraphData = typeof dtGraph
type CoverageData = typeof dtCoverage

const STATIC_CATALOG: Record<string, ContractCatalog> = {
  'udp-dt': dtContracts as ContractCatalog,
  'udp-pattern': patternContracts as ContractCatalog,
}

const STATIC_GRAPH: Record<string, GraphData> = {
  'udp-dt': dtGraph as GraphData,
  'udp-pattern': patternGraph as GraphData,
}

const STATIC_COVERAGE: Record<string, CoverageData> = {
  'udp-dt': dtCoverage as CoverageData,
  'udp-pattern': patternCoverage as CoverageData,
}

type ProjectRegistryContextValue = {
  apiAvailable: boolean
  loading: boolean
  projects: ProjectDef[]
  refreshProjects: () => Promise<void>
  createProject: (payload: Parameters<typeof createProjectApi>[0]) => Promise<ProjectDef>
  deleteProject: (projectId: string) => Promise<void>
  isProjectDeletable: (projectId: string) => boolean
  getCatalog: (projectId: string) => ContractCatalog
  getGraph: (projectId: string) => GraphData
  getCoverage: (projectId: string) => CoverageData
  reloadProjectData: (projectId: string) => Promise<void>
}

const ProjectRegistryContext = createContext<ProjectRegistryContextValue | null>(null)

const LOCAL_REGISTRY = discoverLocalProjects()

export function ProjectRegistryProvider({ children }: { children: ReactNode }) {
  const [apiAvailable, setApiAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [registry, setRegistry] = useState<ProjectRegistryEntry[]>([])
  const [catalogByProject, setCatalogByProject] = useState<Record<string, ContractCatalog>>(STATIC_CATALOG)
  const [graphByProject, setGraphByProject] = useState<Record<string, GraphData>>(STATIC_GRAPH)
  const [coverageByProject, setCoverageByProject] = useState<Record<string, CoverageData>>(STATIC_COVERAGE)

  const projects = useMemo(() => {
    const source = registry.length ? registry : LOCAL_REGISTRY
    const byId = new Map(source.map((r) => [r.id, projectFromRegistry(r)]))
    for (const p of PROJECT_LIST) {
      if (!byId.has(p.id)) byId.set(p.id, p)
    }
    return [...byId.values()].sort((a, b) => a.code.localeCompare(b.code))
  }, [registry])

  const reloadProjectData = useCallback(async (projectId: string) => {
    try {
      const [catalog, graph, coverage] = await Promise.all([
        fetchProjectCatalog(projectId),
        fetchProjectGraph(projectId),
        fetchProjectCoverage(projectId),
      ])
      setCatalogByProject((prev) => ({ ...prev, [projectId]: catalog }))
      setGraphByProject((prev) => ({ ...prev, [projectId]: graph as GraphData }))
      setCoverageByProject((prev) => ({ ...prev, [projectId]: coverage as CoverageData }))
    } catch {
      /* keep static fallback */
    }
  }, [])

  const refreshProjects = useCallback(async () => {
    const ok = await fetchProjectsHealth()
    setApiAvailable(ok)
    if (!ok) {
      setRegistry([])
      setLoading(false)
      return
    }
    try {
      const list = await fetchProjects()
      setRegistry(list)
      await Promise.all(list.map((p) => reloadProjectData(p.id)))
    } catch {
      setRegistry([])
    } finally {
      setLoading(false)
    }
  }, [reloadProjectData])

  useEffect(() => {
    void refreshProjects()
  }, [refreshProjects])

  const createProject = useCallback(
    async (payload: Parameters<typeof createProjectApi>[0]) => {
      const { project, catalog } = await createProjectApi(payload)
      setApiAvailable(true)
      setRegistry((prev) => [...prev.filter((p) => p.id !== project.id), project])
      setCatalogByProject((prev) => ({ ...prev, [project.id]: catalog }))
      await reloadProjectData(project.id)
      return projectFromRegistry(project)
    },
    [reloadProjectData],
  )

  const deleteProject = useCallback(async (projectId: string) => {
    await deleteProjectApi(projectId)
    setRegistry((prev) => prev.filter((p) => p.id !== projectId))
    setCatalogByProject((prev) => {
      const next = { ...prev }
      delete next[projectId]
      return next
    })
    setGraphByProject((prev) => {
      const next = { ...prev }
      delete next[projectId]
      return next
    })
    setCoverageByProject((prev) => {
      const next = { ...prev }
      delete next[projectId]
      return next
    })
  }, [])

  const checkDeletable = useCallback((projectId: string) => isProjectDeletable(projectId), [])

  const value = useMemo<ProjectRegistryContextValue>(
    () => ({
      apiAvailable,
      loading,
      projects,
      refreshProjects,
      createProject,
      deleteProject,
      isProjectDeletable: checkDeletable,
      getCatalog: (projectId) =>
        catalogByProject[projectId] ?? STATIC_CATALOG[projectId] ?? STATIC_CATALOG['udp-dt'],
      getGraph: (projectId) =>
        graphByProject[projectId] ?? STATIC_GRAPH[projectId] ?? STATIC_GRAPH['udp-dt'],
      getCoverage: (projectId) =>
        coverageByProject[projectId] ?? STATIC_COVERAGE[projectId] ?? STATIC_COVERAGE['udp-dt'],
      reloadProjectData,
    }),
    [
      apiAvailable,
      loading,
      projects,
      refreshProjects,
      createProject,
      deleteProject,
      checkDeletable,
      catalogByProject,
      graphByProject,
      coverageByProject,
      reloadProjectData,
    ],
  )

  return <ProjectRegistryContext.Provider value={value}>{children}</ProjectRegistryContext.Provider>
}

export function useProjectRegistry() {
  const ctx = useContext(ProjectRegistryContext)
  if (!ctx) throw new Error('useProjectRegistry must be used within ProjectRegistryProvider')
  return ctx
}

export function useProjectData(projectId: string) {
  const { getCatalog, getGraph, getCoverage, reloadProjectData, apiAvailable } = useProjectRegistry()
  useEffect(() => {
    if (apiAvailable) void reloadProjectData(projectId)
  }, [apiAvailable, projectId, reloadProjectData])
  return {
    catalog: getCatalog(projectId),
    graph: getGraph(projectId),
    coverage: getCoverage(projectId),
    reload: () => reloadProjectData(projectId),
  }
}
