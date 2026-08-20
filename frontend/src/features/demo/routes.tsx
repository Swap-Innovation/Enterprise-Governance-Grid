import { Navigate, Route, useLocation } from 'react-router-dom'
import { DemoContracts } from '../../pages/DemoContracts'
import { DemoGovernance } from '../../pages/DemoGovernance'
import { DemoGuided } from '../../pages/DemoGuided'
import { DemoLayout } from '../../pages/DemoLayout'
import { DemoMarketplace } from '../../pages/DemoMarketplace'
import { DemoNamespaces } from '../../pages/DemoNamespaces'
import { DemoSemanticOptions } from '../../pages/DemoSemanticOptions'
import { DemoSemantics } from '../../pages/DemoSemantics'
import { DemoStrategicQuestions } from '../../pages/DemoStrategicQuestions'
import { DemoStudio } from '../../pages/DemoStudio'

function LegacyCustomer360Redirect() {
  const location = useLocation()
  const rest = location.pathname.replace(/^\/demo\/customer360/, '') || '/marketplace'
  return <Navigate to={`/demo/udp-dt${rest}${location.search}${location.hash}`} replace />
}

export function DemoRoutes() {
  return (
    <>
      <Route path="/demo" element={<Navigate to="/demo/udp-dt/marketplace" replace />} />
      <Route path="/demo/customer360" element={<Navigate to="/demo/udp-dt/marketplace" replace />} />
      <Route path="/demo/customer360/*" element={<LegacyCustomer360Redirect />} />
      <Route path="/demo/:demoId" element={<DemoLayout />}>
        <Route index element={<Navigate to="marketplace" replace />} />
        <Route path="marketplace" element={<DemoMarketplace />} />
        <Route path="contracts" element={<DemoContracts />} />
        <Route path="namespaces" element={<DemoNamespaces />} />
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
