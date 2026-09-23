import type { RouteObject } from 'react-router-dom'
import { CustomerTypePage } from './components/CustomerTypePage/CustomerTypePage'
import { routePaths } from '@core/config'

export const customerTypeRoutes: RouteObject[] = [
  {
    path: routePaths.customerType,
    element: <CustomerTypePage />,
  },
]
