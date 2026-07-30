import { motion } from 'framer-motion'
import { useState } from 'react'
import pitch from '../data/pitch-concepts.json'
import { Section } from './Section'

export function ConceptLibrary() {
  const [openId, setOpenId] = useState<string | null>(pitch.concepts[0]?.id ?? null)

  return (
    <Section
      id="concepts"
      eyebrow="04 · Concepts explained"
      title="Speak the language of the Grid"
      lead="Each idea in one breath — what it is, why the client cares, and a TM Forum Customer-domain example. Deep links open architecture or the live graph."
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
              transition={{ delay: i * 0.03 }}
              className={`border text-left transition-colors ${
                open
                  ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/10'
                  : 'border-[var(--color-line)] bg-[var(--color-ink-elevated)] hover:border-[var(--color-line-strong)]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : c.id)}
                className="w-full p-4 text-left"
              >
                <h3 className="font-display text-base font-bold text-[var(--color-foam)]">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mist)]">{c.what}</p>
              </button>
              {open ? (
                <div className="border-t border-[var(--color-line)] px-4 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--color-brass)] uppercase">
                    Why it matters
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-foam)]">{c.why}</p>
                  <p className="mt-4 text-[10px] font-semibold tracking-[0.14em] text-[var(--color-teal)] uppercase">
                    TM Forum example
                  </p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--color-signal)]">
                    {c.example}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={c.archHref}
                      className="border border-[var(--color-line-strong)] px-2.5 py-1 text-[11px] text-[var(--color-foam)] no-underline hover:border-[var(--color-teal)]"
                    >
                      See in architecture
                    </a>
                    <a
                      href={c.graphHref}
                      className="border border-[var(--color-line-strong)] px-2.5 py-1 text-[11px] text-[var(--color-foam)] no-underline hover:border-[var(--color-brass)]"
                    >
                      See in context graph
                    </a>
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
