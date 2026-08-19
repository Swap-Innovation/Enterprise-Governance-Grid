import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Section } from './Section'
import { getProject } from '../data/projects'
import { PATTERN_STUDIO } from '../data/patternCopy'

const dtPillars = [
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
  const { demoId } = useParams()
  const project = getProject(demoId)
  const isPattern = project.id === 'udp-pattern'
  const pillars = isPattern ? PATTERN_STUDIO.idea.pillars : dtPillars
  const lead = isPattern
    ? PATTERN_STUDIO.idea.lead
    : 'Centrally governed meaning, federated catalog ownership, Marketplace enrichment, and open interchange — without asking NATCOs to give up their catalogs.'
  const footer = isPattern
    ? PATTERN_STUDIO.idea.footer
    : 'Think of it as a governance grid for meaning: Global and NATCO still own their metadata; the Grid owns the certified crosswalk so everyone — including AI — speaks the same language.'

  return (
    <Section
      id="idea"
      compact
      eyebrow="Core idea"
      title="Enterprise Governance Grid"
      lead={lead}
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
      <p className="mt-8 max-w-3xl text-sm text-[var(--color-mist)]">{footer}</p>
    </Section>
  )
}
