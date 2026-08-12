import { DemoPageHeader } from '../components/DemoPageHeader'
import { AnimatedArchitecture } from '../components/AnimatedArchitecture'
import { ConceptLibrary } from '../components/ConceptLibrary'
import { BigIdea } from '../components/BigIdea'

export function DemoStudio() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <DemoPageHeader
        eyebrow="Control plane"
        title="Studio"
        lead="How meaning, mapping, and architecture come together for Customer 360 — from concept library to the interactive spine."
      />
      <div className="panel-card overflow-hidden">
        <BigIdea />
      </div>
      <div className="panel-card overflow-hidden">
        <ConceptLibrary />
      </div>
      <div className="panel-card overflow-hidden">
        <AnimatedArchitecture />
      </div>
    </div>
  )
}
