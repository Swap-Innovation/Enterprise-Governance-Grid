import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function ExamplePanel({
  title,
  badge = 'TM Forum SID',
  children,
}: {
  title: string
  badge?: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className="mt-10 border border-[var(--color-line-strong)] bg-[var(--color-ink-elevated)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-3">
        <p className="font-display text-sm font-bold text-[var(--color-foam)]">{title}</p>
        <span className="border border-[var(--color-brass)]/40 px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--color-brass-bright)]">
          {badge}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}
