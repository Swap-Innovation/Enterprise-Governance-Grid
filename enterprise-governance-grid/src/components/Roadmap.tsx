import { motion } from 'framer-motion'
import { foundation, roadmapPhases } from '../data/content'
import { Section } from './Section'

const statusStyle = {
  done: 'text-[var(--color-teal)] border-[var(--color-teal)]/40',
  next: 'text-[var(--color-brass-bright)] border-[var(--color-brass)]/50',
  planned: 'text-[var(--color-mist)] border-[var(--color-line-strong)]',
}

export function Roadmap() {
  return (
    <>
      <Section
        id="roadmap"
        eyebrow="10 · Delivery sequence · SID MVP"
        title="MVP first, intelligence last"
        lead="Prove one domain / one NATCO: registry + namespace, mappings, federation, Marketplace APIs, Ossie export — then expand."
      >
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-line-strong)] sm:left-1/2" />
          <ol className="space-y-8">
            {roadmapPhases.map((phase, i) => {
              const left = i % 2 === 0
              return (
                <motion.li
                  key={phase.phase}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex ${left ? 'sm:justify-start' : 'sm:justify-end'}`}
                >
                  <div
                    className={`ml-10 w-full max-w-md border border-[var(--color-line)] bg-[var(--color-ink-elevated)] p-5 sm:ml-0 ${
                      left ? 'sm:mr-[calc(50%+1.5rem)]' : 'sm:ml-[calc(50%+1.5rem)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-2xl font-bold text-[var(--color-foam)]">
                        Phase {phase.phase}
                      </span>
                      <span
                        className={`border px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${statusStyle[phase.status]}`}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-lg font-bold text-[var(--color-teal)]">
                      {phase.title}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-mist)]">{phase.focus}</p>
                  </div>
                  <span className="absolute left-4 top-6 h-2.5 w-2.5 -translate-x-1/2 bg-[var(--color-brass)] sm:left-1/2" />
                </motion.li>
              )
            })}
          </ol>
        </div>
      </Section>

      <Section
        id="foundation"
        eyebrow="11 · Foundation platform"
        title="Runtime under the grid"
        lead="Transactional registry, graph store, vectors, cache, events, packages, IAM, and observability."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {foundation.map((f, i) => (
            <motion.div
              key={f.service}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="border border-[var(--color-line)] bg-[var(--color-ink-elevated)] p-4"
            >
              <p className="font-display text-base font-bold text-[var(--color-foam)]">
                {f.service}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-mist)]">{f.role}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  )
}
