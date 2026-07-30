import { motion } from 'framer-motion'
import { Section } from './Section'

const pillars = [
  {
    title: 'One meaning backbone',
    body: 'The Semantic Control Plane is the system of record for enterprise meaning — seeded from TM Forum SID.',
  },
  {
    title: 'Catalogs keep their job',
    body: 'Collibra / Dataplex remain SoR for glossary prose and technical inventory. We map into meaning — we do not replace them.',
  },
  {
    title: 'Marketplace stays the product UI',
    body: 'Entropy Marketplace owns products and discovery. The Grid certifies which concepts those products implement.',
  },
]

export function BigIdea() {
  return (
    <Section
      id="idea"
      eyebrow="02 · The big idea"
      title="Enterprise Governance Grid"
      lead="Centrally governed meaning, federated catalog ownership, Marketplace enrichment, and open interchange — without asking NATCOs to give up their catalogs."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-5"
          >
            <h3 className="font-display text-lg font-bold text-[var(--color-teal)]">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">{p.body}</p>
          </motion.article>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm text-[var(--color-mist)]">
        Think of it as a <span className="text-[var(--color-foam)]">governance grid</span> for
        meaning: Global and NATCO still own their metadata; the Grid owns the certified
        crosswalk so everyone — including AI — speaks the same language.
      </p>
    </Section>
  )
}
