import { Link, useParams } from 'react-router-dom'
import { useMemo, useState, type FormEvent } from 'react'
import { getProject, resolveProjectId } from '../data/projects'
import { useProjectData, useProjectRegistry } from '../context/ProjectRegistryContext'
import { usePitchMode, type ContractPack } from '../pitch/PitchContext'
import {
  createNamespaceApi,
  deleteNamespaceApi,
  createAssetContractApi,
  deleteContractApi,
  isNamespaceDeletable,
  type ContractCatalog,
} from '../services/projectsApi'
import { ContractDetailEditor, type EditableContract } from './ContractDetailEditor'
type Contract = ContractCatalog['contracts'][keyof ContractCatalog['contracts']] & {
  kind: string
  natco?: string
  id: string
  contract_id?: string
  name?: string
  display_name?: string
  qualified_name?: string
  description?: string
  owner?: string
  status?: string
  links?: Record<string, unknown>
  maps_to?: string[]
}

const PACKS: { id: ContractPack; label: string; kinds: string[] }[] = [
  { id: 'semantics', label: 'Semantics', kinds: ['namespace', 'semantic_concept', 'ossie_semantic_model'] },
  // Include full business catalog layer so business/technical neighborhoods align
  // with the semantics equivalents visible in the KG.
  { id: 'business', label: 'Business', kinds: ['business_term', 'data_domain', 'data_model', 'data_entity', 'data_attribute', 'data_concept'] },
  // Technical catalog layer (system stack + physical artifacts + pipelines).
  { id: 'technical', label: 'Technical', kinds: ['technical_asset', 'column', 'pipeline', 'topic', 'system', 'database', 'schema', 'table'] },
  { id: 'products', label: 'Data Products', kinds: ['data_product', 'data_contract'] },
]

function packForKind(kind: string): ContractPack | null {
  for (const p of PACKS) {
    if (p.kinds.includes(kind)) return p.id
  }
  return null
}

function packDirForKind(kind: string): string | null {
  if (['namespace', 'semantic_concept', 'ossie_semantic_model'].includes(kind)) return 'semantics'
  if (['business_term', 'data_domain', 'data_model', 'data_entity', 'data_attribute', 'data_concept', 'data_policy'].includes(kind)) {
    return 'business-catalogue'
  }
  if (['system', 'database', 'schema', 'table', 'column', 'pipeline', 'topic', 'technical_asset'].includes(kind)) {
    return 'technical-catalogue'
  }
  if (['data_product', 'data_contract', 'kpi'].includes(kind)) return 'data-products'
  return null
}

function assetFolderForKind(kind: string): string {
  const map: Record<string, string> = {
    namespace: 'Namespace',
    semantic_concept: 'Concept',
    ossie_semantic_model: 'Ossie Semantic Model',
    business_term: 'Business Term',
    data_domain: 'Data Domain',
    data_model: 'Data Model',
    data_entity: 'Data Entity',
    data_attribute: 'Data Attribute',
    data_concept: 'Data Concept',
    data_policy: 'Policy',
    system: 'System',
    database: 'Database',
    schema: 'Schema',
    table: 'Table',
    column: 'Column',
    pipeline: 'Pipeline',
    topic: 'Topic',
    technical_asset: 'Technology Asset',
    data_product: 'Data Product',
    data_contract: 'Data Contract',
    kpi: 'KPI',
  }
  return map[kind] ?? 'unclassified'
}

function backendPathForContract(projectId: string, c: Contract): string {
  const scope = c.natco ?? 'global'
  const pack = packDirForKind(c.kind) ?? 'unclassified'
  const folder = assetFolderForKind(c.kind)
  const file =
    typeof (c as { metadata?: { file?: string } }).metadata?.file === 'string'
      ? (c as { metadata: { file: string } }).metadata.file
      : `${c.id}.json`
  return `mock-data/projects/${projectId}/scopes/${scope}/${pack}/${folder}/${file}`
}

function graphNodeForContract(
  graphData: ReturnType<typeof useProjectData>['graph'],
  contractId: string,
): string | null {
  const node = graphData.nodes.find((n) => n.contract_ref === contractId || n.id === contractId)
  return node?.id ?? null
}

export function ContractBrowser() {
  const {
    contractId,
    setContractId,
    contractScope,
    setContractScope,
    contractPack,
    setContractPack,
    setGraphNodeId,
  } = usePitchMode()
  const { demoId = 'udp-dt' } = useParams()
  const projectId = resolveProjectId(demoId)
  const { projects, apiAvailable } = useProjectRegistry()
  const project = projects.find((p) => p.id === projectId) ?? getProject(demoId)
  const { catalog: contractsData, graph: graphData, coverage, reload } = useProjectData(projectId)
  const semanticsHref = `/demo/${project.slug}/semantics`
  const scopeLabels = Object.fromEntries(project.scopes.map((s) => [s.id, s.label])) as Record<string, string>

  // Folders = namespaces that exist for this project (kind: namespace), not every scope in project.json.
  const scopes = useMemo(() => {
    const ids = new Set<string>()
    for (const c of Object.values(contractsData.contracts) as unknown as Contract[]) {
      if (c.kind === 'namespace' && c.natco) ids.add(c.natco)
    }
    if (!ids.size) ids.add('global')
    return [...ids].sort((a, b) => {
      if (a === 'global') return -1
      if (b === 'global') return 1
      return a.localeCompare(b)
    })
  }, [contractsData.contracts])

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const s of ['global']) {
      init[s] = true
      for (const pack of PACKS) init[`${s}:${pack.id}`] = true
    }
    return init
  })
  const [showRaw, setShowRaw] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newNsId, setNewNsId] = useState('')
  const [newNsName, setNewNsName] = useState('')
  const [nsBusy, setNsBusy] = useState(false)
  const [nsError, setNsError] = useState<string | null>(null)
  const [assetBusyKey, setAssetBusyKey] = useState<string | null>(null)
  const [createAsset, setCreateAsset] = useState<{
    scope: string
    pack: ContractPack
    kind: string
    title: string
    productClass?: string
  } | null>(null)
  const [assetName, setAssetName] = useState('')
  const [assetError, setAssetError] = useState<string | null>(null)

  const treeKey = (parts: string[]) => parts.join('::')

  const coverageGaps = useMemo(() => {
    const rank = (s: string) => (s === 'error' ? 0 : s === 'warning' ? 1 : 2)
    return [...(coverage?.gaps ?? [])].sort((a, b) => rank(a.severity) - rank(b.severity))
  }, [coverage])

  const byScope = useMemo(() => {
    const map: Record<string, Record<ContractPack, Contract[]>> = {}
    for (const scope of scopes) {
      map[scope] = { semantics: [], business: [], technical: [], products: [] }
    }
    for (const c of Object.values(contractsData.contracts) as unknown as Contract[]) {
      const scope = c.natco ?? 'global'
      const pack = packForKind(c.kind)
      if (!pack) continue
      if (!map[scope]) map[scope] = { semantics: [], business: [], technical: [], products: [] }
      map[scope][pack].push(c)
    }
    for (const scope of Object.keys(map)) {
      for (const pack of PACKS) {
        map[scope][pack.id].sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id))
      }
    }
    return map
  }, [scopes, contractsData.contracts])

  async function handleCreateNamespace(e: FormEvent) {
    e.preventDefault()
    if (!apiAvailable) {
      setNsError('API unavailable. Run npm run dev')
      return
    }
    setNsBusy(true)
    setNsError(null)
    try {
      const created = await createNamespaceApi(projectId, {
        id: newNsId.trim(),
        displayName: newNsName.trim() || newNsId.trim(),
        name: newNsId.trim(),
      })
      setNewNsId('')
      setNewNsName('')
      setCreateOpen(false)
      setExpanded((prev) => ({
        ...prev,
        [created.namespace.scope]: true,
        [`${created.namespace.scope}:semantics`]: true,
      }))
      setContractScope(created.namespace.scope)
      await reload()
    } catch (err) {
      setNsError(err instanceof Error ? err.message : 'Failed to create namespace')
    } finally {
      setNsBusy(false)
    }
  }

  async function handleDeleteNamespace(scopeId: string) {
    if (!apiAvailable) {
      setNsError('API unavailable. Run npm run dev')
      return
    }
    if (!isNamespaceDeletable(projectId, scopeId, scopes)) {
      setNsError(
        scopes.length <= 1
          ? 'Cannot delete the last remaining namespace'
          : `Cannot delete namespace “${scopeId}”`,
      )
      return
    }
    if (
      !window.confirm(
        `Delete namespace “${scopeId}”? This removes scopes/${scopeId}/ (all pack scaffolds + contracts).`,
      )
    ) {
      return
    }
    setNsBusy(true)
    setNsError(null)
    try {
      await deleteNamespaceApi(projectId, scopeId)
      const remaining = scopes.filter((s) => s !== scopeId)
      if (contractScope === scopeId) setContractScope(remaining[0] ?? null)
      await reload()
    } catch (err) {
      setNsError(err instanceof Error ? err.message : 'Failed to delete namespace')
    } finally {
      setNsBusy(false)
    }
  }

  function isPrimaryNamespaceContract(c: Contract): boolean {
    if (c.kind !== 'namespace') return false
    const scope = c.natco ?? 'global'
    if (c.id === `ns-${scope}`) return true
    if (scope === 'global' && (c.id === 'ns-global' || c.id === `ns-${projectId}-global`)) return true
    if (c.name === scope) return true
    return false
  }

  async function handleCreateAsset(e: FormEvent) {
    e.preventDefault()
    if (!apiAvailable || !createAsset) {
      setAssetError('API unavailable. Run npm run dev')
      return
    }
    const draft = createAsset
    const name = assetName.trim()
    if (!name) {
      setAssetError('Name is required')
      return
    }
    const busyKey = treeKey([
      'tree',
      draft.scope,
      draft.pack,
      draft.title.toLowerCase().replace(/\s+/g, '-'),
    ])
    setAssetBusyKey(busyKey)
    setAssetError(null)
    try {
      const result = await createAssetContractApi(projectId, {
        kind: draft.kind,
        scope: draft.scope,
        name,
        displayName: name,
        product_class: draft.productClass,
      })
      const created = result.contract as Contract
      setCreateAsset(null)
      setAssetName('')
      setExpanded((prev) => ({
        ...prev,
        [draft.scope]: true,
        [`${draft.scope}:${draft.pack}`]: true,
        [busyKey]: true,
      }))
      await reload()
      selectContract(created, draft.scope, draft.pack)
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : 'Failed to create contract')
    } finally {
      setAssetBusyKey(null)
    }
  }

  async function handleDeleteContract(c: Contract) {
    if (!apiAvailable) {
      setNsError('API unavailable. Run npm run dev')
      return
    }
    const scope = c.natco ?? 'global'
    const label = c.display_name ?? c.name ?? c.id
    // Primary folder namespace → same delete path as folder ⌫ (including global when allowed)
    if (isPrimaryNamespaceContract(c)) {
      await handleDeleteNamespace(scope)
      return
    }
    if (!window.confirm(`Delete contract “${label}” (${c.id})? This removes the backend JSON file.`)) {
      return
    }
    setAssetBusyKey(`del:${c.id}`)
    setNsError(null)
    try {
      await deleteContractApi(projectId, c.id)
      if (contractId === c.id) setContractId(null)
      await reload()
    } catch (err) {
      setNsError(err instanceof Error ? err.message : 'Failed to delete contract')
    } finally {
      setAssetBusyKey(null)
    }
  }

  const selected = contractId
    ? (contractsData.contracts as unknown as Record<string, Contract>)[contractId]
    : null

  const activeScope = contractScope ?? 'global'
  const activePack = contractPack ?? 'semantics'

  function selectContract(c: Contract, scope: string, pack: ContractPack) {
    setContractId(c.id)
    setContractScope(scope)
    setContractPack(pack)
    const nodeId = graphNodeForContract(graphData, c.id) ?? graphNodeForContract(graphData, c.contract_id ?? '')
    if (nodeId) setGraphNodeId(nodeId)
    setShowRaw(false)
  }

  function toggle(key: string) {
    setExpanded((e) => ({ ...e, [key]: !e[key] }))
  }

  function sortContracts(items: Contract[]) {
    return [...items].sort((a, b) =>
      String(a.display_name ?? a.name ?? a.id).localeCompare(String(b.display_name ?? b.name ?? b.id)),
    )
  }

  function linkIds(value: unknown): string[] {
    if (typeof value === 'string' && value) return [value]
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string' && Boolean(v))
    return []
  }

  function openCreateAsset(
    scope: string,
    pack: ContractPack,
    kind: string,
    title: string,
    productClass?: string,
  ) {
    setCreateAsset({ scope, pack, kind, title, productClass })
    setAssetName('')
    setAssetError(null)
    setExpanded((e) => ({
      ...e,
      [scope]: true,
      [`${scope}:${pack}`]: true,
      [treeKey(['tree', scope, pack, title.toLowerCase().replace(/\s+/g, '-')])]: true,
    }))
  }

  function renderItemButton(c: Contract, scope: string, pack: ContractPack) {
    const canDeleteContract =
      apiAvailable &&
      !(isPrimaryNamespaceContract(c) && !isNamespaceDeletable(projectId, scope, scopes))
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => selectContract(c, scope, pack)}
          className={`min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-xs ${
            contractId === c.id
              ? 'bg-[var(--color-accent-soft)] font-semibold text-[var(--color-teal-dim)]'
              : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]'
          }`}
        >
          {c.display_name ?? c.name ?? c.id}
        </button>
        {canDeleteContract ? (
          <button
            type="button"
            title={`Delete ${c.display_name ?? c.id}`}
            aria-label={`Delete ${c.display_name ?? c.id}`}
            disabled={assetBusyKey === `del:${c.id}` || nsBusy}
            onClick={(ev) => {
              ev.stopPropagation()
              void handleDeleteContract(c)
            }}
            className="shrink-0 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            ⌫
          </button>
        ) : null}
      </div>
    )
  }

  function renderKindSection(
    scope: string,
    pack: ContractPack,
    title: string,
    kinds: string[],
    defaultOpen = false,
    filter?: (c: Contract) => boolean,
    productClass?: string,
  ) {
    const kind = kinds[0]
    const items = (byScope[scope]?.[pack] ?? []).filter(
      (c) => kinds.includes(c.kind) && (filter ? filter(c) : true),
    )
    const key = treeKey(['tree', scope, pack, title.toLowerCase().replace(/\s+/g, '-')])
    const open = expanded[key] ?? defaultOpen
    const sorted = sortContracts(items)
    const creatingHere =
      createAsset?.scope === scope &&
      createAsset.pack === pack &&
      createAsset.title === title
    const canCreate = apiAvailable && Boolean(kind)
    return (
      <li key={key}>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggle(key)}
            className="flex min-w-0 flex-1 items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="w-3 shrink-0 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
              <span className="truncate">{title}</span>
            </span>
            <span className="text-[10px] text-[var(--color-slate)]">{items.length}</span>
          </button>
          {canCreate ? (
            <button
              type="button"
              title={`Add ${title}`}
              aria-label={`Add ${title}`}
              disabled={assetBusyKey === key}
              onClick={(ev) => {
                ev.stopPropagation()
                openCreateAsset(scope, pack, kind, title, productClass)
              }}
              className="mr-1 shrink-0 rounded-md border border-[var(--color-line)] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-paper-soft)] disabled:opacity-50"
            >
              +
            </button>
          ) : null}
        </div>
        {open ? (
          <ul className="mb-1 ml-2 space-y-0.5">
            {creatingHere ? (
              <li className="rounded-md border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-2">
                <form className="space-y-1.5" onSubmit={(e) => void handleCreateAsset(e)}>
                  <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-slate)]">
                    New {title}
                  </label>
                  <input
                    autoFocus
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder={`${title} name`}
                    className="w-full rounded-md border border-[var(--color-line)] bg-white px-2 py-1 text-xs"
                  />
                  {assetError ? <p className="text-[10px] text-red-600">{assetError}</p> : null}
                  <div className="flex gap-1.5">
                    <button
                      type="submit"
                      disabled={assetBusyKey === key}
                      className="rounded-md bg-[var(--color-ink)] px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-50"
                    >
                      {assetBusyKey === key ? 'Creating…' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateAsset(null)
                        setAssetName('')
                        setAssetError(null)
                      }}
                      className="rounded-md border border-[var(--color-line)] px-2 py-1 text-[10px] text-[var(--color-slate)]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </li>
            ) : null}
            {sorted.length ? (
              sorted.map((c) => <li key={c.id}>{renderItemButton(c, scope, pack)}</li>)
            ) : !creatingHere ? (
              <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
            ) : null}
          </ul>
        ) : null}
      </li>
    )
  }

  function renderSemanticsTree(scope: string) {
    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {renderKindSection(scope, 'semantics', 'Namespace', ['namespace'], true)}
        {renderKindSection(scope, 'semantics', 'Concept', ['semantic_concept'])}
        {renderKindSection(scope, 'semantics', 'Ossie Semantic Model', ['ossie_semantic_model'])}
      </ul>
    )
  }

  function renderProductsTree(scope: string) {
    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {renderKindSection(
          scope,
          'products',
          'SDP',
          ['data_product'],
          true,
          (c) => String((c as { product_class?: string }).product_class ?? '').toUpperCase() === 'SDP',
          'SDP',
        )}
        {renderKindSection(
          scope,
          'products',
          'ADP',
          ['data_product'],
          false,
          (c) => String((c as { product_class?: string }).product_class ?? '').toUpperCase() === 'ADP',
          'ADP',
        )}
        {renderKindSection(
          scope,
          'products',
          'CDP',
          ['data_product'],
          false,
          (c) => String((c as { product_class?: string }).product_class ?? '').toUpperCase() === 'CDP',
          'CDP',
        )}
        {renderKindSection(
          scope,
          'products',
          'Other products',
          ['data_product'],
          false,
          (c) => !(c as { product_class?: string }).product_class,
        )}
        {renderKindSection(scope, 'products', 'Data Contract', ['data_contract'])}
      </ul>
    )
  }

  function renderBusinessTree(scope: string) {
    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {renderKindSection(scope, 'business', 'Data Domain', ['data_domain'], true)}
        {renderKindSection(scope, 'business', 'Data Model', ['data_model'])}
        {renderKindSection(scope, 'business', 'Data Entity', ['data_entity'])}
        {renderKindSection(scope, 'business', 'Data Attribute', ['data_attribute'])}
        {renderKindSection(scope, 'business', 'Data Concept', ['data_concept'])}
        {renderKindSection(scope, 'business', 'Business Term', ['business_term'])}
      </ul>
    )
  }

  function renderTechnicalTree(scope: string) {
    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {renderKindSection(scope, 'technical', 'System', ['system'], true)}
        {renderKindSection(scope, 'technical', 'Database', ['database'])}
        {renderKindSection(scope, 'technical', 'Schema', ['schema'])}
        {renderKindSection(scope, 'technical', 'Table', ['table'])}
        {renderKindSection(scope, 'technical', 'Column', ['column'])}
        {renderKindSection(scope, 'technical', 'Pipeline', ['pipeline'])}
        {renderKindSection(scope, 'technical', 'Topic', ['topic'])}
        {renderKindSection(scope, 'technical', 'Technical Asset', ['technical_asset'])}
      </ul>
    )
  }

  return (
    <div id="contracts" className="panel-card overflow-hidden">
      <div className="flex flex-wrap gap-1.5 border-b border-[var(--color-line)] bg-[var(--color-paper-soft)] px-4 py-3">
        {scopes.map((scope) => (
          <button
            key={scope}
            type="button"
            onClick={() => {
              setContractScope(scope)
              setExpanded((e) => ({ ...e, [scope]: true, [`${scope}:semantics`]: true }))
              const first = byScope[scope]?.semantics[0] ?? byScope[scope]?.technical[0]
              if (first) selectContract(first, scope, packForKind(first.kind) ?? 'semantics')
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeScope === scope
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-white text-[var(--color-slate)] hover:text-[var(--color-ink)]'
            }`}
          >
            {scopeLabels[scope] ?? scope}
          </button>
        ))}
      </div>

      <div className="grid min-h-[520px] lg:grid-cols-[280px_1fr]">
        <div className="max-h-[70vh] overflow-y-auto border-b border-[var(--color-line)] bg-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--color-line)] px-4 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
              Folders
            </p>
            {apiAvailable ? (
              <button
                type="button"
                onClick={() => {
                  setCreateOpen((v) => !v)
                  setNsError(null)
                }}
                className="rounded-md bg-[var(--color-ink)] px-2 py-1 text-[10px] font-semibold text-white"
              >
                + Namespace
              </button>
            ) : null}
          </div>
          {createOpen ? (
            <form onSubmit={handleCreateNamespace} className="space-y-2 border-b border-[var(--color-line)] px-3 py-3">
              <p className="text-[10px] text-[var(--color-slate)]">
                Creates <code className="font-mono">scopes/&lt;id&gt;/</code> with per-asset folders + empty contract JSON (incl. Apache Ossie package).
              </p>
              <input
                required
                value={newNsId}
                onChange={(e) => setNewNsId(e.target.value)}
                placeholder="natco-es"
                className="w-full rounded-md border border-[var(--color-line)] px-2 py-1.5 text-xs"
              />
              <input
                value={newNsName}
                onChange={(e) => setNewNsName(e.target.value)}
                placeholder="Spain"
                className="w-full rounded-md border border-[var(--color-line)] px-2 py-1.5 text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="btn-ghost flex-1 px-2 py-1.5 text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={nsBusy}
                  className="btn-accent flex-1 px-2 py-1.5 text-[11px] disabled:opacity-50"
                >
                  {nsBusy ? 'Creating…' : 'Create'}
                </button>
              </div>
              {nsError ? <p className="text-[11px] text-red-600">{nsError}</p> : null}
            </form>
          ) : null}
          {coverage?.summary ? (
            <div className="flex items-center justify-between gap-2 border-b border-[var(--color-line)] px-4 py-2 text-[11px] text-[var(--color-slate)]">
              <p>
                Ossie coverage · {coverage.summary.ossie_datasets} datasets · {coverage.summary.gaps} gaps
                {coverage.summary.warnings ? ` · ${coverage.summary.warnings} warnings` : ''}
              </p>
              {apiAvailable ? (
                <button type="button" onClick={() => void reload()} className="tool-btn px-2 py-0.5 text-[10px]">
                  Refresh
                </button>
              ) : null}
            </div>
          ) : null}
          {nsError && !createOpen ? <p className="border-b border-[var(--color-line)] px-4 py-2 text-[11px] text-red-600">{nsError}</p> : null}
          <ul className="p-2">
            {scopes.map((scope) => {
              const open = expanded[scope] ?? activeScope === scope
              const canDelete = apiAvailable && isNamespaceDeletable(projectId, scope, scopes)
              return (
                <li key={scope} className="mb-0.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggle(scope)}
                      className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold ${
                        activeScope === scope ? 'bg-[var(--color-paper-soft)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
                      }`}
                    >
                      <span className="w-3 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
                      <span className="truncate">{scopeLabels[scope] ?? scope}</span>
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        title={`Delete namespace ${scope}`}
                        aria-label={`Delete namespace ${scope}`}
                        disabled={nsBusy}
                        onClick={() => void handleDeleteNamespace(scope)}
                        className="mr-1 shrink-0 rounded-md border border-red-200 bg-red-50 px-1.5 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        ⌫
                      </button>
                    ) : null}
                  </div>
                  {open ? (
                    <ul className="mb-2 ml-2 border-l border-[var(--color-line)] pl-2">
                      {PACKS.map((pack) => {
                        const items = byScope[scope]?.[pack.id] ?? []
                        const packKey = `${scope}:${pack.id}`
                        const packOpen =
                          expanded[packKey] ?? (activeScope === scope && activePack === pack.id)
                        return (
                          <li key={pack.id} className="mb-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setExpanded((e) => ({ ...e, [packKey]: !packOpen }))
                                setContractScope(scope)
                                setContractPack(pack.id)
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs ${
                                activeScope === scope && activePack === pack.id
                                  ? 'font-semibold text-[var(--color-ink)]'
                                  : 'text-[var(--color-slate)] hover:text-[var(--color-ink)]'
                              }`}
                            >
                              <span>
                                <span className="mr-1 font-mono text-[10px]">{packOpen ? '▾' : '▸'}</span>
                                {pack.label}
                              </span>
                              <span className="text-[10px] text-[var(--color-slate)]">{items.length}</span>
                            </button>
                            {packOpen
                              ? pack.id === 'semantics'
                                ? renderSemanticsTree(scope)
                                : pack.id === 'business'
                                  ? renderBusinessTree(scope)
                                  : pack.id === 'technical'
                                    ? renderTechnicalTree(scope)
                                    : renderProductsTree(scope)
                              : null}
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex max-h-[70vh] flex-col bg-white">
          {selected ? (
            <>
              <div className="border-b border-[var(--color-line)] px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
                  {scopeLabels[selected.natco ?? 'global'] ?? selected.natco} · {selected.kind.replace(/_/g, ' ')}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {selected.display_name ?? selected.name ?? selected.id}
                </h3>
                {selected.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">{selected.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {graphNodeForContract(graphData, selected.id) ? (
                    <Link
                      to={semanticsHref}
                      onClick={() => {
                        const n = graphNodeForContract(graphData, selected.id)
                        if (n) setGraphNodeId(n)
                      }}
                      className="btn-accent px-3.5 py-1.5 text-xs"
                    >
                      Open in knowledge graph
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowRaw((v) => !v)}
                    className="btn-ghost px-3 py-1.5 text-xs"
                  >
                    {showRaw ? 'Hide raw JSON' : 'View raw JSON'}
                  </button>
                </div>
              </div>
              {showRaw ? (
                <div className="flex-1 overflow-auto p-5">
                  <pre className="rounded-xl bg-[var(--color-paper-soft)] p-4 font-mono text-[11px] leading-relaxed text-[var(--color-ink-soft)]">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                </div>
              ) : (
                <ContractDetailEditor
                  key={selected.id}
                  projectId={projectId}
                  contract={selected as unknown as EditableContract}
                  backendPath={backendPathForContract(projectId, selected)}
                  apiAvailable={apiAvailable}
                  onSaved={reload}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col gap-4 overflow-auto p-8 text-sm text-[var(--color-slate)]">
              <p>Select a folder and contract to inspect its definition.</p>
              {coverageGaps.length ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">Missing details</p>
                  <ul className="mt-2 max-h-[50vh] space-y-1.5 overflow-auto text-xs">
                    {coverageGaps.slice(0, 24).map((gap) => (
                      <li key={`${gap.code}:${gap.id}`} className="rounded-lg border border-[var(--color-line)] px-3 py-2">
                        <span className="font-mono text-[10px] text-[var(--color-ink)]">{gap.code}</span>
                        <span className="mt-0.5 block">{gap.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
