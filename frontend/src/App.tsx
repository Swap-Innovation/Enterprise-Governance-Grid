import { BrowserRouter, Routes } from 'react-router-dom'
import { DemoRoutes } from './features/demo/routes'
import { MarketingRoutes } from './features/marketing/routes'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        {MarketingRoutes()}
        {DemoRoutes()}
      </Routes>
    </BrowserRouter>
  )
}
