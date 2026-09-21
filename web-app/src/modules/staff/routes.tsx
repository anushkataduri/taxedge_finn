import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import type { Permission } from '@core/auth'
import { routePaths } from '@core/config'

import { PermissionRoute } from './components/PermissionRoute/PermissionRoute'
import { staffApplicationsRoutes } from './applications'
import { staffAssignmentsRoutes } from './assignments'
import { staffCustomersRoutes } from './customers'
import { staffDashboardRoutes } from './dashboard'
import { staffDocumentsRoutes } from './documents'
import { staffManagementRoutes } from './staff-management'
import { staffNotificationsRoutes } from './notifications'
import { staffPricingRoutes } from './pricing'
import { staffReportsRoutes } from './reports'
import { staffServicesRoutes } from './services-management'
import { staffSettingsRoutes } from './settings'

const gated = (permission: Permission, children: RouteObject[]): RouteObject => ({
  element: <PermissionRoute permission={permission} />,
  children,
})

/**
 * Every staff route, grouped by the permission it needs.
 * app/router wraps this whole set in StaffRoute + StaffLayout.
 */
export const staffRoutes: RouteObject[] = [
  { path: routePaths.staff.root, element: <Navigate to={routePaths.staff.dashboard} replace /> },
  gated('staff.dashboard.view', staffDashboardRoutes),
  gated('applications.view', staffApplicationsRoutes),
  gated('customers.view', staffCustomersRoutes),
  gated('assignments.view', staffAssignmentsRoutes),
  gated('documents.view', staffDocumentsRoutes),
  gated('reports.view', staffReportsRoutes),
  gated('staff.manage', staffManagementRoutes),
  gated('services.manage', staffServicesRoutes),
  gated('pricing.manage', staffPricingRoutes),
  gated('notifications.view', staffNotificationsRoutes),
  gated('settings.manage', staffSettingsRoutes),
]
