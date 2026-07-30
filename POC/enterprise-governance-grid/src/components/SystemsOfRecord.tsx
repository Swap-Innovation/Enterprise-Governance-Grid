import { motion } from 'framer-motion'
import { sorMatrix } from '../data/content'
import { Section } from './Section'

const roleColor: Record<string, string> = {
  SoR: 'text-[var(--color-teal)] border-[var(--color-teal)]/40',
  Source: 'text-[var(--color-brass-bright)] border-[var(--color-brass)]/40',
  Exchange: 'text-[var(--color-signal)] border-[var(--color-signal)]/40',
}

export function SystemsOfRecord() {
  return (
    <Section
      id="sor"
      eyebrow="02 · Systems of record"
      title="Who owns what — frozen boundaries"
      lead="DA-01 locks the SoR matrix so catalogs, Marketplace, Control Plane, and OSSIE never compete for the same truth."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line-strong)]">
              <th className="pb-3 pr-4 font-medium text-[var(--color-mist)]">Capability</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-mist)]">Owner</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-mist)]">Role</th>
              <th className="pb-3 font-medium text-[var(--color-mist)]">Note</th>
            </tr>
          </thead>
          <tbody>
            {sorMatrix.map((row, i) => (
              <motion.tr
                key={row.capability}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-[var(--color-line)] align-top"
              >
                <td className="py-4 pr-4 font-semibold text-[var(--color-foam)]">
                  {row.capability}
                </td>
                <td className="py-4 pr-4 text-[var(--color-foam)]">{row.owner}</td>
                <td className="py-4 pr-4">
                  <span
                    className={`inline-block border px-2 py-0.5 text-xs font-semibold tracking-wider ${roleColor[row.role]}`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="py-4 text-[var(--color-mist)]">{row.note}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
