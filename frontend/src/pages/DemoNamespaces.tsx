import { useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { DemoPageHeader } from '../components/DemoPageHeader'
import { resolveProjectId } from '../data/projects'
import { useProjectData, useProjectRegistry } from '../context/ProjectRegistryContext'
import {
  createNamespaceApi,
  deleteNamespaceApi,
  fetchNamespacesApi,
  normalizeNamespacesApi,
  isNamespaceDeletable,
  type NamespaceEntry,
} from '../services/projectsApi'

const STANDARD_PACKS = ['Semantic Plane', 'Data Products', 'Business Catalogue', 'Technical Catalogue']

export function DemoNamespaces() {
  const { demoId = 'udp-dt' } = useParams()
  const projectId = resolveProjectId(demoId)
  const { projects, apiAvailable, reloadProjectData } = useProjectRegistry()
  const { catalog } = useProjectData(projectId)
  const project = projects.find((p) => p.id === projectId) ?? projects[0]
  const [namespaceId, setNamespaceId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverNamespaces, setServerNamespaces] = useState<NamespaceEntry[] | null>(null)

  const namespaceIdsFromCatalog = useMemo(() => {
    const ids = new Set<string>()
    for (const contract of Object.values(catalog.contracts)) {
      if ((contract as { kind?: string }).kind === 'namespace') {
        const natco = (contract as { natco?: string }).natco
        if (natco) ids.add(natco)
      }
    }
    return [...ids].sort()
  }, [catalog.contracts])

  const namespaces = serverNamespaces?.length
    ? serverNamespaces
    : namespaceIdsFromCatalog.map((id) => ({
        id,
        scope: id,
        deletable: isNamespaceDeletable(projectId, id, namespaceIdsFromCatalog),
        path: `mock-data/projects/${projectId}/scopes/${id}`,
      }))

  async function refreshNamespaces() {
    if (!apiAvailable) return
    const res = await fetchNamespacesApi(projectId)
    setServerNamespaces(res.namespaces)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!apiAvailable) {
      setError('API unavailable. Run npm run dev')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await createNamespaceApi(projectId, { id: namespaceId, displayName, name: namespaceId })
      setNamespaceId('')
      setDisplayName('')
      await Promise.all([reloadProjectData(projectId), refreshNamespaces()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create namespace')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(scopeId: string) {
    if (!apiAvailable) {
      setError('API unavailable. Run npm run dev')
      return
    }
    const all = namespaces.map((n) => n.scope)
    if (!isNamespaceDeletable(projectId, scopeId, all)) {
      setError(
        all.length <= 1
          ? 'Cannot delete the last remaining namespace'
          : `Cannot delete namespace “${scopeId}”`,
      )
      return
    }
    if (!window.confirm(`Delete namespace “${scopeId}”? This removes scopes/${scopeId}/.`)) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      await deleteNamespaceApi(projectId, scopeId)
      await Promise.all([reloadProjectData(projectId), refreshNamespaces()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete namespace')
    } finally {
      setBusy(false)
    }
  }

  async function handleNormalize() {
    if (!apiAvailable) {
      setError('API unavailable. Run npm run dev')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await normalizeNamespacesApi(projectId)
      await Promise.all([reloadProjectData(projectId), refreshNamespaces()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to normalize structure')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <DemoPageHeader
        eyebrow="Project hierarchy"
        title={`${project.name} namespaces`}
        lead="Create or delete scope namespaces under mock-data/projects/<project>/scopes. Each namespace gets a standard structure: Semantic Plane, Data Products, Business Catalogue, and Technical Catalogue."
      />

      <section className="panel-card p-5">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Create namespace</h2>
        <form onSubmit={handleCreate} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={namespaceId}
            onChange={(e) => setNamespaceId(e.target.value)}
            placeholder="natco-es"
            required
            className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Spain"
            className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <button type="submit" disabled={busy} className="btn-accent px-4 py-2 text-xs disabled:opacity-50">
            {busy ? 'Creating…' : 'Create namespace'}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {STANDARD_PACKS.map((p) => (
            <span key={p} className="rounded-full bg-[var(--color-paper-soft)] px-3 py-1 text-[11px] text-[var(--color-slate)]">
              {p}
            </span>
          ))}
          <button
            type="button"
            onClick={() => void handleNormalize()}
            disabled={busy}
            className="btn-ghost ml-auto px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Normalize current structure
          </button>
        </div>
        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
      </section>

      <section className="panel-card mt-4 p-5">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Existing namespaces</h2>
        <ul className="mt-3 space-y-2">
          {namespaces.map((ns) => (
            <li key={ns.id} className="flex items-center justify-between rounded-lg border border-[var(--color-line)] px-3 py-2">
              <div>
                <p className="font-mono text-xs text-[var(--color-ink)]">{ns.scope}</p>
                <p className="text-[11px] text-[var(--color-slate)]">{ns.path}</p>
              </div>
              {ns.deletable ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleDelete(ns.scope)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                >
                  Delete
                </button>
              ) : (
                <span className="text-[11px] text-[var(--color-slate)]">not deletable</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
