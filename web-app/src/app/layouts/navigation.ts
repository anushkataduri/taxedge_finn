import { routePaths } from '@core/config'

export interface NavItem {
  label: string
  to: string
  icon: string
  /** Optional key into the badge map DashboardLayout builds from live data. */
  badgeKey?: 'applications' | 'notifications'
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: routePaths.dashboard, icon: '⌂' },
      { label: 'All Services', to: routePaths.services, icon: '▦' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'GST', to: routePaths.gst.root, icon: '%' },
      { label: 'ITR & TDS', to: routePaths.itr.root, icon: '₹' },
      { label: 'Loans', to: routePaths.loans, icon: '◈' },
      { label: 'Insurance', to: routePaths.insurance, icon: '☂' },
    ],
  },
  {
    title: 'My account',
    items: [
      { label: 'Applications', to: routePaths.applications, icon: '☰', badgeKey: 'applications' },
      { label: 'Document Vault', to: routePaths.documents, icon: '🗎' },
      { label: 'Payments', to: routePaths.payments, icon: '⇄' },
      { label: 'Notifications', to: routePaths.chat, icon: '🔔', badgeKey: 'notifications' },
      { label: 'Support Chat', to: routePaths.support, icon: '💬' },
      { label: 'Profile', to: routePaths.profile, icon: '☺' },
    ],
  },
  {
    title: 'Back office',
    items: [
      { label: 'Admin Dashboard', to: routePaths.staff.dashboard, icon: '📊' },
      { label: 'Applications Desk', to: routePaths.staff.applications, icon: '📄' },
      { label: 'Customers (CRM)', to: routePaths.staff.customers, icon: '👥' },
      { label: 'Staff & Roles', to: routePaths.staff.staffManagement, icon: '🛡️' },
      { label: 'Service Pricing', to: routePaths.staff.pricing, icon: '🏷️' },
      { label: 'Reports', to: routePaths.staff.reports, icon: '📥' },
    ],
  },
]
