import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DEMO_BASE } from '../data/demo'

const pillars = [
  {
    kicker: 'Marketplace',
    title: 'Discover data products',
    body: 'Self-service discovery for teams and AI — Customer 360 and NATCO sources with clear owners and contracts.',
  },
  {
    kicker: 'Studio',
    title: 'Create and manage',
    body: 'Design products and ODCS contracts. Bind technical assets and ports to certified meaning.',
  },
  {
    kicker: 'Governance',
    title: 'Ensure consistency',
    body: 'Ownership, naming, and federation rules so NATCO variations still roll up to one SID backbone.',
  },
  {
    kicker: 'Semantics',
    title: 'Connect business to data',
    body: 'TM Forum SID ontology with NATCO concepts (Kunde, Kupac, Ügyfél, Klient) federated to global Customer.',
  },
] as const

export function MarketingLanding() {
  return (
    <div className="marketing-shell">
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[color-mix(in_oklab,white_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="flex items-center gap-3 no-underline">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-accent)] shadow-[0_8px_24px_rgba(0,122,255,0.35)]">
              <span className="h-3.5 w-3.5 rounded-sm bg-white" />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-[var(--color-ink)]">
              Enterprise Governance Grid
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-slate)] md:flex">
            <a href="#product" className="no-underline hover:text-[var(--color-ink)]">
              Product
            </a>
            <a href="#semantics" className="no-underline hover:text-[var(--color-ink)]">
              Semantics
            </a>
            <a href="#story" className="no-underline hover:text-[var(--color-ink)]">
              Story
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to={`${DEMO_BASE}/marketplace`} className="btn-accent px-4 py-2.5 text-sm transition-transform hover:translate-y-[-1px]">
              Try 1-Click Demo
            </Link>
          </div>
        </div>
      </header>

      <section id="top" className="marketing-hero-plane relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pb-28 lg:pt-24">
          <div>
            <motion.p
              className="chip-accent mb-5 inline-flex items-center gap-2 px-3 py-1 text-xs tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              NEW: Context graph · TM Forum SID + multi-NATCO federation
            </motion.p>
            <motion.h1
              className="font-display max-w-xl text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-tight text-[var(--color-ink)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              Trust turns data into value
            </motion.h1>
            <motion.p
              className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-slate)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              From raw metadata to AI-ready meaning — products, contracts, tables, and concepts linked in one
              context graph so people and agents share the same Customer across NATCOs.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
            >
              <Link
                to={`${DEMO_BASE}/marketplace`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-white no-underline"
              >
                Try 1-Click Demo
                <span aria-hidden>→</span>
              </Link>
              <p className="text-sm text-[var(--color-slate)]">No registration required</p>
            </motion.div>
            <p className="mt-8 max-w-md text-xs leading-relaxed text-[var(--color-slate)]">
              Demo opens a dedicated workspace — Marketplace, Contracts, Semantics knowledge graph, Studio, and
              Governance — like a live product tenant.
            </p>
          </div>

          <motion.div
            className="panel-card relative p-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="text-xs font-semibold text-[var(--color-ink)]">Customer 360 · context graph</span>
              <span className="chip-accent px-2 py-0.5 text-[10px] uppercase tracking-wider">Live</span>
            </div>
            <div className="space-y-3">
              {[
                ['Product', 'Customer 360', 'implements global/Customer'],
                ['Contract', 'Table + API contracts', 'GOVERNED_BY each output port'],
                ['Table', 'dp.curated.customer_360', 'System → DB → Schema → Columns'],
                ['Concept', 'CustomerIdentification', 'column represents SID property'],
              ].map(([a, b, c], i) => (
                <div
                  key={a}
                  className={`grid grid-cols-[88px_1fr] gap-2 rounded-xl border px-3 py-2.5 ${
                    i === 1
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--color-line)] bg-[var(--color-accent-soft)]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      i === 1 ? 'text-indigo-100' : 'text-[var(--color-accent)]'
                    }`}
                  >
                    {a}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${i === 1 ? 'text-white' : 'text-[var(--color-ink)]'}`}>{b}</p>
                    <p className={`text-xs ${i === 1 ? 'text-indigo-100/85' : 'text-[var(--color-slate)]'}`}>{c}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="product" className="border-t border-[var(--color-line)] bg-[var(--color-paper-soft)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow mb-3">Platform</p>
          <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Marketplace, Studio, Governance, Semantics — one control plane
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {pillars.map((p) => (
              <article key={p.kicker} className="panel-card p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">{p.kicker}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-[var(--color-ink)]">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate)]">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="semantics" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-3">Semantics</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              From raw metadata to AI-ready meaning
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-slate)]">
              Open the same context trusted by analysts, engineers, stewards, and data product owners — concepts
              linked to products, contracts, columns, and policies in one graph.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--color-slate)]">
              <li>· Global namespace · PascalCase SID naming</li>
              <li>· NATCO folders: DE · AT · HR · HU · PL</li>
              <li>· Full pack lineage: System → Column → Concept</li>
            </ul>
            <Link
              to={`${DEMO_BASE}/semantics`}
              className="mt-8 inline-flex text-sm font-semibold text-[var(--color-accent)] no-underline hover:underline"
            >
              Open semantics in demo →
            </Link>
          </div>
          <div className="panel-card bg-[var(--color-accent-soft)] p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-amber)]">Resolve path</p>
            <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-[var(--color-ink-soft)]">{`Kupac (Collibra HR)
  → mapsTo → global/Customer (SID)
  → sameAs ← natco-hr/kupac
  → crm_hr.public.kupac represents both
  → Customer 360 implements SID Customer`}</pre>
          </div>
        </div>
      </section>

      <section
        id="story"
        className="border-t border-[var(--color-line)] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4f46e5] py-16 text-white"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Put your Customer domain under contract</h2>
            <p className="mt-3 max-w-xl text-sm text-indigo-100/75">
              Start the proof-of-concept workspace — all demo details live there, not on this marketing page.
            </p>
          </div>
          <Link
            to={`${DEMO_BASE}/marketplace`}
            className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-accent)] no-underline shadow-lg"
          >
            Start your proof-of-concept →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-line)] bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-[var(--color-slate)]">
          <span>Enterprise Governance Grid · Semantic Control Plane POC</span>
          <Link to={`${DEMO_BASE}/marketplace`} className="font-semibold text-[var(--color-accent)] no-underline">
            Open demo tenant
          </Link>
        </div>
      </footer>
    </div>
  )
}
