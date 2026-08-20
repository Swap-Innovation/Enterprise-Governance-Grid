import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { isProjectDeletable } from '../services/projectsApi'
import { useProjectRegistry } from '../context/ProjectRegistryContext'
import { CreateProjectDialog } from './CreateProjectDialog'
import { DeleteProjectDialog } from './DeleteProjectDialog'

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 0 0 .278 1.477 20.26 20.26 0 0 0 2 .003v.256a.75.75 0 0 0 1.5 0v-.256a20.26 20.26 0 0 0 2-.003.75.75 0 0 0 .278-1.477 41.028 41.028 0 0 0-2.365-.298V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM4.5 4.75a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75h-10.5Zm2.25 2.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ProjectSwitcher() {
  const { demoId = 'udp-dt' } = useParams()
  const { projects, apiAvailable, loading, refreshProjects } = useProjectRegistry()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<(typeof projects)[number] | null>(null)

  const current = projects.find((p) => p.id === demoId || p.slug === demoId) ?? projects[0]

  return (
    <>
      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-line)] bg-white/80 px-3 py-2.5 text-left transition-colors hover:bg-white"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[var(--color-ink)] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                {current?.code ?? demoId}
              </span>
              {apiAvailable ? (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800">
                  API
                </span>
              ) : (
                <span className="rounded-full bg-[var(--color-paper-mute)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--color-slate)]">
                  static
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-[12px] font-medium text-[var(--color-ink)]">{current?.name}</p>
            <p className="truncate text-[10px] text-[var(--color-slate)]">{current?.workspace}</p>
          </div>
          <span className="shrink-0 text-[var(--color-slate)]">{open ? '▴' : '▾'}</span>
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-[var(--color-line)] bg-white shadow-lg">
            <div className="border-b border-[var(--color-line)] px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mist)]">
                Projects {loading ? '· loading…' : `· ${projects.length}`}
              </p>
            </div>
            <ul className="max-h-56 overflow-y-auto p-1">
              {projects.map((p) => {
                const active = p.id === current?.id
                const deletable = isProjectDeletable(p.id)
                return (
                  <li
                    key={p.id}
                    className={`grid items-center gap-1 ${deletable ? 'grid-cols-[28px_minmax(0,1fr)]' : 'grid-cols-1'}`}
                  >
                    {deletable ? (
                      <button
                        type="button"
                        title={`Delete ${p.name}`}
                        aria-label={`Delete ${p.name}`}
                        onClick={() => {
                          setOpen(false)
                          setProjectToDelete(p)
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:border-red-300 hover:bg-red-100"
                      >
                        <DeleteIcon />
                      </button>
                    ) : null}
                    <Link
                      to={`/demo/${p.slug}/marketplace`}
                      onClick={() => setOpen(false)}
                      className={`flex min-w-0 items-start gap-2 rounded-lg px-2 py-2 no-underline transition-colors ${
                        active
                          ? 'bg-[var(--color-paper-mute)] text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-soft)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                          active ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-paper-mute)]'
                        }`}
                      >
                        {p.code}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] font-medium">{p.name}</span>
                        <span className="block truncate text-[10px] opacity-70">{p.workspace}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            {apiAvailable ? (
              <div className="border-t border-[var(--color-line)] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setCreateOpen(true)
                  }}
                  className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-[12px] font-semibold text-[var(--color-teal-dim)] transition-colors hover:bg-[var(--color-paper-soft)]"
                >
                  + New project
                </button>
              </div>
            ) : (
              <p className="border-t border-[var(--color-line)] px-3 py-2 text-[10px] text-[var(--color-slate)]">
                Run <code className="font-mono">npm run dev</code> to enable project API &amp; creation.
              </p>
            )}
          </div>
        ) : null}
      </div>
      <CreateProjectDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <DeleteProjectDialog
        open={projectToDelete != null}
        project={projectToDelete}
        currentDemoId={demoId}
        onClose={() => setProjectToDelete(null)}
        onDeleted={() => void refreshProjects()}
      />
    </>
  )
}
