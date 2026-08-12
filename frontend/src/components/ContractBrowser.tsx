import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import contractsData from '../data/examples/customer-contracts.json'
import graphData from '../data/examples/customer-context-graph.json'
import { usePitchMode, type ContractPack } from '../pitch/PitchContext'

type Contract = (typeof contractsData.contracts)[keyof typeof contractsData.contracts] & {
  kind: string
  natco?: string
  id: string
  name?: string
  display_name?: string
  description?: string
  owner?: string
  status?: string
}

const PACKS: { id: ContractPack; label: string; kinds: string[] }[] = [
  { id: 'semantics', label: 'Semantics', kinds: ['namespace', 'semantic_concept'] },
  { id: 'business', label: 'Business', kinds: ['business_term'] },
  { id: 'technical', label: 'Technical', kinds: ['technical_asset', 'column', 'pipeline', 'topic'] },
  { id: 'products', label: 'Data Products', kinds: ['data_product', 'data_contract'] },
]

const SCOPE_LABELS: Record<string, string> = {
  global: 'Global',
  'natco-de': 'Germany',
  'natco-at': 'Austria',
  'natco-hr': 'Croatia',
  'natco-hu': 'Hungary',
  'natco-pl': 'Poland',
}

function packForKind(kind: string): ContractPack | null {
  for (const p of PACKS) {
    if (p.kinds.includes(kind)) return p.id
  }
  return null
}

function graphNodeForContract(contractId: string): string | null {
  const node = graphData.nodes.find((n) => n.contract_ref === contractId)
  return node?.id ?? null
}

function humanFields(c: Contract): { label: string; value: string }[] {
  const skip = new Set(['id', 'name', 'display_name', 'kind', 'natco', 'description'])
  const rows: { label: string; value: string }[] = []
  for (const [k, v] of Object.entries(c)) {
    if (skip.has(k) || v == null || typeof v === 'object') continue
    rows.push({ label: k.replace(/_/g, ' '), value: String(v) })
  }
  return rows.slice(0, 12)
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
  const { demoId = 'customer360' } = useParams()
  const semanticsHref = `/demo/${demoId}/semantics`

  const scopes = contractsData.meta.natcos
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { global: true }
    for (const s of scopes) init[`${s}:semantics`] = s === 'global'
    return init
  })
  const [showRaw, setShowRaw] = useState(false)

  const byScope = useMemo(() => {
    const map: Record<string, Record<ContractPack, Contract[]>> = {}
    for (const scope of scopes) {
      map[scope] = { semantics: [], business: [], technical: [], products: [] }
    }
    for (const c of Object.values(contractsData.contracts) as Contract[]) {
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
    ? (contractsData.contracts as Record<string, Contract>)[contractId]
    : null

  const activeScope = contractScope ?? 'global'
  const activePack = contractPack ?? 'semantics'

  function selectContract(c: Contract, scope: string, pack: ContractPack) {
    setContractId(c.id)
    setContractScope(scope)
    setContractPack(pack)
    const nodeId = graphNodeForContract(c.id)
    if (nodeId) setGraphNodeId(nodeId)
    setShowRaw(false)
  }

  function toggle(key: string) {
    setExpanded((e) => ({ ...e, [key]: !e[key] }))
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
            {SCOPE_LABELS[scope] ?? scope}
          </button>
        ))}
      </div>

      <div className="grid min-h-[520px] lg:grid-cols-[280px_1fr]">
        <div className="max-h-[70vh] overflow-y-auto border-b border-[var(--color-line)] bg-white lg:border-b-0 lg:border-r">
          <p className="border-b border-[var(--color-line)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
            Folders
          </p>
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
                    {SCOPE_LABELS[scope] ?? scope}
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
                            {packOpen ? (
                              <ul className="mb-1 ml-2 space-y-0.5">
                                {items.length === 0 ? (
                                  <li className="px-2 py-1 text-[11px] text-[var(--color-slate)]">Empty</li>
                                ) : (
                                  items.map((c) => (
                                    <li key={c.id}>
                                      <button
                                        type="button"
                                        onClick={() => selectContract(c, scope, pack.id)}
                                        className={`w-full truncate rounded-md px-2 py-1.5 text-left text-xs ${
                                          contractId === c.id
                                            ? 'bg-[var(--color-accent-soft)] font-semibold text-[var(--color-teal-dim)]'
                                            : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)]'
                                        }`}
                                      >
                                        {c.display_name ?? c.name ?? c.id}
                                      </button>
                                    </li>
                                  ))
                                )}
                              </ul>
                            ) : null}
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
                  {SCOPE_LABELS[selected.natco ?? 'global'] ?? selected.natco} · {selected.kind.replace(/_/g, ' ')}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {selected.display_name ?? selected.name ?? selected.id}
                </h3>
                {selected.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">{selected.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {graphNodeForContract(selected.id) ? (
                    <Link
                      to={semanticsHref}
                      onClick={() => {
                        const n = graphNodeForContract(selected.id)
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
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--color-slate)]">
              Select a folder and contract to inspect its definition.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
