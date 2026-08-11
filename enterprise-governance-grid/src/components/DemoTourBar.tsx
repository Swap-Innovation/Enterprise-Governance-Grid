import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DEMO_STEPS, usePitchMode } from '../pitch/PitchContext'

export function DemoTourBar() {
  const { demoActive, demoStep, demoStepIndex, nextDemo, prevDemo, stopDemo, goDemoStep } =
    usePitchMode()
  const navigate = useNavigate()
  const location = useLocation()
  const { demoId = 'customer360' } = useParams()

  useEffect(() => {
    if (!demoActive || !demoStep?.route) return
    const target = `/demo/${demoId}/${demoStep.route}`
    if (location.pathname !== target) {
      navigate(target)
    }
    if (demoStep.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(demoStep.hash!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [demoActive, demoStep?.id, demoStep?.route, demoStep?.hash, demoId, navigate, location.pathname])

  if (!demoActive || !demoStep) return null

  const isLast = demoStepIndex >= DEMO_STEPS.length - 1
  const progress = ((demoStepIndex + 1) / DEMO_STEPS.length) * 100

  return (
    <div className="demo-tour-bar fixed inset-x-0 bottom-0 z-[60]">
      <div className="h-0.5 bg-[var(--color-paper-mute)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
            Guided tour · {demoStepIndex + 1} / {DEMO_STEPS.length}
          </p>
          <p className="mt-1 font-display text-base font-semibold tracking-tight text-[var(--color-ink)]">
            {demoStep.title}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--color-slate)]">
            {demoStep.narration}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {DEMO_STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                title={s.title}
                onClick={() => goDemoStep(i)}
                className={`h-1.5 w-5 rounded-full transition-colors ${
                  i === demoStepIndex
                    ? 'bg-[var(--color-accent)]'
                    : i < demoStepIndex
                      ? 'bg-[var(--color-accent-bright)]'
                      : 'bg-[var(--color-line-strong)]'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={prevDemo}
            disabled={demoStepIndex === 0}
            className="btn-ghost px-3 py-2 text-xs disabled:opacity-30"
          >
            Back
          </button>
          {!isLast ? (
            <button type="button" onClick={nextDemo} className="btn-accent px-4 py-2 text-xs">
              Next →
            </button>
          ) : (
            <button type="button" onClick={stopDemo} className="btn-accent px-4 py-2 text-xs">
              Finish
            </button>
          )}
          <button
            type="button"
            onClick={stopDemo}
            className="px-2 py-2 text-xs text-[var(--color-slate)] hover:text-[var(--color-ink)]"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
