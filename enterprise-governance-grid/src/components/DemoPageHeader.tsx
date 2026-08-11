import type { ReactNode } from 'react'

export function DemoPageHeader({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow: string
  title: string
  lead?: string
  actions?: ReactNode
}) {
  return (
    <div className="page-header flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
