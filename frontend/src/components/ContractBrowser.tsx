import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { getProject } from '../data/projects'
import { getProjectContextGraph, getProjectContracts, getProjectCoverage } from '../data/projectAssets'
import { usePitchMode, type ContractPack } from '../pitch/PitchContext'

type ContractCatalog = ReturnType<typeof getProjectContracts>
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

function graphNodeForContract(
  graphData: ReturnType<typeof getProjectContextGraph>,
  contractId: string,
): string | null {
  const node = graphData.nodes.find((n) => n.contract_ref === contractId || n.id === contractId)
  return node?.id ?? null
}

function humanFields(c: Contract): { label: string; value: string }[] {
  const skip = new Set(['id', 'name', 'display_name', 'kind', 'natco', 'description'])
  const rows: { label: string; value: string }[] = []
  for (const [k, v] of Object.entries(c)) {
    if (skip.has(k) || v == null) continue
    if (typeof v === 'object') {
      rows.push({ label: k.replace(/_/g, ' '), value: JSON.stringify(v) })
    } else {
      rows.push({ label: k.replace(/_/g, ' '), value: String(v) })
    }
  }
  return rows
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
  const project = getProject(demoId)
  const contractsData = getProjectContracts(demoId)
  const graphData = getProjectContextGraph(demoId)
  const coverage = getProjectCoverage(demoId)
  const semanticsHref = `/demo/${project.slug}/semantics`
  const scopeLabels = Object.fromEntries(project.scopes.map((s) => [s.id, s.label])) as Record<string, string>

  const scopes = contractsData.meta.natcos
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const s of scopes) {
      init[s] = true
      for (const pack of PACKS) init[`${s}:${pack.id}`] = true
    }
    return init
  })
  const [showRaw, setShowRaw] = useState(false)

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
  }, [scopes])

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

  function renderItemButton(c: Contract, scope: string, pack: ContractPack) {
    return (
      <button
        type="button"
        onClick={() => selectContract(c, scope, pack)}
        className={`w-full truncate rounded-md px-2 py-1.5 text-left text-xs ${
          contractId === c.id
            ? 'bg-[var(--color-accent-soft)] font-semibold text-[var(--color-teal-dim)]'
            : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]'
        }`}
      >
        {c.display_name ?? c.name ?? c.id}
      </button>
    )
  }

  function renderKindSection(scope: string, pack: ContractPack, title: string, kinds: string[], defaultOpen = false) {
    const items = (byScope[scope]?.[pack] ?? []).filter((c) => kinds.includes(c.kind))
    const key = treeKey(['tree', scope, pack, title.toLowerCase().replace(/\s+/g, '-')])
    const open = expanded[key] ?? defaultOpen
    const sorted = sortContracts(items)
    return (
      <li key={key}>
        <button
          type="button"
          onClick={() => toggle(key)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]"
        >
          <span className="flex items-center gap-2">
            <span className="w-3 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
            <span>{title}</span>
          </span>
          <span className="text-[10px] text-[var(--color-slate)]">{items.length}</span>
        </button>
        {open ? (
          <ul className="mb-1 ml-2 space-y-0.5">
            {sorted.length ? (
              sorted.map((c) => <li key={c.id}>{renderItemButton(c, scope, pack)}</li>)
            ) : (
              <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
            )}
          </ul>
        ) : null}
      </li>
    )
  }

  function renderSemanticsTree(scope: string) {
    const items = byScope[scope]?.semantics ?? []
    if (!items.length) return <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
    const namespaces = sortContracts(items.filter((c) => c.kind === 'namespace'))
    const concepts = sortContracts(items.filter((c) => c.kind === 'semantic_concept'))
    const byId = new Map(items.map((c) => [c.id, c] as const))
    const used = new Set<string>()

    const conceptsForNs = (ns: Contract) => {
      const nsKeys = new Set(
        [ns.id, ns.name, ns.display_name, ns.qualified_name].filter((v): v is string => Boolean(v)),
      )
      const fromNs = linkIds(ns.links?.concepts).map((id) => byId.get(id)).filter((c): c is Contract => Boolean(c))
      const fromConcept = concepts.filter((c) => {
        const linked = linkIds(c.links?.namespace)
        if (linked.some((id) => nsKeys.has(id) || id === ns.id)) return true
        const raw = typeof (c as { namespace?: string }).namespace === 'string' ? (c as { namespace?: string }).namespace : ''
        return Boolean(raw && nsKeys.has(raw))
      })
      const merged = [...fromNs, ...fromConcept.filter((c) => !fromNs.some((x) => x.id === c.id))]
      for (const c of merged) used.add(c.id)
      return sortContracts(merged)
    }

    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {namespaces.map((ns) => {
          const key = treeKey(['tree', scope, 'semantics', ns.id])
          const open = expanded[key] ?? true
          const children = conceptsForNs(ns)
          return (
            <li key={ns.id}>
              <button
                type="button"
                onClick={() => {
                  toggle(key)
                  selectContract(ns, scope, 'semantics')
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-3 shrink-0 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
                  <span className="truncate">{ns.display_name ?? ns.name ?? ns.id}</span>
                </span>
                <span className="text-[10px] text-[var(--color-slate)]">{children.length}</span>
              </button>
              {open ? (
                <ul className="mb-1 ml-2 space-y-0.5">
                  {children.length ? (
                    children.map((c) => <li key={c.id}>{renderItemButton(c, scope, 'semantics')}</li>)
                  ) : (
                    <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
                  )}
                </ul>
              ) : null}
            </li>
          )
        })}
        {concepts.filter((c) => !used.has(c.id)).length ? (
          <li>
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-slate)]">
              Unlinked concepts
            </p>
            <ul className="space-y-0.5">
              {concepts.filter((c) => !used.has(c.id)).map((c) => (
                <li key={c.id}>{renderItemButton(c, scope, 'semantics')}</li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>
    )
  }

  function renderProductsTree(scope: string) {
    const items = byScope[scope]?.products ?? []
    if (!items.length) return <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
    const products = sortContracts(items.filter((c) => c.kind === 'data_product'))
    const contracts = sortContracts(items.filter((c) => c.kind === 'data_contract'))
    const byId = new Map(items.map((c) => [c.id, c] as const))
    const used = new Set<string>()

    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {products.map((p) => {
          const key = treeKey(['tree', scope, 'products', p.id])
          const open = expanded[key] ?? false
          const children = linkIds(p.links?.contracts)
            .map((id) => byId.get(id))
            .filter((c): c is Contract => Boolean(c))
          for (const c of children) used.add(c.id)
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  toggle(key)
                  selectContract(p, scope, 'products')
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-3 shrink-0 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
                  <span className="truncate">{p.display_name ?? p.name ?? p.id}</span>
                </span>
                <span className="text-[10px] text-[var(--color-slate)]">{children.length}</span>
              </button>
              {open ? (
                <ul className="mb-1 ml-2 space-y-0.5">
                  {children.length ? (
                    children.map((c) => <li key={c.id}>{renderItemButton(c, scope, 'products')}</li>)
                  ) : (
                    <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
                  )}
                </ul>
              ) : null}
            </li>
          )
        })}
        {contracts.filter((c) => !used.has(c.id)).map((c) => (
          <li key={c.id}>{renderItemButton(c, scope, 'products')}</li>
        ))}
      </ul>
    )
  }

  function renderBusinessTree(scope: string) {
    const items = byScope[scope]?.business ?? []
    if (!items.length) return <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
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
    const items = byScope[scope]?.technical ?? []
    if (!items.length) return <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
    return (
      <ul className="mb-1 ml-2 space-y-0.5">
        {renderKindSection(scope, 'technical', 'System', ['system'], true)}
        {renderKindSection(scope, 'technical', 'Database', ['database'])}
        {renderKindSection(scope, 'technical', 'Schema', ['schema'])}
        {renderKindSection(scope, 'technical', 'Table', ['table'])}
        {renderKindSection(scope, 'technical', 'Column', ['column'])}
        {renderKindSection(scope, 'technical', 'Other technical assets', ['technical_asset', 'pipeline', 'topic'])}
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
          <p className="border-b border-[var(--color-line)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
            Folders
          </p>
          {coverage?.summary ? (
            <p className="border-b border-[var(--color-line)] px-4 py-2 text-[11px] text-[var(--color-slate)]">
              Ossie coverage · {coverage.summary.ossie_datasets} datasets · {coverage.summary.gaps} gaps
              {coverage.summary.warnings ? ` · ${coverage.summary.warnings} warnings` : ''}
            </p>
          ) : null}
          <ul className="p-2">
            {scopes.map((scope) => {
              const open = expanded[scope] ?? activeScope === scope
              return (
                <li key={scope} className="mb-0.5">
                  <button
                    type="button"
                    onClick={() => toggle(scope)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold ${
                      activeScope === scope ? 'bg-[var(--color-paper-soft)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
                    }`}
                  >
                    <span className="w-3 text-[10px] text-[var(--color-slate)]">{open ? '▾' : '▸'}</span>
                    {scopeLabels[scope] ?? scope}
                  </button>
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
              <div className="flex-1 overflow-auto p-5">
                {showRaw ? (
                  <pre className="rounded-xl bg-[var(--color-paper-soft)] p-4 font-mono text-[11px] leading-relaxed text-[var(--color-ink-soft)]">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                ) : (
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[var(--color-line)] p-3 sm:col-span-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-slate)]">
                        Identifier
                      </dt>
                      <dd className="mt-1 font-mono text-xs text-[var(--color-ink)]">{selected.id}</dd>
                    </div>
                    {humanFields(selected).map((row) => (
                      <div key={row.label} className="rounded-xl border border-[var(--color-line)] p-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-slate)]">
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm text-[var(--color-ink)]">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
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
