import { useParams } from 'react-router-dom'
import { DemoPageHeader } from '../components/DemoPageHeader'
import { Governance } from '../components/Governance'
import { Ownership } from '../components/Ownership'
import { Outcomes } from '../components/Outcomes'
import { Problem } from '../components/Problem'
import { getProject } from '../data/projects'
import { PATTERN_GOVERNANCE } from '../data/patternCopy'

export function DemoGovernance() {
  const { demoId } = useParams()
  const project = getProject(demoId)
  const lead =
    project.id === 'udp-pattern'
      ? PATTERN_GOVERNANCE.lead
      : 'Why Customer means one thing across NATCOs — the fracture, ownership model, policies, and the pilot outcome.'

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <DemoPageHeader eyebrow="Operating model" title="Governance" lead={lead} />
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
