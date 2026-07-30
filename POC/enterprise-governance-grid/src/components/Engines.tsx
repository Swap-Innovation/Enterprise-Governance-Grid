import { motion } from 'framer-motion'
import { useState } from 'react'
import { engines } from '../data/content'
import tmforum from '../data/tmforum.json'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

const exampleByEngine: Record<string, { title: string; example: string }> =
  tmforum.engineExamples

export function Engines() {
  const [selected, setSelected] = useState(0)
  const engine = engines[selected]
  const example = exampleByEngine[engine.id]

  return (
    <Section
      id="engines"
      eyebrow="04 · Control plane engines"
      title="Seven engines on one grid"
      lead="Each engine is illustrated with a TM Forum SID Customer / Product / Service example from the pilot pack."
    >
      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {engines.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setSelected(i)}
            className={`aspect-square border p-3 text-left transition-all ${
              selected === i
                ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/15'
                : 'border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            }`}
          >
            <span className="font-mono text-[10px] text-[var(--color-brass)]">{e.tag}</span>
            <p className="mt-2 font-display text-xs font-bold leading-tight text-[var(--color-foam)] sm:text-sm">
              {e.name}
            </p>
          </button>
        ))}
      </div>

      <motion.div
        key={engine.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-8 border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-6 sm:p-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <p className="eyebrow mb-3">{engine.tag}</p>
          <h3 className="font-display text-3xl font-bold text-[var(--color-foam)]">
            {engine.name}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-mist)]">
            {engine.summary}
          </p>
        </div>
        <ul className="space-y-3 lg:col-span-5">
          {engine.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 border-b border-[var(--color-line)] pb-3 text-sm text-[var(--color-foam)]"
            >
              <span className="h-px w-6 bg-[var(--color-teal)]" />
              {point}
            </li>
          ))}
        </ul>
      </motion.div>

      {example ? (
        <ExamplePanel title={`Example · ${example.title}`}>
          <p className="text-sm leading-relaxed text-[var(--color-foam)]">{example.example}</p>
          {engine.id === 'registry' ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tmforum.concepts.slice(0, 6).map((c) => (
                <div key={c.concept_id} className="border border-[var(--color-line)] bg-[var(--color-ink)] p-3">
                  <p className="font-mono text-[10px] text-[var(--color-brass)]">{c.sid_domain}</p>
                  <p className="mt-1 font-display text-sm font-bold text-[var(--color-foam)]">{c.label}</p>
                  <p className="mt-1 font-mono text-[10px] text-[var(--color-mist)]">{c.concept_id}</p>
                </div>
              ))}
            </div>
          ) : null}
        </ExamplePanel>
      ) : null}
    </Section>
  )
}
