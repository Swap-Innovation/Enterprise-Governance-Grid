import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PitchModeToggle } from './PitchModeToggle'
import { usePitchMode } from '../pitch/PitchContext'

const pitchNav = [
  { id: 'problem', label: 'Problem' },
  { id: 'idea', label: 'Idea' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'concepts', label: 'Concepts' },
  { id: 'architecture', label: 'How it works' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'context-graph', label: 'KG' },
  { id: 'outcomes', label: 'Ask' },
] as const

const exploreNav = [
  { id: 'problem', label: 'Problem' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'context-graph', label: 'Graph' },
  { id: 'engines', label: 'Engines' },
  { id: 'federation', label: 'Federation' },
  { id: 'mapping', label: 'Mapping' },
  { id: 'apis', label: 'APIs' },
  { id: 'governance', label: 'Governance' },
  { id: 'roadmap', label: 'Roadmap' },
] as const

export function Nav() {
  const { mode, startDemo, demoActive } = usePitchMode()
  const [scrolled, setScrolled] = useState(false)
  const items = mode === 'pitch' ? pitchNav : exploreNav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_88%,transparent)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="group flex min-w-0 items-center gap-3 no-underline">
          <span className="grid h-8 w-8 shrink-0 place-items-center border border-[var(--color-teal)]/50 bg-[var(--color-ink-elevated)]">
            <span className="h-3 w-3 bg-[var(--color-brass)] transition-transform group-hover:scale-110" />
          </span>
          <span className="truncate font-display text-sm font-bold tracking-wide text-[var(--color-foam)] sm:text-base">
            Enterprise Governance Grid
          </span>
        </a>
        <nav className="hidden items-center gap-1 xl:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-2 py-1.5 text-xs font-medium tracking-wide text-[var(--color-mist)] no-underline transition-colors hover:text-[var(--color-teal)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          {!demoActive ? (
            <button
              type="button"
              onClick={startDemo}
              className="hidden border border-[var(--color-teal)]/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-teal)] sm:inline-flex"
            >
              Demo
            </button>
          ) : null}
          <PitchModeToggle />
        </div>
      </div>
    </motion.header>
  )
}
