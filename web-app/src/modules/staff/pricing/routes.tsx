import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffPricing = lazy(() => import('./pages/StaffPricing/StaffPricing'))

export const staffPricingRoutes: RouteObject[] = [
  { path: routePaths.staff.pricing, element: <StaffPricing /> },
]
