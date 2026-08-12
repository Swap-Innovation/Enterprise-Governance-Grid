import { motion } from 'framer-motion'
import { usePitchMode } from '../pitch/PitchContext'

export function Hero() {
  const { setMode, startDemo } = usePitchMode()

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32"
    >
      <HeroGrid />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Client pitch · Semantic Control Plane
        </motion.p>

        <motion.h1
          className="font-display max-w-5xl text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-foam)]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Enterprise
          <br />
          Governance
          <br />
          <span className="text-[var(--color-teal)]">Grid</span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-mist)] sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          One enterprise meaning backbone — so Marketplace, NATCOs, and AI share the same
          definition of Customer.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <button
            type="button"
            onClick={startDemo}
            className="inline-flex items-center gap-2 bg-[var(--color-teal)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--color-ink)] transition-transform hover:translate-y-[-1px]"
          >
            1-click guided demo
            <span aria-hidden>→</span>
          </button>
          <a
            href="#contracts"
            className="inline-flex items-center gap-2 border border-[var(--color-line-strong)] px-5 py-3 text-sm font-medium text-[var(--color-foam)] no-underline transition-colors hover:border-[var(--color-brass)] hover:text-[var(--color-brass-bright)]"
          >
            Browse contracts
          </a>
          <a
            href="#context-graph"
            className="inline-flex items-center gap-2 border border-[var(--color-line-strong)] px-5 py-3 text-sm font-medium text-[var(--color-foam)] no-underline transition-colors hover:border-[var(--color-teal)]/60"
          >
            Open KG
          </a>
          <button
            type="button"
            onClick={() => {
              setMode('explore')
              window.location.hash = 'engines'
            }}
            className="inline-flex items-center gap-2 px-2 py-3 text-sm text-[var(--color-mist)] underline-offset-4 hover:text-[var(--color-foam)] hover:underline"
          >
            Architect deep-dive
          </button>
        </motion.div>
      </div>
    </section>
  )
}

function HeroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 60% 40%, black 20%, transparent 75%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
      />
      <motion.div
        className="absolute left-[12%] top-[28%] h-40 w-40 rounded-full bg-[var(--color-teal)]/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[18%] top-[42%] h-48 w-48 rounded-full bg-[var(--color-brass)]/15 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-[45%] w-full opacity-40"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 320 L200 280 L400 300 L600 200 L800 240 L1000 160 L1200 180"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2.2, delay: 0.4, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 360 L180 340 L420 350 L620 280 L820 310 L1040 230 L1200 250"
          fill="none"
          stroke="var(--color-brass)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.4, delay: 0.7, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}
