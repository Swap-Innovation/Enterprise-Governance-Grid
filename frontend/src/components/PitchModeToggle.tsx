import { usePitchMode } from '../pitch/PitchContext'

export function PitchModeToggle() {
  const { mode, setMode } = usePitchMode()

  return (
    <div className="inline-flex border border-[var(--color-line-strong)] p-0.5">
      <button
        type="button"
        onClick={() => setMode('pitch')}
        className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
          mode === 'pitch'
            ? 'bg-[var(--color-teal)] text-[var(--color-ink)]'
            : 'text-[var(--color-mist)] hover:text-[var(--color-foam)]'
        }`}
      >
        Pitch
      </button>
      <button
        type="button"
        onClick={() => setMode('explore')}
        className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
          mode === 'explore'
            ? 'bg-[var(--color-brass)] text-[var(--color-ink)]'
            : 'text-[var(--color-mist)] hover:text-[var(--color-foam)]'
        }`}
      >
        Explore
      </button>
    </div>
  )
}
