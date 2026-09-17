import type { Permission } from '@core/auth'
import { routePaths } from '@core/config'

export interface StaffNavItem {
  label: string
  to: string
  icon: string
  permission: Permission
  end?: boolean
}

export interface StaffNavSection {
  title: string
  items: StaffNavItem[]
}

export const staffNavSections: StaffNavSection[] = [
  {
    title: 'Work',
    items: [
      { label: 'Dashboard', to: routePaths.staff.dashboard, icon: '⌂', permission: 'staff.dashboard.view' },
      { label: 'Applications', to: routePaths.staff.applications, icon: '☰', permission: 'applications.view' },
      { label: 'Assignments', to: routePaths.staff.assignments, icon: '⇄', permission: 'assignments.view' },
      { label: 'Documents', to: routePaths.staff.documents, icon: '🗎', permission: 'documents.view' },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'Customers', to: routePaths.staff.customers, icon: '☺', permission: 'customers.view' },
      { label: 'Notifications', to: routePaths.staff.notifications, icon: '✉', permission: 'notifications.view' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Staff management', to: routePaths.staff.staffManagement, icon: '⚑', permission: 'staff.manage' },
      { label: 'Services', to: routePaths.staff.services, icon: '⊞', permission: 'services.manage' },
      { label: 'Pricing', to: routePaths.staff.pricing, icon: '₹', permission: 'pricing.manage' },
      { label: 'Reports', to: routePaths.staff.reports, icon: '◫', permission: 'reports.view' },
      { label: 'Settings', to: routePaths.staff.settings, icon: '⚙', permission: 'settings.manage' },
    ],
  },
]
