import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Section } from './Section'
import { getProject } from '../data/projects'
import { PATTERN_GOVERNANCE } from '../data/patternCopy'

const dtOutcomes = [
  'One enterprise semantic backbone — SID-aligned',
  'Federated NATCO ownership with central meaning',
  'Marketplace products bound to certified concepts',
  'AI-ready context via Graph + MCP APIs',
]

const dtAsk = [
  'Stand up Registry + Namespace (global + one natco-*)',
  'Import TM Forum Customer slice; approve core concepts',
  'Map ≥5 business + technical assets; bind one Marketplace product',
  'Validate Ossie export for the pilot namespaces',
]

export function Outcomes() {
  const { demoId } = useParams()
  const project = getProject(demoId)
  const isPattern = project.id === 'udp-pattern'
  const base = `/demo/${project.slug}`
  const outcomes = isPattern ? PATTERN_GOVERNANCE.outcomes.items : dtOutcomes
  const ask = isPattern ? PATTERN_GOVERNANCE.outcomes.ask : dtAsk
  const askTitle = isPattern ? PATTERN_GOVERNANCE.outcomes.askTitle : 'One domain · one NATCO'
  const lead = isPattern
    ? PATTERN_GOVERNANCE.outcomes.lead
    : 'A clear pilot — not a multi-year boil-the-ocean program.'

  return (
    <Section id="outcomes" compact eyebrow="Outcomes" title="What success looks like" lead={lead}>
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
            {askTitle}
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-[var(--color-mist)]">
            {ask.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`${base}/studio#architecture`} className="btn-accent px-4 py-2 text-xs">
              Walk architecture
            </Link>
            <Link to={`${base}/semantics`} className="btn-ghost px-4 py-2 text-xs">
              Open knowledge graph
            </Link>
          </div>
        </motion.aside>
      </div>
    </Section>
  )
}
