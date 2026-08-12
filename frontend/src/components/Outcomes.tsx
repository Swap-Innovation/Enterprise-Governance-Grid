import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Section } from './Section'
import { DEMO_BASE } from '../data/demo'

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
      compact
      eyebrow="Outcomes"
      title="What success looks like"
      lead="A clear pilot — not a multi-year boil-the-ocean program."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <ul className="space-y-3 lg:col-span-6">
          {outcomes.map((o, i) => (
            <motion.li
              key={o}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 text-sm leading-relaxed text-[var(--color-foam)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-teal)]" />
              {o}
            </motion.li>
          ))}
        </ul>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-5 lg:col-span-6"
        >
          <p className="eyebrow mb-2">Pilot ask</p>
          <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--color-foam)]">
            One domain · one NATCO
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-[var(--color-mist)]">
            <li>Stand up Registry + Namespace (global + one natco-*)</li>
            <li>Import TM Forum Customer slice; approve core concepts</li>
            <li>Map ≥5 business + technical assets; bind one Marketplace product</li>
            <li>Validate Ossie export for the pilot namespaces</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`${DEMO_BASE}/studio#architecture`} className="btn-accent px-4 py-2 text-xs">
              Walk architecture
            </Link>
            <Link to={`${DEMO_BASE}/semantics`} className="btn-ghost px-4 py-2 text-xs">
              Open knowledge graph
            </Link>
          </div>
        </motion.aside>
      </div>
    </Section>
  )
}
