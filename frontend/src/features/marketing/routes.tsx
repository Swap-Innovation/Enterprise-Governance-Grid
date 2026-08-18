import { Navigate, Route } from 'react-router-dom'
import { MarketingLanding } from '../../pages/MarketingLanding'

export function MarketingRoutes() {
  return (
    <>
      <Route path="/" element={<MarketingLanding />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
}
