import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import pitch from '../../../mock-data/pitch-concepts.json'
import { getProject } from '../data/projects'
import { PATTERN_PITCH_CONCEPTS } from '../data/patternCopy'
import { Section } from './Section'

export function ConceptLibrary() {
  const { demoId } = useParams()
  const project = getProject(demoId)
  const isPattern = project.id === 'udp-pattern'
  const base = `/demo/${project.slug}`
  const concepts = isPattern
    ? PATTERN_PITCH_CONCEPTS.map((c) => ({
        id: c.id,
        name: c.name,
        what: c.what,
        why: c.why,
        example: c.example,
        exampleLabel: c.exampleLabel,
      }))
    : pitch.concepts.map((c) => ({
        id: c.id,
        name: c.name,
        what: c.what,
        why: c.why,
        example: c.example,
        exampleLabel: 'TM Forum example',
      }))
  const [openId, setOpenId] = useState<string | null>(concepts[0]?.id ?? null)
  const lead = isPattern
    ? 'Each idea in one breath — what it is, why it matters, and a UCP shopping example.'
    : 'Each idea in one breath — what it is, why it matters, and a TM Forum Customer-domain example.'

  return (
    <Section id="concepts" compact eyebrow="Concept library" title="Speak the language of the Grid" lead={lead}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map((c, i) => {
          const open = openId === c.id
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={`overflow-hidden rounded-xl border border-[var(--color-line)] bg-white ${
                open ? 'ring-1 ring-[var(--color-accent)]/30' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : c.id)}
                className="w-full px-4 py-3 text-left"
              >
                <h3 className="font-display text-sm font-semibold text-[var(--color-foam)]">{c.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-mist)]">{c.what}</p>
              </button>
              {open ? (
                <div className="border-t border-[var(--color-line)] px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brass)]">
                    Why it matters
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-foam)]">{c.why}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-teal)]">
                    {c.exampleLabel}
                  </p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--color-signal)]">{c.example}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`${base}/studio#architecture`} className="btn-ghost px-2.5 py-1 text-[11px]">
                      See in architecture
                    </Link>
                    <Link to={`${base}/semantics`} className="btn-ghost px-2.5 py-1 text-[11px]">
                      See in knowledge graph
                    </Link>
                  </div>
                </div>
              ) : null}
            </motion.article>
          )
        })}
      </div>
    </Section>
  )
}
