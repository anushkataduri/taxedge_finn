/**
 * Public surface of the staff module.
 * The app layer imports staffRoutes; nothing else reaches inside.
 */
export { staffRoutes } from './routes'
export { PermissionRoute, RoleBadge, StaffPageHeader, StatTile, DataTable } from './components'
export type { DataTableColumn } from './components'
export { useStaffApplication, useStaffApplications } from './applications'
export { useStaffDashboard } from './dashboard'
export { useAssignableAgents, useStaffMembers } from './staff-management'
export {
  APPLICATION_FILTERS,
  DEPARTMENTS,
  WORKFLOW_STAGES,
} from './types/staff.types'
export type {
  ApplicationFilter,
  AssignmentRecord,
  StaffApplication,
  StaffApplicationDetail,
  StaffDashboardData,
  StaffMember,
  StaffMemberPayload,
  WorkflowStage,
} from './types/staff.types'
export { NEXT_STATUSES, STAGE_LABELS, STAGE_OF_STATUS } from './constants/staff.constants'
