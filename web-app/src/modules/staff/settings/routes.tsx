import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffSettings = lazy(() => import('./pages/StaffSettings/StaffSettings'))

export const staffSettingsRoutes: RouteObject[] = [
  { path: routePaths.staff.settings, element: <StaffSettings /> },
]
