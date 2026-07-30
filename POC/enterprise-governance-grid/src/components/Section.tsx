import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = '',
}: {
  id: string
  eyebrow: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-3xl"
        >
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-foam)] sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {lead ? (
            <p className="mt-5 text-base leading-relaxed text-[var(--color-mist)] sm:text-lg">
              {lead}
            </p>
          ) : null}
        </motion.div>
        {children}
      </div>
    </section>
  )
}
