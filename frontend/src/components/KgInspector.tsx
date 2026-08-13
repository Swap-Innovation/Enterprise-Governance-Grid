import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { KgEdge, KgNode } from '../lib/kgTypes'
import { usePitchMode } from '../pitch/PitchContext'

const PRIORITY_KEYS = [
  'displayName',
  'preferredLabel',
  'description',
  'owner',
  'scope',
  'kind',
  'assetType',
  'pack',
  'familyId',
  'layer',
  'sourceSystem',
  'qualifiedName',
  'fullyQualifiedName',
  'typeContractId',
  'status',
  'uri',
  'conceptId',
  'optionId',
  'tool',
  'role',
  'slug',
] as const

const HIDDEN_FROM_OVERVIEW = new Set([
  'id',
  'name',
  'label',
  'natco',
  'isPrimaryKey',
  'metadataJson',
  'characteristicsJson',
  'linksJson',
  'rawJson',
  'sourcePath',
])

function tryParseJson(value: unknown): unknown | null {
  if (value == null) return null
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return null
  const t = value.trim()
  if (!t || (t[0] !== '{' && t[0] !== '[')) return null
  try {
    return JSON.parse(t)
  } catch {
    return null
  }
}

function humanLabel(key: string): string {
  return key
    .replace(/Json$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\bid\b/gi, 'ID')
    .replace(/\buri\b/gi, 'URI')
}

function formatScalar(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function FieldRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-x-2 border-b border-[var(--color-line)]/70 py-1.5 last:border-b-0">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-slate)]">{label}</dt>
      <dd className="min-w-0 break-words text-[11px] leading-snug text-[var(--color-ink-soft)]">{value}</dd>
    </div>
  )
}

function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="mb-2 overflow-hidden rounded-lg border border-[var(--color-line)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-2.5 py-2 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-slate)]">
          <span className="mr-1.5 font-mono text-[10px] text-[var(--color-mist)]">{open ? '▾' : '▸'}</span>
          {title}
        </span>
        {typeof count === 'number' ? (
          <span className="text-[10px] text-[var(--color-mist)]">{count}</span>
        ) : null}
      </button>
      {open ? <div className="border-t border-[var(--color-line)] px-2.5 py-1.5">{children}</div> : null}
    </section>
  )
}

function ObjectFields({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data)
  if (!entries.length) {
    return <p className="py-1 text-[11px] text-[var(--color-mist)]">Empty</p>
  }
  return (
    <dl>
      {entries.map(([k, v]) => {
        if (v != null && typeof v === 'object' && !Array.isArray(v)) {
          return (
            <div key={k} className="border-b border-[var(--color-line)]/70 py-1.5 last:border-b-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-slate)]">
                {humanLabel(k)}
              </p>
              <div className="ml-1 border-l border-[var(--color-line)] pl-2">
                <ObjectFields data={v as Record<string, unknown>} />
              </div>
            </div>
          )
        }
        if (Array.isArray(v)) {
          return (
            <FieldRow
              key={k}
              label={humanLabel(k)}
              value={
                v.length === 0 ? (
                  '—'
                ) : (
                  <ul className="space-y-0.5">
                    {v.map((item, i) => (
                      <li key={i} className="font-mono text-[10px]">
                        {typeof item === 'string' || typeof item === 'number'
                          ? String(item)
                          : JSON.stringify(item)}
                      </li>
                    ))}
                  </ul>
                )
              }
            />
          )
        }
        return <FieldRow key={k} label={humanLabel(k)} value={formatScalar(v)} />
      })}
    </dl>
  )
}

function overviewRows(props: Record<string, unknown>): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  const used = new Set<string>()

  for (const key of PRIORITY_KEYS) {
    if (!(key in props) || props[key] == null || props[key] === '') continue
    if (HIDDEN_FROM_OVERVIEW.has(key)) continue
    used.add(key)
    rows.push({ label: humanLabel(key), value: formatScalar(props[key]) })
  }

  for (const [key, value] of Object.entries(props)) {
    if (used.has(key) || HIDDEN_FROM_OVERVIEW.has(key)) continue
    if (value == null || value === '' || typeof value === 'object') continue
    if (/Json$/i.test(key)) continue
    rows.push({ label: humanLabel(key), value: formatScalar(value) })
  }

  return rows
}

export function KgInspector({
  graph,
  selectedId,
  onSelectNeighbor,
  contractsHref = '../contracts',
}: {
  graph: { nodes: KgNode[]; edges: KgEdge[] }
  selectedId: string | null
  onSelectNeighbor: (id: string) => void
  contractsHref?: string
}) {
  const node = graph.nodes.find((n) => n.id === selectedId)
  const [showRaw, setShowRaw] = useState(false)
  const { setContractId } = usePitchMode()

  const neighbors = useMemo(() => {
    if (!selectedId) return []
    return graph.edges
      .filter((e) => e.from === selectedId || e.to === selectedId)
      .map((e) => {
        const outbound = e.from === selectedId
        const otherId = outbound ? e.to : e.from
        return {
          predicate: e.predicate,
          direction: outbound ? 'out' : 'in',
          otherId,
          otherLabel: graph.nodes.find((n) => n.id === otherId)?.label ?? otherId,
        }
      })
  }, [selectedId, graph])

  const parsed = useMemo(() => {
    const props = (node?.properties ?? {}) as Record<string, unknown>
    return {
      props,
      metadata: tryParseJson(props.metadataJson) as Record<string, unknown> | null,
      characteristics: tryParseJson(props.characteristicsJson) as Record<string, unknown> | null,
      links: tryParseJson(props.linksJson) as Record<string, unknown> | null,
      rawContract: tryParseJson(props.rawJson) as Record<string, unknown> | null,
    }
  }, [node])

  if (!node) {
    return (
      <div className="grid h-full place-items-center p-6 text-center text-xs leading-relaxed text-[var(--color-mist)]">
        Select a node to inspect its contract fields and neighbors.
      </div>
    )
  }

  const title =
    formatScalar(parsed.props.displayName ?? parsed.props.preferredLabel ?? node.label) || node.label
  const description =
    typeof parsed.props.description === 'string'
      ? parsed.props.description
      : typeof parsed.characteristics?.Description === 'string'
        ? parsed.characteristics.Description
        : null
  const overview = overviewRows(parsed.props)
  const contractRef = node.contract_ref || (typeof parsed.props.id === 'string' ? parsed.props.id : null)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--color-line)] px-3 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
          {(node.labels ?? [node.type]).join(' · ')}
          {node.natco ? ` · ${node.natco}` : ''}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-snug text-[var(--color-ink)]">{title}</h3>
        {description ? (
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-slate)]">{description}</p>
        ) : null}
        <p className="mt-1.5 font-mono text-[10px] text-[var(--color-mist)]">{node.neo4jId ?? node.id}</p>
        {contractRef ? (
          <Link
            to={contractsHref}
            onClick={() => setContractId(contractRef)}
            className="mt-2 inline-flex rounded-md border border-[var(--color-line)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--color-teal-dim)] hover:border-[var(--color-accent)]"
          >
            Open in contracts
          </Link>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <CollapsibleSection title="Overview" count={overview.length} defaultOpen>
          {overview.length ? (
            <dl>
              {overview.map((row) => (
                <FieldRow key={row.label} label={row.label} value={row.value} />
              ))}
            </dl>
          ) : (
            <p className="py-1 text-[11px] text-[var(--color-mist)]">No scalar fields</p>
          )}
        </CollapsibleSection>

        {parsed.characteristics && Object.keys(parsed.characteristics).length ? (
          <CollapsibleSection title="Characteristics" count={Object.keys(parsed.characteristics).length} defaultOpen>
            <ObjectFields data={parsed.characteristics} />
          </CollapsibleSection>
        ) : null}

        {parsed.metadata && Object.keys(parsed.metadata).length ? (
          <CollapsibleSection title="Metadata" count={Object.keys(parsed.metadata).length} defaultOpen>
            <ObjectFields data={parsed.metadata} />
          </CollapsibleSection>
        ) : null}

        {parsed.links && Object.keys(parsed.links).length ? (
          <CollapsibleSection title="Links" count={Object.keys(parsed.links).length} defaultOpen>
            <ObjectFields data={parsed.links} />
          </CollapsibleSection>
        ) : null}

        <CollapsibleSection title="Neighbors" count={neighbors.length} defaultOpen>
          {neighbors.length ? (
            <ul className="space-y-1">
              {neighbors.map((n) => (
                <li key={`${n.predicate}-${n.otherId}-${n.direction}`}>
                  <button
                    type="button"
                    onClick={() => onSelectNeighbor(n.otherId)}
                    className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper-soft)] px-2 py-1.5 text-left text-xs hover:border-[var(--color-accent)]"
                  >
                    <span className="font-mono text-[10px] text-[var(--color-accent)]">
                      {n.direction === 'out' ? `─${n.predicate}→` : `←${n.predicate}─`}
                    </span>
                    <span className="mt-0.5 block text-[var(--color-ink)]">{n.otherLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-1 text-[11px] text-[var(--color-mist)]">No neighbors in this result</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Raw Neo4j properties" defaultOpen={false}>
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="mb-2 text-[10px] font-semibold text-[var(--color-teal-dim)] hover:underline"
          >
            {showRaw ? 'Hide JSON' : 'Show JSON'}
          </button>
          {showRaw ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-2 font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
              {JSON.stringify(parsed.props, null, 2)}
            </pre>
          ) : (
            <p className="text-[11px] text-[var(--color-mist)]">
              Full property bag kept for debugging — overview sections above are preferred.
            </p>
          )}
        </CollapsibleSection>
      </div>
    </div>
  )
}
