import { motion } from 'framer-motion'
import { useState } from 'react'
import { spineLayers } from '../data/content'
import { Section } from './Section'

export function ArchitectureSpine() {
  const [active, setActive] = useState(2)

  return (
    <Section
      id="spine"
      eyebrow="03b · Control plane layers"
      title="From SID sources to consumers"
      lead="Layer detail behind the animation — TM Forum SID and catalogs enter connectors; meaning is governed in the control plane; Marketplace consumes APIs."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-5">
          {spineLayers.map((layer, i) => {
            const isActive = active === i
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`group relative border px-4 py-4 text-left transition-colors ${
                  isActive
                    ? 'highlight' in layer && layer.highlight
                      ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/10'
                      : 'border-[var(--color-brass)]/60 bg-[var(--color-ink-elevated)]'
                    : 'border-[var(--color-line)] bg-transparent hover:border-[var(--color-line-strong)]'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-xs text-[var(--color-mist)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {'highlight' in layer && layer.highlight ? (
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--color-teal)]">
                      SoR · Meaning
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-display text-lg font-bold text-[var(--color-foam)]">
                  {layer.label}
                </p>
              </button>
            )
          })}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative min-h-[320px] border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-6 lg:col-span-7"
        >
          <p className="eyebrow mb-6">Layer detail</p>
          <h3 className="font-display text-2xl font-bold text-[var(--color-foam)]">
            {spineLayers[active].label}
          </h3>
          <div className="mt-8 flex flex-wrap gap-3">
            {spineLayers[active].items.map((item) => (
              <span
                key={item}
                className="border border-[var(--color-line-strong)] bg-[var(--color-ink)] px-3 py-2 text-sm text-[var(--color-foam)]"
              >
                {item}
              </span>
            ))}
          </div>
          <SpineViz active={active} />
        </motion.div>
      </div>
    </Section>
  )
}

function SpineViz({ active }: { active: number }) {
  return (
    <div className="mt-10 flex items-center justify-between gap-1" aria-hidden>
      {spineLayers.map((_, i) => (
        <div key={i} className="flex flex-1 items-center">
          <motion.div
            className={`h-2 w-full ${
              i === active
                ? 'bg-[var(--color-teal)]'
                : i < active
                  ? 'bg-[var(--color-teal-dim)]/60'
                  : 'bg-[var(--color-ink-soft)]'
            }`}
            layout
          />
        </div>
      ))}
    </div>
  )
}
