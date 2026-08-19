import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Section } from './Section'
import { getProject } from '../data/projects'
import { PATTERN_GOVERNANCE } from '../data/patternCopy'

const dtBoxes = [
  {
    role: 'SoR · Meaning',
    owner: 'Semantic Control Plane',
    body: 'Concepts, ontology, namespaces, mappings, federation, semantic governance.',
    accent: 'teal' as const,
  },
  {
    role: 'SoR · Glossary & assets',
    owner: 'Collibra / Dataplex',
    body: 'Local business terms and technical inventory — still owned by Global and NATCOs.',
    accent: 'brass' as const,
  },
  {
    role: 'SoR · Products & UI',
    owner: 'Entropy Marketplace',
    body: 'Data products, lifecycle, contracts, discovery experience.',
    accent: 'brass' as const,
  },
  {
    role: 'Exchange only',
    owner: 'Apache OSSIE',
    body: 'Import/export semantic packages with partners — never a second repository.',
    accent: 'signal' as const,
  },
]

const border: Record<(typeof dtBoxes)[number]['accent'], string> = {
  teal: 'border-[var(--color-teal)]/45',
  brass: 'border-[var(--color-brass)]/45',
  signal: 'border-[var(--color-signal)]/45',
}

export function Ownership() {
  const { demoId } = useParams()
  const isPattern = getProject(demoId).id === 'udp-pattern'
  const boxes = isPattern ? PATTERN_GOVERNANCE.ownership.boxes : dtBoxes
  const lead = isPattern
    ? PATTERN_GOVERNANCE.ownership.lead
    : 'Who owns meaning, catalogs, products, and exchange — without a forty-row RACI in the first conversation.'

  return (
    <Section id="ownership" compact eyebrow="Ownership" title="Four clear boundaries" lead={lead}>
      <div className="grid gap-4 sm:grid-cols-2">
        {boxes.map((b, i) => (
          <motion.article
            key={b.owner}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`border bg-[var(--color-ink-elevated)] p-5 ${border[b.accent]}`}
          >
            <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-brass)] uppercase">
              {b.role}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-[var(--color-foam)]">{b.owner}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)]">{b.body}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
