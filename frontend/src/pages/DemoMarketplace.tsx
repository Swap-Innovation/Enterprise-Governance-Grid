import { Link, useParams } from 'react-router-dom'
import { DemoPageHeader } from '../components/DemoPageHeader'
import { semanticsHref, type MarketplaceProduct } from '../data/demo'
import { getProject, marketplaceFamilyGroupsFor } from '../data/projects'
import { usePitchMode } from '../pitch/PitchContext'

function ProductActions({
  p,
  demoId,
  base,
  primary = false,
}: {
  p: MarketplaceProduct
  demoId: string
  base: string
  primary?: boolean
}) {
  const { setContractId, setGraphNodeId } = usePitchMode()
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={semanticsHref(demoId, p.id, p.queryCode)}
        className={primary ? 'btn-accent px-3.5 py-1.5 text-xs' : 'btn-ghost px-3 py-1.5 text-xs'}
        onClick={() => {
          setGraphNodeId(p.id)
          setContractId(p.contract)
        }}
      >
        Open in graph
      </Link>
      <Link
        to={`${base}/contracts`}
        className="btn-ghost px-3 py-1.5 text-xs"
        onClick={() => setContractId(p.contract)}
      >
        Contract
      </Link>
    </div>
  )
}

export function DemoMarketplace() {
  const { demoId = 'udp-dt' } = useParams()
  const project = getProject(demoId)
  const base = `/demo/${project.slug}`
  const groups = marketplaceFamilyGroupsFor(project.products)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <DemoPageHeader
        eyebrow="Catalog"
        title="Discover trusted data products"
        lead={project.marketplaceLead}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-slate)]">
        <span className="chip-live px-2.5 py-1">{groups.length} families</span>
        <span className="chip-accent px-2.5 py-1">{project.code}</span>
        <span className="chip-accent px-2.5 py-1">SDP · ADP · CDP</span>
        <span className="chip-accent px-2.5 py-1">Published</span>
      </div>

      <div className="space-y-6">
        {groups.map(({ family, global, natcos }) => (
          <section key={family.id} className="panel-card overflow-hidden">
            <div className="border-b border-[var(--color-line)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                      {global.name}
                    </h2>
                    <span className="chip-live px-2 py-0.5 text-[10px]">Global</span>
                    <span className="chip-accent px-2 py-0.5 text-[10px]">{global.productClass}</span>
                    <span className="text-[11px] text-[var(--color-slate)]">{global.domain}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate)]">{global.description}</p>
                  <p className="mt-2 text-[12px] text-[var(--color-slate)]">
                    {global.owner} · federates {natcos.length} {project.scopeNoun.toLowerCase()} sources · implements{' '}
                    <span className="font-medium text-[var(--color-ink)]">{global.implements}</span>
                  </p>
                </div>
                <ProductActions p={global} demoId={project.slug} base={base} primary />
              </div>
            </div>

            {natcos.length > 0 ? (
            <div className="bg-[var(--color-paper-soft)] px-5 py-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-slate)]">
                {project.scopeNounPlural}
              </p>
              <div className="divide-y divide-[var(--color-line)] overflow-hidden rounded-xl border border-[var(--color-line)] bg-white">
                {natcos.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--color-ink)]">{p.name}</h3>
                        <span className="rounded-md bg-[var(--color-paper-mute)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ink-soft)]">
                        {p.natco?.replace('natco-', '')}
                        </span>
                        <span className="rounded-md bg-[var(--color-paper-mute)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ink-soft)]">
                          {p.productClass}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-[var(--color-slate)]">{p.description}</p>
                    </div>
                    <ProductActions p={p} demoId={project.slug} base={base} />
                  </div>
                ))}
              </div>
            </div>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 border-t border-[var(--color-line)] pt-5 text-sm">
        <Link to={`${base}/contracts`} className="font-semibold text-[var(--color-ink)] no-underline hover:underline">
          Browse contracts →
        </Link>
        <Link
          to={`${base}/semantics?query=${project.productQueryCode === 'P3' ? 'P1' : 'Q6'}`}
          className="font-semibold text-[var(--color-ink)] no-underline hover:underline"
        >
          All product lineage →
        </Link>
      </div>
    </div>
  )
}
