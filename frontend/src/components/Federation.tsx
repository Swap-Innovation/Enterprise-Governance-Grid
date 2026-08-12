import { motion } from 'framer-motion'
import tmforum from '../data/examples/tmforum.json'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

export function Federation() {
  return (
    <Section
      id="federation"
      eyebrow="05 · Multi-NATCO federation"
      title="Global SID backbone, local federation"
      lead="natco-de concepts align to TM Forum–seeded global URIs with sameAs, extends, specializes, and implements."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)] p-6 font-mono text-sm leading-relaxed"
        >
          <pre className="overflow-x-auto whitespace-pre text-[var(--color-foam)]/90">{`Namespace Registry
├── import-tmforum   # SID staging
├── global/          # SID Tier A approved
└── natco-de/        # Kunden, Abonnement…

Marketplace
├── global-customer-360 → global/*
└── natco-de-kunden-360 → global/* + optional natco`}</pre>
        </motion.div>

        <div className="space-y-4">
          {tmforum.federation.map((p, i) => (
            <motion.div
              key={p.from}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border-b border-[var(--color-line)] pb-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-[var(--color-foam)]">{p.label_from}</span>
                <code className="bg-[var(--color-ink-elevated)] px-2 py-0.5 text-xs font-semibold text-[var(--color-teal)]">
                  {p.predicate}
                </code>
                <span className="font-medium text-[var(--color-foam)]">{p.label_to}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-mist)]">{p.note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <ExamplePanel title="Resolve example · Kunde → SID Customer">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--color-signal)]">{`Consumer: "What does Kunden mean for cross-NATCO reporting?"
  1. Resolve → natco-de/kunden
  2. Federation: sameAs → global/customer (SID Customer)
  3. Expand Account · Product · CFS
  4. Product reverse-lookup uses global/customer`}</pre>
      </ExamplePanel>
    </Section>
  )
}
