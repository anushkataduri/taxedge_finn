import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StaffLayout } from '../layouts/StaffLayout'
import { NotFound } from '../pages/NotFound'

import { routePaths } from '@core/config'
import { applicationsRoutes } from '@modules/applications'
import { authenticationRoutes } from '@modules/authentication'
import { chatRoutes } from '@modules/chat'
import { CustomerTypePage } from '@modules/customerType'
import { dashboardRoutes } from '@modules/dashboard'
import { documentsRoutes } from '@modules/documents'
import { gstRoutes } from '@modules/gst'
import { insuranceRoutes } from '@modules/insurance'
import { itrRoutes } from '@modules/itr'
import { loansRoutes } from '@modules/loans'
import { paymentsRoutes } from '@modules/payments'
import { profileRoutes, CreateProfilePage } from '@modules/profile'
import { servicesRoutes } from '@modules/services'
import { staffRoutes } from '@modules/staff'
import { supportRoutes } from '@modules/support'

import { CustomerRoute } from './CustomerRoute'
import { PublicRoute } from './PublicRoute'
import { StaffRoute } from './StaffRoute'

const authLayoutRoutes = authenticationRoutes.filter(
  (r) =>
    r.path !== routePaths.auth.createProfile &&
    r.path !== routePaths.auth.customerType,
)

/**
 * Modules own their own routes and export them from their barrel;
 * this file only decides which layout and guard wraps each group.
 */
export const routeConfig: RouteObject[] = [
  {
    path: routePaths.root,
    element: <Navigate to={routePaths.auth.login} replace />,
  },
  {
    path: routePaths.registration,
    element: <Navigate to={routePaths.auth.createProfile} replace />,
  },
  {
    path: routePaths.auth.createProfile,
    element: <CreateProfilePage />,
  },
  {
    path: routePaths.customerType,
    element: <CustomerTypePage />,
  },
  {
    path: routePaths.auth.customerType,
    element: <CustomerTypePage />,
  },

  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: authLayoutRoutes,
      },
    ],
  },
  {
    element: <StaffRoute />,
    children: [{ element: <StaffLayout />, children: staffRoutes }],
  },
  {
    element: <CustomerRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to={routePaths.dashboard} replace /> },
          ...dashboardRoutes,
          ...servicesRoutes,
          ...gstRoutes,
          ...itrRoutes,
          ...loansRoutes,
          ...insuranceRoutes,
          ...paymentsRoutes,
          ...documentsRoutes,
          ...applicationsRoutes,
          ...profileRoutes,
          ...chatRoutes,
          ...supportRoutes,
        ],
      },
    ],
  },
  { path: routePaths.notFound, element: <NotFound /> },
]
