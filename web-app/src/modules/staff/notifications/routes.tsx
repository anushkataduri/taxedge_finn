import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffNotifications = lazy(() => import('./pages/StaffNotifications/StaffNotifications'))

export const staffNotificationsRoutes: RouteObject[] = [
  { path: routePaths.staff.notifications, element: <StaffNotifications /> },
]
