import { NavLink, Outlet, Link, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PitchProvider, usePitchMode } from '../pitch/PitchContext'
import { DemoTourBar } from '../components/DemoTourBar'
import { ProjectSwitcher } from '../components/ProjectSwitcher'
import { ProjectRegistryProvider, useProjectRegistry } from '../context/ProjectRegistryContext'
import { resolveProjectId } from '../data/projects'

const NAV_KEY = 'egg-demo-nav-hidden'

function DemoChrome() {
  const { demoId = 'udp-dt' } = useParams()
  const { projects } = useProjectRegistry()
  const project =
    projects.find((p) => p.slug === demoId || p.id === resolveProjectId(demoId)) ?? projects[0]
  const { demoActive, startDemo } = usePitchMode()
  const location = useLocation()
  const base = `/demo/${project.slug}`
  const segment = location.pathname.split('/').pop() ?? 'marketplace'
  const page = project.pageSubtitles[segment] ?? {
    title: 'Demo workspace',
    subtitle: project.workspace,
  }
  const projectDemoNav = project.nav.filter((item) =>
    ['marketplace', 'contracts', 'namespaces', 'semantics'].includes(item.to),
  )
  const architectureNav = project.nav.filter(
    (item) => !['marketplace', 'contracts', 'namespaces', 'semantics'].includes(item.to),
  )
  const inProjectDemoSection = projectDemoNav.some((item) => item.to === segment)
  const inArchitectureSection = architectureNav.some((item) => item.to === segment)

  const [navHidden, setNavHidden] = useState(() => {
    try {
      return localStorage.getItem(NAV_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(NAV_KEY, navHidden ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [navHidden])

  return (
    <div className={`demo-app liquid-bg flex min-h-screen ${demoActive ? 'pb-40' : ''}`}>
      {!navHidden ? (
        <aside className="demo-sidebar sticky top-0 flex h-screen w-[248px] shrink-0 flex-col">
          <div className="border-b border-[var(--color-line)] px-4 py-5">
            <div className="flex items-start justify-between gap-2">
              <Link
                to="/"
                className="text-[11px] font-medium text-[var(--color-slate)] no-underline transition-colors hover:text-[var(--color-ink)]"
              >
                ← Marketing site
              </Link>
              <button
                type="button"
                onClick={() => setNavHidden(true)}
                className="tool-btn px-2 py-0.5 text-[10px]"
                title="Hide navigation"
              >
                Hide
              </button>
            </div>
            <p className="mt-4 font-display text-[15px] font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
              Enterprise Governance Grid
            </p>
            <ProjectSwitcher />
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 p-2.5">
            {!inArchitectureSection ? (
              <>
                <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-mist)]">
                  Project Demo
                </p>
                {projectDemoNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={`${base}/${item.to}`}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2.5 no-underline transition-colors ${
                        isActive
                          ? 'nav-active'
                          : 'text-[var(--color-ink-soft)] hover:bg-white/45 hover:text-[var(--color-ink)]'
                      }`
                    }
                  >
                    <span className="block text-[13px] font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-[11px] opacity-70">{item.hint}</span>
                  </NavLink>
                ))}
              </>
            ) : null}
            {!inProjectDemoSection ? (
              <>
                <p className="mt-3 px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-mist)]">
                  Architecture of Enterprise Governance Grid
                </p>
                {architectureNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={`${base}/${item.to}`}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2.5 no-underline transition-colors ${
                        isActive
                          ? 'nav-active'
                          : 'text-[var(--color-ink-soft)] hover:bg-white/45 hover:text-[var(--color-ink)]'
                      }`
                    }
                  >
                    <span className="block text-[13px] font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-[11px] opacity-70">{item.hint}</span>
                  </NavLink>
                ))}
              </>
            ) : null}
          </nav>
          <div className="border-t border-[var(--color-line)] p-4 text-[11px] leading-relaxed text-[var(--color-slate)]">
            {project.footer}
          </div>
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="demo-topbar sticky top-0 z-40 flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {navHidden ? (
              <button
                type="button"
                onClick={() => setNavHidden(false)}
                className="tool-btn shrink-0"
                title="Show navigation"
              >
                ☰ Nav
              </button>
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">{page.title}</p>
              <p className="truncate text-[12px] text-[var(--color-slate)]">{page.subtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!navHidden ? (
              <button
                type="button"
                onClick={() => setNavHidden(true)}
                className="btn-ghost hidden px-3 py-1.5 text-xs sm:inline-flex"
                title="Hide side navigation for a wider canvas"
              >
                Hide nav
              </button>
            ) : null}
            <button type="button" onClick={() => startDemo()} className="btn-accent px-4 py-2 text-xs">
              Start guided tour
            </button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
        <DemoTourBar />
      </div>
    </div>
  )
}

function DemoLayoutInner() {
  const { demoId = 'udp-dt' } = useParams()
  const { projects } = useProjectRegistry()
  const project =
    projects.find((p) => p.slug === demoId || p.id === resolveProjectId(demoId)) ?? projects[0]
  return (
    <PitchProvider steps={project.tourSteps}>
      <DemoChrome />
    </PitchProvider>
  )
}

export function DemoLayout() {
  return (
    <ProjectRegistryProvider>
      <DemoLayoutInner />
    </ProjectRegistryProvider>
  )
}
