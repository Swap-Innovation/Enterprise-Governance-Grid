import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  archById,
  getFocusSet,
  type ArchComponent,
} from '../data/architecture'
import { Section } from './Section'

type Role = 'idle' | 'selected' | 'upstream' | 'downstream' | 'dimmed'

function roleOf(id: string, focus: ReturnType<typeof getFocusSet>): Role {
  if (!focus.selected) return 'idle'
  if (id === focus.selected) return 'selected'
  if (focus.upstream.has(id)) return 'upstream'
  if (focus.downstream.has(id)) return 'downstream'
  return 'dimmed'
}

function roleStyles(role: Role, accent: ArchComponent['accent'] = 'teal') {
  const accentBorder =
    accent === 'brass'
      ? 'border-[var(--color-brass)]/55'
      : accent === 'signal'
        ? 'border-[var(--color-signal)]/55'
        : accent === 'violet'
          ? 'border-violet-400/55'
          : 'border-[var(--color-teal)]/45'

  switch (role) {
    case 'selected':
      return `${accentBorder} bg-[var(--color-teal)]/15 ring-2 ring-[var(--color-teal)] opacity-100`
    case 'upstream':
      return 'border-[var(--color-brass)] bg-[var(--color-brass)]/10 ring-1 ring-[var(--color-brass)]/60 opacity-100'
    case 'downstream':
      return 'border-[var(--color-signal)] bg-[var(--color-signal)]/10 ring-1 ring-[var(--color-signal)]/60 opacity-100'
    case 'dimmed':
      return 'border-[var(--color-line)] bg-[var(--color-ink)]/40 opacity-25'
    default:
      return `${accentBorder} bg-[var(--color-ink)]/90 opacity-100 hover:border-[var(--color-teal)]/70`
  }
}

function ArchBox({
  component,
  role,
  onSelect,
}: {
  component: ArchComponent
  role: Role
  onSelect: (id: string) => void
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(component.id)}
      animate={{ scale: role === 'selected' ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`w-full border p-3 text-left transition-colors ${roleStyles(role, component.accent)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-xs font-bold text-[var(--color-foam)] sm:text-sm">
          {component.title}
        </p>
        {role === 'upstream' ? (
          <span className="shrink-0 text-[9px] font-semibold tracking-wide text-[var(--color-brass-bright)] uppercase">
            depends
          </span>
        ) : null}
        {role === 'downstream' ? (
          <span className="shrink-0 text-[9px] font-semibold tracking-wide text-[var(--color-signal)] uppercase">
            next
          </span>
        ) : null}
      </div>
      <ul className="mt-2 space-y-0.5">
        {component.items.slice(0, 3).map((i) => (
          <li key={i} className="text-[10px] leading-snug text-[var(--color-mist)] sm:text-[11px]">
            {i}
          </li>
        ))}
      </ul>
    </motion.button>
  )
}

function TierLabel({ label }: { label: string }) {
  return (
    <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-[var(--color-brass)] uppercase">
      {label}
    </p>
  )
}

function FlowPanel({
  selectedId,
  onSelect,
  onClear,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  onClear: () => void
}) {
  const selected = selectedId ? archById[selectedId] : null

  if (!selected) {
    return (
      <div className="flex h-full flex-col justify-center p-5 text-sm text-[var(--color-mist)]">
        <p className="font-display text-lg font-bold text-[var(--color-foam)]">
          Click any component
        </p>
        <p className="mt-3 leading-relaxed">
          Brass nodes are <span className="text-[var(--color-brass-bright)]">depends on</span>.
          Teal/signal nodes are <span className="text-[var(--color-signal)]">what next</span>.
          Follow the flow through the control plane.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--color-line)] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{selected.tierLabel}</p>
            <h3 className="mt-2 font-display text-xl font-bold text-[var(--color-foam)]">
              {selected.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 border border-[var(--color-line)] px-2 py-1 text-[10px] text-[var(--color-mist)] hover:border-[var(--color-teal)]"
          >
            Clear
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">{selected.summary}</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
        <div>
          <p className="eyebrow mb-3 text-[var(--color-brass)]">Depends on · upstream</p>
          {selected.dependsOn.length === 0 ? (
            <p className="text-xs text-[var(--color-mist)]">No upstream dependency (source / foundation).</p>
          ) : (
            <ul className="space-y-2">
              {selected.dependsOn.map((id) => {
                const c = archById[id]
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="w-full border border-[var(--color-brass)]/40 bg-[var(--color-brass)]/5 px-3 py-2 text-left hover:bg-[var(--color-brass)]/15"
                    >
                      <span className="text-[10px] text-[var(--color-brass)]">{c?.tierLabel}</span>
                      <span className="mt-0.5 block text-sm font-medium text-[var(--color-foam)]">
                        {c?.title ?? id}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3 text-[var(--color-signal)]">What next · downstream flow</p>
          {selected.next.length === 0 ? (
            <p className="text-xs text-[var(--color-mist)]">End of this path (consumer / leaf).</p>
          ) : (
            <ol className="space-y-2">
              {selected.next.map((id, i) => {
                const c = archById[id]
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="flex w-full items-start gap-3 border border-[var(--color-signal)]/40 bg-[var(--color-signal)]/5 px-3 py-2 text-left hover:bg-[var(--color-signal)]/15"
                    >
                      <span className="font-mono text-xs text-[var(--color-signal)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="block text-[10px] text-[var(--color-mist)]">{c?.tierLabel}</span>
                        <span className="mt-0.5 block text-sm font-medium text-[var(--color-foam)]">
                          {c?.title ?? id}
                        </span>
                        <span className="mt-1 block text-[11px] text-[var(--color-mist)]">
                          {c?.summary}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3">Suggested path</p>
          <SuggestedPath selectedId={selected.id} onSelect={onSelect} />
        </div>
      </div>
    </div>
  )
}

function SuggestedPath({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  const path = useMemo(() => {
    const start = archById[selectedId]
    if (!start) return [] as ArchComponent[]
    const out: ArchComponent[] = [start]
    let guard = 0
    let cur = start
    while (cur.next[0] && guard < 6) {
      const n = archById[cur.next[0]]
      if (!n || out.some((x) => x.id === n.id)) break
      out.push(n)
      cur = n
      guard += 1
    }
    return out
  }, [selectedId])

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {path.map((c, i) => (
        <span key={c.id} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelect(c.id)}
            className={`border px-2 py-1 text-[11px] ${
              c.id === selectedId
                ? 'border-[var(--color-teal)] text-[var(--color-teal)]'
                : 'border-[var(--color-line)] text-[var(--color-mist)] hover:border-[var(--color-signal)]'
            }`}
          >
            {c.title}
          </button>
          {i < path.length - 1 ? (
            <span className="text-[var(--color-signal)]" aria-hidden>
              →
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}

function groupByTier(ids: string[]) {
  return ids.map((id) => archById[id]).filter(Boolean) as ArchComponent[]
}

export function AnimatedArchitecture() {
  const [selectedId, setSelectedId] = useState<string | null>('semantic-registry')
  const focus = getFocusSet(selectedId)

  const tier0 = groupByTier(['tmforum-sid', 'global-catalogs', 'natco-catalogs'])
  const tier05 = groupByTier(['connectors', 'sid-adapter'])
  const tier1a = groupByTier([
    'semantic-registry',
    'namespace-registry',
    'ontology',
    'knowledge-graph',
  ])
  const tier1b = groupByTier([
    'mapping-engine',
    'federation-engine',
    'governance-engine',
    'common-capabilities',
  ])
  const tier2 = groupByTier([
    'api-gateway',
    'semantic-api',
    'graph-api',
    'search',
    'mcp-server',
  ])
  const tier3 = groupByTier([
    'marketplace',
    'ai-agents',
    'bi',
    'applications',
    'data-users',
    'partners',
  ])
  const tier4 = groupByTier(['foundation'])
  const ossie = archById.ossie

  return (
    <Section
      id="architecture"
      eyebrow="05 · How it works"
      title="Interactive architecture"
      lead="Click a component to see what it depends on (upstream) and what flows next (downstream). Follow the path through meaning."
    >
      <div className="mb-4 flex flex-wrap items-center gap-4 text-[11px] text-[var(--color-mist)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--color-teal)]" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--color-brass)]" /> Depends on
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--color-signal)]" /> What next
        </span>
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="ml-auto border border-[var(--color-line)] px-2 py-1 text-[11px] hover:border-[var(--color-teal)]"
        >
          Show all
        </button>
      </div>

      <div className="grid overflow-hidden border border-[var(--color-line-strong)] lg:grid-cols-[1fr_320px]">
        <div className="space-y-3 bg-[var(--color-ink-elevated)] p-3 sm:p-4">
          <div>
            <TierLabel label="Tier 0 · Authoritative sources" />
            <div className="grid gap-2 sm:grid-cols-3">
              {tier0.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <Pulse active={!!selectedId} />

          <div>
            <TierLabel label="Tier 0.5 · Ingestion & connectivity" />
            <div className="grid gap-2 sm:grid-cols-2">
              {tier05.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <Pulse active={!!selectedId} />

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <TierLabel label="Tier 1 · Semantic Control Plane (SoR)" />
              <span className="border border-[var(--color-teal)]/40 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-teal)] uppercase">
                Meaning SoR
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {tier1a.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {tier1b.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <Pulse active={!!selectedId} brass />

          <div>
            <TierLabel label="Tier 2 · Services & runtime APIs" />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {tier2.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <Pulse active={!!selectedId} brass />

          <div>
            <TierLabel label="Tier 3 · Consumers" />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tier3.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <Pulse active={!!selectedId} />

          <div>
            <TierLabel label="Tier 4 · Foundation platform" />
            <div className="grid gap-2">
              {tier4.map((c) => (
                <ArchBox
                  key={c.id}
                  component={c}
                  role={roleOf(c.id, focus)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          {ossie ? (
            <div className="pt-1">
              <TierLabel label="Tier 2.5 · External exchange" />
              <ArchBox
                component={ossie}
                role={roleOf(ossie.id, focus)}
                onSelect={setSelectedId}
              />
            </div>
          ) : null}
        </div>

        <div className="min-h-[420px] border-t border-[var(--color-line)] bg-[var(--color-ink)] lg:border-t-0 lg:border-l">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId ?? 'none'}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <FlowPanel
                selectedId={selectedId}
                onSelect={setSelectedId}
                onClear={() => setSelectedId(null)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] tracking-wide text-[var(--color-mist)] sm:text-xs">
        Sources → Connectors → Control Plane → APIs → Consumers · OSSIE ↔ packages
      </p>
    </Section>
  )
}

function Pulse({ active, brass }: { active: boolean; brass?: boolean }) {
  return (
    <div className="relative flex h-5 items-center justify-center" aria-hidden>
      <div
        className={`h-px w-full ${brass ? 'bg-[var(--color-brass)]/30' : 'bg-[var(--color-line-strong)]'}`}
      />
      <motion.span
        className={`absolute h-1.5 w-1.5 rounded-full ${brass ? 'bg-[var(--color-brass)]' : 'bg-[var(--color-teal)]'}`}
        animate={{ x: ['-40%', '40%'], opacity: active ? 1 : 0.35 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
