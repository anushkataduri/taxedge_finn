import type { RouteObject } from 'react-router-dom'
import { AllServicesPage } from '../pages/AllServicesPage/AllServicesPage'

export const servicesRoutes: RouteObject[] = [
  {
    path: '/services',
    element: <AllServicesPage />,
  },
  {
    path: '/all-services',
    element: <AllServicesPage />,
  },
]
