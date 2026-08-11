import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = '',
  compact = false,
}: {
  id: string
  eyebrow: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
  /** Dense padding for embedding inside demo product pages */
  compact?: boolean
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 ${compact ? 'py-6 sm:py-8' : 'py-20 sm:py-28'} ${className}`}
    >
      <div className={`mx-auto ${compact ? 'max-w-none px-5 sm:px-6' : 'max-w-7xl px-6'}`}>
        <motion.div
          initial={{ opacity: 0, y: compact ? 8 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: compact ? '-20px' : '-80px' }}
          transition={{ duration: compact ? 0.35 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`mb-8 max-w-3xl ${compact ? 'mb-5' : 'mb-12'}`}
        >
          <p className={`eyebrow ${compact ? 'mb-2' : 'mb-4'}`}>{eyebrow}</p>
          <h2
            className={`font-display font-bold tracking-tight text-[var(--color-foam)] ${
              compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'
            }`}
          >
            {title}
          </h2>
          {lead ? (
            <p
              className={`leading-relaxed text-[var(--color-mist)] ${
                compact ? 'mt-2 text-sm' : 'mt-5 text-base sm:text-lg'
              }`}
            >
              {lead}
            </p>
          ) : null}
        </motion.div>
        {children}
      </div>
    </section>
  )
}
