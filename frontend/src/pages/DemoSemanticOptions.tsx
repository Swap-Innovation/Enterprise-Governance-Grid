import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoPageHeader } from '../components/DemoPageHeader'
import optionsAbc from '../../../mock-data/projects/udp-dt/scenarios/options-abc.json'

type SemanticOption = (typeof optionsAbc.options)[number]
type BusinessUnit = (typeof optionsAbc.meta.businessUnits)[number]
type ComparisonAxis = (typeof optionsAbc.meta.comparisonAxes)[number]

const ROLE_LABELS: Record<string, string> = {
  canonical: 'Enterprise',
  natco: 'NATCO',
  business_unit: 'Business unit',
  tool: 'Tool',
}

export function DemoSemanticOptions() {
  const options = optionsAbc.options as SemanticOption[]
  const businessUnits = optionsAbc.meta.businessUnits as BusinessUnit[]
  const comparisonAxes = optionsAbc.meta.comparisonAxes as ComparisonAxis[]
  const migrationNote = optionsAbc.meta.migrationNote

  const [activeId, setActiveId] = useState<string>(
    () => options.find((o) => o.recommended)?.id ?? options[0]?.id ?? 'A',
  )
  const active = useMemo(
    () => options.find((o) => o.id === activeId) ?? options[0],
    [activeId, options],
  )

  const layerStack = useMemo(() => {
    if (active?.id === 'A') return optionsAbc.meta.layerStackOptionA as string[]
    if (active?.id === 'C') return optionsAbc.meta.layerStackOptionC as string[]
    return []
  }, [active?.id])

  if (!active) return null

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <DemoPageHeader
        eyebrow="Client workshop · SQ1 / SQ2"
        title="Semantic setup options"
        lead="Two structurally unique setups for Germany: B2B, B2C, and Network stewardship under the NATCO. Compare A (centralized) vs C (BU federated canonical); recommend C as the end-picture."
        actions={
          <Link
            to="/demo/udp-dt/semantics?query=O3"
            className="tool-btn text-[12px] no-underline"
          >
            Open live KG · O3 →
          </Link>
        }
      />

      <section className="mb-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-5">
        <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">{migrationNote.title}</h2>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
          {migrationNote.summary}
        </p>
        <p className="mt-2 text-[12px] text-[var(--color-slate)]">
          Detail: <code className="text-[11px]">{migrationNote.doc}</code>
        </p>
      </section>

      <section className="mb-6 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="border-b border-[var(--color-line)] px-5 py-3">
          <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">A vs C at a glance</h2>
        </div>
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead className="bg-[var(--color-paper-soft)] text-[11px] text-[var(--color-slate)]">
            <tr>
              <th className="px-5 py-2.5 font-medium">Axis</th>
              <th className="px-3 py-2.5 font-medium">Option A</th>
              <th className="px-5 py-2.5 font-medium">Option C</th>
            </tr>
          </thead>
          <tbody>
            {comparisonAxes.map((row) => (
              <tr key={row.axis} className="border-t border-[var(--color-line)]">
                <td className="px-5 py-2.5 font-medium text-[var(--color-ink)]">{row.axis}</td>
                <td className="px-3 py-2.5 text-[var(--color-ink-soft)]">{row.optionA}</td>
                <td className="px-5 py-2.5 text-[var(--color-ink-soft)]">{row.optionC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">Business units (all options)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {businessUnits.map((bu) => (
            <div key={bu.id} className="rounded-xl bg-[var(--color-paper-soft)] px-3 py-2.5">
              <p className="text-[12px] font-semibold text-[var(--color-ink)]">{bu.label}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-slate)]">{bu.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.id === active.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setActiveId(o.id)}
              className={`rounded-xl px-4 py-2.5 text-left transition-colors ${
                on
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'bg-[var(--color-paper-soft)] text-[var(--color-ink)] hover:bg-[var(--color-paper-mute)]'
              }`}
            >
              <span className="block text-[11px] font-medium opacity-80">Option {o.id}</span>
              <span className="block text-[13px] font-semibold leading-tight">{o.title}</span>
              {o.recommended ? (
                <span
                  className={`mt-1 inline-block text-[10px] font-medium ${on ? 'text-white/90' : 'text-[var(--color-accent)]'}`}
                >
                  Recommended end-state
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <section className="mb-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-slate)]">
          {active.subtitle}
        </p>
        <h2 className="mt-1 font-display text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">
          Option {active.id} · {active.title}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          {active.pitch}
        </p>
        {'buModel' in active && active.buModel ? (
          <p className="mt-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-soft)] px-4 py-3 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
            <span className="font-semibold text-[var(--color-ink)]">BU model: </span>
            {String(active.buModel).replace(/\*\*/g, '')}
          </p>
        ) : null}
        <p className="mt-3 text-[13px] text-[var(--color-slate)]">
          <span className="font-medium text-[var(--color-ink)]">When to choose:</span>{' '}
          {active.whenToChoose}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[11px] font-medium text-[var(--color-accent)]">
            KG query {active.queryCode}
          </span>
          <Link
            to={`/demo/udp-dt/semantics?query=${active.queryCode}`}
            className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[11px] font-medium text-[var(--color-ink)] no-underline hover:border-[var(--color-accent)]"
          >
            View in Semantics tab
          </Link>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">
          Layer stack · Option {active.id}
        </h3>
        <ol className="mt-3 space-y-2">
          {layerStack.map((layer, i) => (
            <li key={layer} className="flex items-center gap-3 text-[13px] text-[var(--color-ink-soft)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[11px] font-bold text-[var(--color-teal-dim)]">
                {i + 1}
              </span>
              {layer}
            </li>
          ))}
        </ol>
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Namespaces</h3>
          <ul className="mt-3 space-y-2">
            {active.namespaces.map((ns) => (
              <li
                key={ns.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-[var(--color-paper-soft)] px-3 py-2.5"
              >
                <div>
                  <p className="font-mono text-[12px] text-[var(--color-ink)]">{ns.slug}</p>
                  <p className="text-[12px] text-[var(--color-slate)]">{ns.label}</p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                    ns.role === 'business_unit'
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-teal-dim)]'
                      : 'bg-white text-[var(--color-slate)]'
                  }`}
                >
                  {ROLE_LABELS[ns.role] ?? ns.role}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Business unit stewardship</h3>
          <ul className="mt-3 space-y-2">
            {'businessUnitStewards' in active &&
              active.businessUnitStewards?.map((row) => (
                <li
                  key={row.bu}
                  className="rounded-xl bg-[var(--color-paper-soft)] px-3 py-2.5 text-[12px]"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{row.bu}</p>
                  <p className="mt-0.5 text-[var(--color-slate)]">
                    Stewards: {row.stewards.join(' · ')}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--color-ink-soft)]">{row.namespace}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-slate)]">{row.tools.join(' · ')}</p>
                </li>
              ))}
          </ul>
        </section>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Pros / cons</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium text-[var(--color-accent)]">Pros</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-[var(--color-ink-soft)]">
                {active.pros.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[var(--color-amber)]">Cons</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-[var(--color-ink-soft)]">
                {active.cons.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[var(--color-slate)]">
            <span className="font-medium">Risks:</span> {active.risks.join(' · ')}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Decision axis</h3>
          <div className="mt-4 space-y-3 font-mono text-[11px] text-[var(--color-ink-soft)]">
            <p>Centralize (A) ←————————————————→ Federate by BU (C)</p>
            <p className="font-sans text-[12px] text-[var(--color-ink-soft)]">
              {active.id === 'A'
                ? 'One shared Customer in Germany — all tools BIND_TO the NATCO namespace.'
                : 'Geschäftskunde (B2B) + Kunde (B2C) in BU namespaces — tools MAPS_TO BU, federation to global.'}
            </p>
          </div>
        </section>
      </div>

      <section className="mb-8 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="border-b border-[var(--color-line)] px-5 py-3">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Concepts in this setup</h3>
        </div>
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead className="bg-[var(--color-paper-soft)] text-[11px] text-[var(--color-slate)]">
            <tr>
              <th className="px-5 py-2.5 font-medium">Concept</th>
              <th className="px-3 py-2.5 font-medium">Namespace</th>
              <th className="px-3 py-2.5 font-medium">Business unit</th>
              <th className="px-3 py-2.5 font-medium">Kind</th>
              <th className="px-3 py-2.5 font-medium">Used by</th>
              <th className="px-5 py-2.5 font-medium">Structure note</th>
            </tr>
          </thead>
          <tbody>
            {active.concepts.map((c) => (
              <tr key={c.id} className="border-t border-[var(--color-line)]">
                <td className="px-5 py-2.5 font-medium text-[var(--color-ink)]">{c.label}</td>
                <td className="px-3 py-2.5 font-mono text-[11px]">{c.namespace}</td>
                <td className="px-3 py-2.5">
                  {'businessUnit' in c && c.businessUnit ? String(c.businessUnit) : '—'}
                </td>
                <td className="px-3 py-2.5">{c.kind}</td>
                <td className="px-3 py-2.5">{c.usedBy.join(', ')}</td>
                <td className="px-5 py-2.5 text-[var(--color-slate)]">
                  {'structureNote' in c && c.structureNote ? String(c.structureNote) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Tool bindings</h3>
        <ul className="mt-3 space-y-2">
          {active.toolBindings.map((b, i) => (
            <li
              key={`${b.tool}-${b.artefact}-${i}`}
              className="grid gap-1 rounded-xl bg-[var(--color-paper-soft)] px-3 py-2.5 sm:grid-cols-[120px_1fr_1fr]"
            >
              <span className="text-[12px] font-semibold text-[var(--color-ink)]">{b.tool}</span>
              <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">{b.artefact}</span>
              <span className="text-[11px] text-[var(--color-slate)]">{b.bindsTo}</span>
            </li>
          ))}
        </ul>
      </section>

      {(active.federation.length > 0 || active.mappings.length > 0) && (
        <section className="mb-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Federation & mappings</h3>
          <div className="mt-3 space-y-2 font-mono text-[11px] text-[var(--color-ink-soft)]">
            {active.federation.map((f) => (
              <p key={`${f.from}-${f.to}`}>
                {f.from} <span className="text-[var(--color-accent)]">{f.predicate}</span> {f.to}
                {'note' in f && f.note ? (
                  <span className="ml-2 text-[var(--color-slate)]">({String(f.note)})</span>
                ) : null}
              </p>
            ))}
            {active.mappings.map((m) => (
              <p key={`${m.from}-${m.to}`}>
                {m.from} <span className="text-[var(--color-amber)]">{m.predicate}</span> {m.to}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper-soft)] p-5">
        <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Workshop close</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-[var(--color-ink-soft)]">
          <li>Start with the BU layer: B2B, B2C, Network under Germany — who stewards what?</li>
          <li>Show <strong>A</strong> if the client wants one shared Germany namespace across all BUs.</li>
          <li>
            Show <strong>C</strong>: BU canonical namespaces + tool maps + federation to global (SQ1 / SQ2).
          </li>
          <li>Mention the old Option B only as a migration narrative — not a third architecture tab.</li>
        </ol>
        <p className="mt-3 text-[12px] text-[var(--color-slate)]">
          Detail papers:{' '}
          <code className="text-[11px]">docs/strategy/semantic-options/</code>
        </p>
      </section>
    </div>
  )
}
