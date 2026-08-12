import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import pitch from '../data/examples/pitch-concepts.json'
import { DEMO_BASE } from '../data/demo'
import { Section } from './Section'

export function ConceptLibrary() {
  const [openId, setOpenId] = useState<string | null>(pitch.concepts[0]?.id ?? null)

  return (
    <Section
      id="concepts"
      compact
      eyebrow="Concept library"
      title="Speak the language of the Grid"
      lead="Each idea in one breath — what it is, why it matters, and a TM Forum Customer-domain example."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pitch.concepts.map((c, i) => {
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
                    TM Forum example
                  </p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--color-signal)]">
                    {c.example}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`${DEMO_BASE}/studio#architecture`}
                      className="btn-ghost px-2.5 py-1 text-[11px]"
                    >
                      See in architecture
                    </Link>
                    <Link to={`${DEMO_BASE}/semantics`} className="btn-ghost px-2.5 py-1 text-[11px]">
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
