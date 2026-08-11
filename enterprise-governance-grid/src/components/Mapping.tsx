import { motion } from 'framer-motion'
import { useState } from 'react'
import tmforum from '../data/tmforum.json'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

type Tab = 'business' | 'technical' | 'product'

export function Mapping() {
  const [tab, setTab] = useState<Tab>('business')

  return (
    <Section
      id="mapping"
      eyebrow="06 · Mapping crosswalks"
      title="Three bridges into SID meaning"
      lead="Business terms, technical assets, and Marketplace products all resolve to TM Forum–aligned global concepts."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['business', 'Business · mapsTo'],
            ['technical', 'Technical · represents'],
            ['product', 'Product · implements'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`border px-4 py-2 text-sm transition-colors ${
              tab === id
                ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/15 text-[var(--color-foam)]'
                : 'border-[var(--color-line)] text-[var(--color-mist)] hover:border-[var(--color-line-strong)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'business' ? (
        <MapTable
          rows={tmforum.businessMappings.map((r) => ({
            left: r.source,
            mid: r.predicate,
            right: r.target,
            sid: r.sid,
          }))}
        />
      ) : null}
      {tab === 'technical' ? (
        <MapTable
          rows={tmforum.technicalMappings.map((r) => ({
            left: r.source,
            mid: r.predicate,
            right: r.target,
            sid: r.sid,
          }))}
        />
      ) : null}
      {tab === 'product' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tmforum.productBindings.map((p, i) => (
            <motion.article
              key={p.product}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-5"
            >
              <p className="font-mono text-xs text-[var(--color-brass)]">{p.layer}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-[var(--color-foam)]">
                {p.product}
              </h3>
              <p className="mt-3 text-xs text-[var(--color-mist)]">implements</p>
              <ul className="mt-2 space-y-1">
                {p.implements.map((u) => (
                  <li key={u} className="font-mono text-sm text-[var(--color-teal)]">
                    {u}
                  </li>
                ))}
                {'optional' in p && Array.isArray(p.optional)
                  ? (p.optional as string[]).map((u) => (
                      <li key={u} className="font-mono text-sm text-[var(--color-mist)]">
                        optional · {u}
                      </li>
                    ))
                  : null}
              </ul>
              <p className="mt-4 text-sm text-[var(--color-mist)]">{p.note}</p>
            </motion.article>
          ))}
        </div>
      ) : null}

      <ExamplePanel title="Contract attributes (every map)">
        <p className="text-sm text-[var(--color-mist)]">
          source_id · target_uri · mapping_type · confidence · owner · status ·
          effective_from · version · namespace · natco_code · source_system — targets
          always SID-backed global URIs when shared meaning applies.
        </p>
      </ExamplePanel>
    </Section>
  )
}

function MapTable({
  rows,
}: {
  rows: { left: string; mid: string; right: string; sid: string }[]
}) {
  return (
    <div className="overflow-x-auto border border-[var(--color-line-strong)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)]">
            <th className="px-4 py-3 font-medium text-[var(--color-mist)]">Source</th>
            <th className="px-4 py-3 font-medium text-[var(--color-mist)]">Predicate</th>
            <th className="px-4 py-3 font-medium text-[var(--color-mist)]">SID target</th>
            <th className="px-4 py-3 font-medium text-[var(--color-mist)]">ABE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.left}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-[var(--color-line)]"
            >
              <td className="px-4 py-3 text-[var(--color-foam)]">{r.left}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-teal)]">{r.mid}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-foam)]">{r.right}</td>
              <td className="px-4 py-3 text-[var(--color-brass-bright)]">{r.sid}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
