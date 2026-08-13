import { ContextGraph } from '../components/ContextGraph'

/** Semantics workbench — chrome lives inside ContextGraph to avoid stacked headers. */
export function DemoSemantics() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col">
      <ContextGraph />
    </div>
  )
}
