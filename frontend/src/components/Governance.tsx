import { motion } from 'framer-motion'
import tmforum from '../data/examples/tmforum.json'
import { policies } from '../data/content'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

export function Governance() {
  const g = tmforum.governanceExample

  return (
    <Section
      id="governance"
      compact
      eyebrow="Policy"
      title="Lifecycle that protects SID meaning"
      lead="TM Forum Customer (and Tier A) moves draft → review → approved → deprecated. Only approved targets feed active maps and hard product gates."
    >
      <div className="mb-4">
        <p className="text-sm text-[var(--color-mist)]">
          Worked example:{' '}
          <code className="text-[var(--color-teal)]">{g.concept}</code> · {g.sid}
        </p>
      </div>

      <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
        {g.steps.map((s, i) => (
          <motion.div
            key={s.state}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative flex flex-1 flex-col border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-4 sm:border-r-0 sm:last:border-r"
          >
            <span className="font-mono text-xs text-[var(--color-teal)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 font-display text-lg font-bold capitalize text-[var(--color-foam)]">
              {s.state}
            </p>
            <p className="mt-1 text-[10px] tracking-wide text-[var(--color-brass)] uppercase">
              {s.actor}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-mist)]">{s.action}</p>
            {i < g.steps.length - 1 ? (
              <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[var(--color-brass)] sm:block">
                →
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>

      <ExamplePanel title="Policies enforced on SID concepts">
        <ul className="grid gap-3 md:grid-cols-2">
          {policies.map((p) => (
            <li
              key={p}
              className="border-l border-[var(--color-brass)]/50 pl-4 text-sm leading-relaxed text-[var(--color-mist)]"
            >
              {p}
            </li>
          ))}
        </ul>
      </ExamplePanel>
    </Section>
  )
}
