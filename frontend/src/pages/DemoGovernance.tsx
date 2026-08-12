import { DemoPageHeader } from '../components/DemoPageHeader'
import { Governance } from '../components/Governance'
import { Ownership } from '../components/Ownership'
import { Outcomes } from '../components/Outcomes'
import { Problem } from '../components/Problem'

export function DemoGovernance() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <DemoPageHeader
        eyebrow="Operating model"
        title="Governance"
        lead="Why Customer means one thing across NATCOs — the fracture, ownership model, policies, and the pilot outcome."
      />
      <div className="panel-card overflow-hidden">
        <Problem />
      </div>
      <div className="panel-card overflow-hidden">
        <Ownership />
      </div>
      <div className="panel-card overflow-hidden">
        <Governance />
      </div>
      <div className="panel-card overflow-hidden">
        <Outcomes />
      </div>
    </div>
  )
}
