import { motion } from 'framer-motion'
import { Section } from './Section'

const pains = [
  {
    title: 'Same word, different meaning',
    body: 'Kunde, Kupac, Ügyfél, Klient, and Customer look related — but catalogs, reports, and products disagree on the definition.',
  },
  {
    title: 'Products without certified meaning',
    body: 'Marketplace publishes Customer 360, yet nothing guarantees the product implements the enterprise concept of Customer.',
  },
  {
    title: 'AI without trusted context',
    body: 'Copilots guess from tables and tribal knowledge — not from approved, traversable meaning.',
  },
]

export function Problem() {
  return (
    <Section
      id="problem"
      compact
      eyebrow="The problem"
      title="Meaning is fragmented across the enterprise"
      lead="NATCO labels, catalog prose, technical assets, and data products each tell a different story — so governance, Marketplace, and AI cannot share one truth."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {pains.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="border-l border-[var(--color-brass)]/50 pl-4"
          >
            <p className="font-mono text-xs text-[var(--color-brass)]">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-[var(--color-foam)]">
              {p.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">{p.body}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
