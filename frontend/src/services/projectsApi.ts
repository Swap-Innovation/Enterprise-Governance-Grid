export type ProjectRegistryEntry = {
  id: string
  title?: string
  scopes?: string[]
  ui?: {
    code?: string
    name?: string
    workspace?: string
    tagline?: string
    description?: string
    footer?: string
  }
  stats?: {
    contracts: number
    scopes: number
    gaps: number
  }
  deletable?: boolean
}

export const PROTECTED_PROJECT_IDS = new Set(['udp-dt', 'udp-pattern'])

export function isProjectDeletable(projectId: string): boolean {
  return !PROTECTED_PROJECT_IDS.has(projectId)
}

/** Mirror backend deleteNamespace policy for UI affordances. */
export function isNamespaceDeletable(projectId: string, scopeId: string, allScopes: string[]): boolean {
  if (!scopeId) return false
  if (PROTECTED_PROJECT_IDS.has(projectId) && scopeId === 'global') return false
  if (!allScopes.includes(scopeId)) return false
  if (allScopes.length <= 1) return false
  return true
}

export type ContractCatalog = {
  meta: Record<string, unknown>
  contracts: Record<string, Record<string, unknown>>
}

export type NamespaceEntry = {
  id: string
  scope: string
  deletable: boolean
  path: string
}

const API_BASE = '/api/projects'

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchProjectsHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    return res.ok
  } catch {
    return false
  }
}

export async function fetchProjects(): Promise<ProjectRegistryEntry[]> {
  const data = await parseJson<{ projects: ProjectRegistryEntry[] }>(await fetch(API_BASE))
  return data.projects
}

export async function createProject(payload: {
  id: string
  title?: string
  code?: string
  workspace?: string
  tagline?: string
  description?: string
  scopes?: string[]
}): Promise<{ project: ProjectRegistryEntry; catalog: ContractCatalog }> {
  return parseJson(await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }))
}

export async function fetchProjectCatalog(projectId: string): Promise<ContractCatalog> {
  return parseJson(await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/catalog`))
}

export async function fetchProjectGraph(projectId: string) {
  return parseJson(await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/graph`))
}

export async function fetchProjectCoverage(projectId: string) {
  return parseJson(await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/coverage`))
}

export async function compileProjectApi(projectId: string) {
  return parseJson<{ ok: boolean; contracts: number; gaps: number }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/compile`, { method: 'POST' }),
  )
}

export async function upsertContractApi(
  projectId: string,
  contract: Record<string, unknown>,
): Promise<{ catalog: ContractCatalog; contract?: Record<string, unknown>; path?: string }> {
  return parseJson(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract }),
    }),
  )
}

export async function updateContractApi(
  projectId: string,
  contractId: string,
  contract: Record<string, unknown>,
): Promise<{ catalog: ContractCatalog; contract?: Record<string, unknown>; path?: string }> {
  return parseJson(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/contracts/${encodeURIComponent(contractId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract }),
    }),
  )
}

export async function createAssetContractApi(
  projectId: string,
  payload: {
    kind: string
    scope: string
    name?: string
    displayName?: string
    description?: string
    product_class?: string
  },
): Promise<{ contract: Record<string, unknown>; catalog: ContractCatalog }> {
  return parseJson(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteProjectApi(projectId: string) {
  return parseJson<{ deleted: string }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}`, { method: 'DELETE' }),
  )
}

export async function deleteContractApi(projectId: string, contractId: string) {
  return parseJson<{ catalog: ContractCatalog }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/contracts/${encodeURIComponent(contractId)}`, {
      method: 'DELETE',
    }),
  )
}

export async function fetchNamespacesApi(projectId: string) {
  return parseJson<{ namespaces: NamespaceEntry[] }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/namespaces`),
  )
}

export async function createNamespaceApi(
  projectId: string,
  payload: { id: string; name?: string; displayName?: string },
) {
  return parseJson<{ namespace: NamespaceEntry; catalog: ContractCatalog }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/namespaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteNamespaceApi(projectId: string, namespaceId: string) {
  return parseJson<{ deleted: string; catalog: ContractCatalog }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/namespaces/${encodeURIComponent(namespaceId)}`, {
      method: 'DELETE',
    }),
  )
}

export async function normalizeNamespacesApi(projectId: string) {
  return parseJson<{ ok: boolean; namespaces: string[]; contracts: number; gaps: number }>(
    await fetch(`${API_BASE}/${encodeURIComponent(projectId)}/namespaces/normalize`, {
      method: 'POST',
    }),
  )
}
