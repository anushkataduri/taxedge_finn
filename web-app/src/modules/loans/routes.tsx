import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Loans = lazy(() => import('./pages/Loans/Loans'))

export const loansRoutes: RouteObject[] = [{ path: routePaths.loans, element: <Loans /> }]
