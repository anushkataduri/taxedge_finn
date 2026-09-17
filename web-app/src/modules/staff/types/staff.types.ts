import type { StaffRole, UserRole } from '@core/auth'
import type {
  ApplicationStatus,
  PaymentStatus,
  ServiceType,
  Timestamped,
} from '@shared/types'

/* ------------------------------------------------------------------ *
 * Workflow
 * ------------------------------------------------------------------ */

export const WORKFLOW_STAGES = ['REVIEW', 'ASSIGNMENT', 'PROCESSING', 'CLOSED'] as const
export type WorkflowStage = (typeof WORKFLOW_STAGES)[number]

/* ------------------------------------------------------------------ *
 * Staff members
 * ------------------------------------------------------------------ */

export const DEPARTMENTS = ['Compliance', 'Lending', 'Insurance', 'Accounts', 'Operations'] as const
export type Department = (typeof DEPARTMENTS)[number]

export interface StaffMember extends Timestamped {
  id: string
  employeeCode: string
  fullName: string
  email: string
  mobile: string
  role: StaffRole
  department: Department
  isActive: boolean
  assignedApplications: number
  joinedOn: string
}

export interface StaffMemberPayload {
  fullName: string
  email: string
  mobile: string
  role: StaffRole
  department: Department
  isActive: boolean
}

/* ------------------------------------------------------------------ *
 * Applications, as staff see them
 * ------------------------------------------------------------------ */

export interface ApplicationCustomer {
  id: string
  name: string
  mobile: string
  email?: string
}

export interface AssignedStaff {
  id: string
  name: string
  role: StaffRole
}

export interface StaffApplication extends Timestamped {
  id: string
  applicationId: string
  customer: ApplicationCustomer
  service: ServiceType
  stage: WorkflowStage
  status: ApplicationStatus
  assignedTo: AssignedStaff | null
  fee: number
  paymentStatus: PaymentStatus
  dueOn: string
  isOverdue: boolean
}

export const ASSIGNMENT_ACTIONS = ['ASSIGNED', 'REASSIGNED', 'CLAIMED', 'UNASSIGNED'] as const
export type AssignmentAction = (typeof ASSIGNMENT_ACTIONS)[number]

/** Assignment history is appended to, never overwritten. */
export interface AssignmentRecord {
  id: string
  action: AssignmentAction
  staffName: string
  staffRole: StaffRole
  actedBy: string
  actedAt: string
  note?: string
}

export interface ApplicationQuery {
  id: string
  message: string
  raisedBy: string
  raisedByRole: UserRole
  raisedAt: string
  isResolved: boolean
  response?: string
  resolvedAt?: string
}

export interface ApplicationNote {
  id: string
  message: string
  author: string
  authorRole: StaffRole
  createdAt: string
}

export interface ApplicationEvent {
  id: string
  status: ApplicationStatus
  actor: string
  occurredAt: string
  note?: string
}

export interface ApplicationDocument {
  id: string
  name: string
  sizeBytes: number
  uploadedBy: string
  uploadedAt: string
  isVerified: boolean
}

export interface StaffApplicationDetail extends StaffApplication {
  timeline: ApplicationEvent[]
  assignmentHistory: AssignmentRecord[]
  queries: ApplicationQuery[]
  notes: ApplicationNote[]
  documents: ApplicationDocument[]
}

export const APPLICATION_FILTERS = ['ALL', 'GST', 'ITR', 'LOANS', 'OVERDUE', 'UNASSIGNED'] as const
export type ApplicationFilter = (typeof APPLICATION_FILTERS)[number]

export interface StaffApplicationFilters {
  filter: ApplicationFilter
  search?: string
  status?: ApplicationStatus
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export interface StaffMetric {
  id: string
  label: string
  value: string
  hint?: string
}

export interface RevenueByService {
  service: ServiceType
  amount: number
}

export interface PipelineStage {
  stage: WorkflowStage
  count: number
}

export interface StaffDashboardData {
  work: StaffMetric[]
  revenue: StaffMetric[]
  revenueByService: RevenueByService[]
  pipeline: PipelineStage[]
  needsAttention: StaffApplication[]
}
