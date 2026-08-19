import { Link, useParams } from 'react-router-dom'
import { DemoPageHeader } from '../components/DemoPageHeader'
import { getProject } from '../data/projects'
import { usePitchMode } from '../pitch/PitchContext'

export function DemoGuided() {
  const { demoId = 'udp-dt' } = useParams()
  const project = getProject(demoId)
  const { startDemo, demoActive, demoStepIndex, tourLength } = usePitchMode()
  const base = `/demo/${project.slug}`

  return (
    <div className="mx-auto w-full max-w-3xl">
      <DemoPageHeader
        eyebrow="Walkthrough"
        title={`Guided ${project.code} tour`}
        lead={project.tagline}
        actions={
          <button type="button" onClick={() => startDemo()} className="btn-accent px-5 py-2.5 text-sm">
            {demoActive ? 'Restart tour' : 'Start tour'}
          </button>
        }
      />

      {demoActive ? (
        <p className="mb-6 rounded-xl border border-[var(--color-line)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-teal-dim)]">
          Tour running · step {demoStepIndex + 1} of {tourLength}. Use the bar at the bottom to move
          between steps.
        </p>
      ) : null}

      <ol className="space-y-3">
        {project.tourSteps.map((s, i) => (
          <li key={s.id} className="panel-card flex gap-4 p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-paper-mute)] text-sm font-semibold text-[var(--color-ink)]">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate)]">{s.narration}</p>
              <Link
                to={`${base}/${s.route}${s.hash ? `#${s.hash}` : ''}`}
                className="mt-2 inline-block text-[13px] font-semibold text-[var(--color-ink)] no-underline hover:underline"
              >
                Preview {s.route} →
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
