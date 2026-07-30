import { motion } from 'framer-motion'
import { Section } from './Section'

const outcomes = [
  'One enterprise semantic backbone — SID-aligned',
  'Federated NATCO ownership with central meaning',
  'Marketplace products bound to certified concepts',
  'AI-ready context via Graph + MCP APIs',
]

export function Outcomes() {
  return (
    <Section
      id="outcomes"
      eyebrow="07 · Outcomes & ask"
      title="What success looks like"
      lead="Leave the room with a clear pilot — not a multi-year boil-the-ocean program."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <ul className="space-y-4 lg:col-span-6">
          {outcomes.map((o, i) => (
            <motion.li
              key={o}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 text-sm leading-relaxed text-[var(--color-foam)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--color-teal)]" />
              {o}
            </motion.li>
          ))}
        </ul>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-[var(--color-brass)]/40 bg-[var(--color-ink-elevated)] p-6 lg:col-span-6"
        >
          <p className="eyebrow mb-3">Pilot ask</p>
          <h3 className="font-display text-2xl font-bold text-[var(--color-foam)]">
            One domain · one NATCO
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-[var(--color-mist)]">
            <li>Stand up Registry + Namespace (global + one natco-*)</li>
            <li>Import TM Forum Customer slice; approve core concepts</li>
            <li>Map ≥5 business + technical assets; bind one Marketplace product</li>
            <li>Validate Ossie export for the pilot namespaces</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#architecture"
              className="bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] no-underline"
            >
              Walk architecture
            </a>
            <a
              href="#context-graph"
              className="border border-[var(--color-line-strong)] px-4 py-2 text-sm text-[var(--color-foam)] no-underline hover:border-[var(--color-brass)]"
            >
              Open live proof
            </a>
          </div>
        </motion.aside>
      </div>
    </Section>
  )
}
