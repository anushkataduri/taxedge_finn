import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Insurance = lazy(() => import('./pages/Insurance/Insurance'))

export const insuranceRoutes: RouteObject[] = [{ path: routePaths.insurance, element: <Insurance /> }]
