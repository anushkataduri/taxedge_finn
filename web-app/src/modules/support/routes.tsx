import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Support = lazy(() => import('./pages/Support/Support'))

export const supportRoutes: RouteObject[] = [{ path: routePaths.support, element: <Support /> }]
