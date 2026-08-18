import { Navigate, Route } from 'react-router-dom'
import { DemoContracts } from '../../pages/DemoContracts'
import { DemoGovernance } from '../../pages/DemoGovernance'
import { DemoGuided } from '../../pages/DemoGuided'
import { DemoLayout } from '../../pages/DemoLayout'
import { DemoMarketplace } from '../../pages/DemoMarketplace'
import { DemoSemanticOptions } from '../../pages/DemoSemanticOptions'
import { DemoSemantics } from '../../pages/DemoSemantics'
import { DemoStrategicQuestions } from '../../pages/DemoStrategicQuestions'
import { DemoStudio } from '../../pages/DemoStudio'
import { DEMO_ID } from '../../data/demo'

export function DemoRoutes() {
  return (
    <>
      <Route path="/demo" element={<Navigate to={`/demo/${DEMO_ID}/marketplace`} replace />} />
      <Route path="/demo/:demoId" element={<DemoLayout />}>
        <Route index element={<Navigate to="marketplace" replace />} />
        <Route path="marketplace" element={<DemoMarketplace />} />
        <Route path="contracts" element={<DemoContracts />} />
        <Route path="semantics" element={<DemoSemantics />} />
        <Route path="options" element={<DemoSemanticOptions />} />
        <Route path="studio" element={<DemoStudio />} />
        <Route path="governance" element={<DemoGovernance />} />
        <Route path="questions" element={<DemoStrategicQuestions />} />
        <Route path="guided" element={<DemoGuided />} />
      </Route>
    </>
  )
}
