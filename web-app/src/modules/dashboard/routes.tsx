import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard/CustomerDashboard'))

export const dashboardRoutes: RouteObject[] = [{ path: routePaths.dashboard, element: <CustomerDashboard /> }]
