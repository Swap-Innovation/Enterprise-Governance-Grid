import { motion } from 'framer-motion'
import { outcomes, principles } from '../data/content'
import { Section } from './Section'

export function Thesis() {
  return (
    <Section
      id="thesis"
      eyebrow="01 · Thesis"
      title="Meaning is a grid, not a glossary silo"
      lead="The Enterprise Governance Grid is the conceptual frame for the Semantic Control Plane: intersecting axes of ownership, mapping, federation, and governance that keep enterprise meaning coherent across Global and NATCO."
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="border-l border-[var(--color-teal)]/40 pl-4"
              >
                <h3 className="font-display text-lg font-bold text-[var(--color-foam)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">
                  {p.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-6 lg:col-span-5"
        >
          <p className="eyebrow mb-4">Expected outcomes</p>
          <ul className="space-y-3">
            {outcomes.map((o) => (
              <li
                key={o}
                className="flex gap-3 text-sm leading-relaxed text-[var(--color-foam)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--color-brass)]" />
                {o}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </Section>
  )
}
