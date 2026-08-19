import { motion } from 'framer-motion'
import tmforum from '../../../mock-data/tmforum.json'
import { ExamplePanel } from './ExamplePanel'
import { Section } from './Section'

export function Apis() {
  return (
    <Section
      id="apis"
      eyebrow="09 · Runtime surface"
      title="Headless APIs on SID URIs"
      lead="Every call in the POC uses TM Forum–aligned concepts — Customer, ProductOffering, CustomerFacingService."
    >
      <ExamplePanel title="Worked API calls · SID pilot">
        <ul className="space-y-4">
          {tmforum.apiExamples.map((api, i) => (
            <motion.li
              key={api.call}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-[var(--color-line)] pb-4 last:border-0"
            >
              <p className="text-xs font-semibold tracking-wide text-[var(--color-brass)] uppercase">
                {api.api}
              </p>
              <code className="mt-2 block overflow-x-auto font-mono text-sm text-[var(--color-teal)]">
                {api.call}
              </code>
              <p className="mt-2 text-sm text-[var(--color-mist)]">{api.result}</p>
            </motion.li>
          ))}
        </ul>
      </ExamplePanel>
    </Section>
  )
}
