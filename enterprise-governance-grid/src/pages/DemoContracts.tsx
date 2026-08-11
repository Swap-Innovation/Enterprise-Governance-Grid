import { DemoPageHeader } from '../components/DemoPageHeader'
import { ContractBrowser } from '../components/ContractBrowser'

export function DemoContracts() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <DemoPageHeader
        eyebrow="Governance assets"
        title="Contracts by scope"
        lead="Browse Global and NATCO folders — Semantics, Business, Technical, and Data Products. Selecting a contract syncs the knowledge graph when a linked node exists."
      />
      <ContractBrowser />
    </div>
  )
}
