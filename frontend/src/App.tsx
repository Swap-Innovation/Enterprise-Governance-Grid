import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MarketingLanding } from './pages/MarketingLanding'
import { DemoLayout } from './pages/DemoLayout'
import { DemoMarketplace } from './pages/DemoMarketplace'
import { DemoContracts } from './pages/DemoContracts'
import { DemoSemantics } from './pages/DemoSemantics'
import { DemoStudio } from './pages/DemoStudio'
import { DemoGovernance } from './pages/DemoGovernance'
import { DemoGuided } from './pages/DemoGuided'
import { DemoStrategicQuestions } from './pages/DemoStrategicQuestions'
import { DEMO_ID } from './data/demo'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<MarketingLanding />} />
        <Route path="/demo" element={<Navigate to={`/demo/${DEMO_ID}/marketplace`} replace />} />
        <Route path="/demo/:demoId" element={<DemoLayout />}>
          <Route index element={<Navigate to="marketplace" replace />} />
          <Route path="marketplace" element={<DemoMarketplace />} />
          <Route path="contracts" element={<DemoContracts />} />
          <Route path="semantics" element={<DemoSemantics />} />
          <Route path="studio" element={<DemoStudio />} />
          <Route path="governance" element={<DemoGovernance />} />
          <Route path="questions" element={<DemoStrategicQuestions />} />
          <Route path="guided" element={<DemoGuided />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
