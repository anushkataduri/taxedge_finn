import type { UserRole } from './authTypes'

/** Every capability the staff side gates on. */
export const PERMISSIONS = [
  'staff.dashboard.view',
  'applications.view',
  'applications.review',
  'applications.assign',
  'applications.stage.update',
  'applications.query',
  'customers.view',
  'assignments.view',
  'assignments.claim',
  'documents.view',
  'reports.view',
  'staff.manage',
  'services.manage',
  'pricing.manage',
  'notifications.view',
  'settings.manage',
] as const
export type Permission = (typeof PERMISSIONS)[number]

const ALL: Permission[] = [...PERMISSIONS]

const MANAGER: Permission[] = [
  'staff.dashboard.view',
  'applications.view',
  'applications.review',
  'applications.assign',
  'applications.stage.update',
  'applications.query',
  'customers.view',
  'assignments.view',
  'documents.view',
  'reports.view',
  'notifications.view',
]

const AGENT: Permission[] = [
  'staff.dashboard.view',
  'applications.view',
  'applications.stage.update',
  'applications.query',
  'customers.view',
  'assignments.view',
  'assignments.claim',
  'documents.view',
  'notifications.view',
]

/**
 * Frontend permission map — for navigation and UX only.
 * The backend enforces authorization independently.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [],
  SUPER_ADMIN: ALL,
  ADMIN: ALL.filter((permission) => permission !== 'settings.manage'),
  MANAGER: MANAGER,
  GST_AGENT: AGENT,
  ITR_AGENT: AGENT,
  LOAN_AGENT: AGENT,
  INSURANCE_AGENT: AGENT,
  REGISTRATION_AGENT: AGENT,
  ACCOUNTS_AGENT: AGENT,
}

export const permissionsFor = (role: UserRole): Permission[] => ROLE_PERMISSIONS[role] ?? []

export const roleHasPermission = (role: UserRole, permission: Permission): boolean =>
  permissionsFor(role).includes(permission)
