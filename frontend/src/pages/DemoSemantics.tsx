import { DemoPageHeader } from '../components/DemoPageHeader'
import { ContextGraph } from '../components/ContextGraph'

export function DemoSemantics() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <DemoPageHeader
        eyebrow="Lineage workbench"
        title="Knowledge graph"
        lead="Explore how products, contracts, tables, and concepts connect. Click a node to focus its neighborhood; use the trail to go back."
      />
      <ContextGraph />
    </div>
  )
}
