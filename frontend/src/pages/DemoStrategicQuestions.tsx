import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { DemoPageHeader } from '../components/DemoPageHeader'
import { strategicQuestions, type StrategicQuestion } from '../data/strategicQuestions'

function demoHref(demoId: string, href: string) {
  if (href.startsWith('http') || href.startsWith('/')) return href
  const [path, qs] = href.split('?')
  const base = `/demo/${demoId}/${path}`
  return qs ? `${base}?${qs}` : base
}

function QuestionDetail({ q, demoId }: { q: StrategicQuestion; demoId: string }) {
  return (
    <article className="panel-card min-w-0 flex-1 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-bold tracking-wide text-[var(--color-teal-dim)]">{q.code}</p>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            {q.title}
          </h2>
        </div>
        <span className="rounded-full border border-[var(--color-line)] bg-white/70 px-3 py-1 text-[11px] font-semibold text-[var(--color-slate)]">
          {q.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 text-[12px] sm:grid-cols-2">
        <div className="rounded-lg bg-[var(--color-paper-mute)] px-3 py-2">
          <dt className="font-bold uppercase tracking-wider text-[var(--color-mist)]">Decision</dt>
          <dd className="mt-0.5 text-[var(--color-ink)]">{q.decisionGate}</dd>
        </div>
        <div className="rounded-lg bg-[var(--color-paper-mute)] px-3 py-2">
          <dt className="font-bold uppercase tracking-wider text-[var(--color-mist)]">Owner</dt>
          <dd className="mt-0.5 text-[var(--color-ink)]">{q.owner}</dd>
        </div>
      </dl>

      <section className="mt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">The question</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">{q.question}</p>
      </section>

      <section className="mt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">Why it matters</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">{q.whyItMatters}</p>
      </section>

      <section className="mt-5 rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-4 py-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">
          POC recommendation
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]">{q.recommendation}</p>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">In scope</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ink)]">
            {q.isIn.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--color-accent)]" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">Out of scope</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ink)]">
            {q.isOut.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--color-mist)]" aria-hidden>
                  ×
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {q.detailSections.map((sec) => (
        <section key={sec.heading} className="mt-5 border-t border-[var(--color-line)] pt-4">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">{sec.heading}</h3>
          {sec.paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">
              {p}
            </p>
          ))}
          {sec.bullets?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-slate)]">
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="mt-5 border-t border-[var(--color-line)] pt-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">Evidence</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {q.evidence.map((e) => (
            <li
              key={e}
              className="rounded-full border border-[var(--color-line)] bg-white/80 px-2.5 py-1 text-[11px] text-[var(--color-ink)]"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">Deliverable</h3>
        <p className="mt-2 text-sm text-[var(--color-slate)]">{q.deliverable}</p>
      </section>

      <section className="mt-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-teal-dim)]">Try in this demo</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {q.pocProof.map((p) => (
            <Link
              key={p.href}
              to={demoHref(demoId, p.href)}
              className="btn-ghost px-3 py-1.5 text-[12px] no-underline"
            >
              {p.label} →
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-5 text-[12px] italic text-[var(--color-mist)]">Still open for workstreams: {q.residual}</p>
    </article>
  )
}

export function DemoStrategicQuestions() {
  const { demoId = 'udp-dt' } = useParams()
  const [params, setParams] = useSearchParams()
  const selectedId = (params.get('q') ?? 'sq1').toLowerCase()

  const active = useMemo(() => {
    return (
      strategicQuestions.find((q) => q.id === selectedId || q.code.toLowerCase() === selectedId) ??
      strategicQuestions[0]
    )
  }, [selectedId])

  useEffect(() => {
    if (!params.get('q') && active) {
      setParams({ q: active.code }, { replace: true })
    }
  }, [active, params, setParams])

  const select = (q: StrategicQuestion) => {
    setParams({ q: q.code }, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <DemoPageHeader
        eyebrow="Programme decisions"
        title="Strategic questions SQ1–SQ12"
        lead="POC recommendations for the enterprise semantic layer — definition, system of record, experience, governance, versioning, consumers, and strategy amendments. Open any question; follow Try in this demo for live proof."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="glass-soft w-full shrink-0 overflow-hidden rounded-2xl border border-[var(--color-line)] lg:w-[280px]">
          <div className="border-b border-[var(--color-line)] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-teal-dim)]">Board</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-mist)]">{strategicQuestions.length} questions</p>
          </div>
          <nav className="max-h-[min(70vh,720px)] overflow-y-auto p-1.5" aria-label="Strategic questions">
            {strategicQuestions.map((q) => {
              const on = q.id === active.id
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => select(q)}
                  className={`mb-0.5 w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                    on
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-teal-dim)]'
                      : 'text-[var(--color-ink)] hover:bg-white/50'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold">{q.code}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug font-medium opacity-95">
                    {q.title.replace(/\s*\(.*\)$/, '')}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <QuestionDetail q={active} demoId={demoId} />
      </div>
    </div>
  )
}
