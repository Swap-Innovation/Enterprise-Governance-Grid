import { motion } from 'framer-motion'
import tmforum from '../../../mock-data/tmforum.json'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

export function KnowledgeGraph() {
  return (
    <Section
      id="graph"
      eyebrow="07 · Knowledge graph"
      title="SID context without a second SoR"
      lead="The graph materializes TM Forum relationships for traversal and impact — concept prose stays in the Registry."
    >
      <div className="overflow-hidden border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)]">
        <div className="border-b border-[var(--color-line)] px-6 py-4">
          <p className="eyebrow">Ontology edges · SID pilot</p>
        </div>
        <ul className="divide-y divide-[var(--color-line)]">
          {tmforum.ontologyEdges.map((row, i) => (
            <motion.li
              key={`${row.from}-${row.predicate}-${row.to}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4 text-sm sm:gap-8"
            >
              <span className="font-medium text-[var(--color-foam)]">{row.from}</span>
              <span className="bg-[var(--color-ink)] px-3 py-1 font-mono text-xs text-[var(--color-teal)]">
                —{row.predicate}→
              </span>
              <span className="text-right font-medium text-[var(--color-foam)]">{row.to}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <ExamplePanel title="Crosswalk edges on the same graph">
        <ul className="space-y-3">
          {tmforum.graphWalk.slice(7).map((row) => (
            <li
              key={`${row.from}-${row.edge}`}
              className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-foam)]"
            >
              <span>{row.from}</span>
              <span className="font-mono text-xs text-[var(--color-brass-bright)]">
                —{row.edge}→
              </span>
              <span>{row.to}</span>
            </li>
          ))}
        </ul>
      </ExamplePanel>
    </Section>
  )
}
