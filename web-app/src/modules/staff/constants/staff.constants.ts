import type { ApplicationStatus, StatusTone } from '@shared/types'

import type { ApplicationFilter, WorkflowStage } from '../types/staff.types'

export const STAGE_LABELS: Record<WorkflowStage, string> = {
  REVIEW: 'Review',
  ASSIGNMENT: 'Assignment',
  PROCESSING: 'Processing',
  CLOSED: 'Closed',
}

export const STAGE_TONES: Record<WorkflowStage, StatusTone> = {
  REVIEW: 'info',
  ASSIGNMENT: 'warning',
  PROCESSING: 'info',
  CLOSED: 'success',
}

/** The workflow position each backend status sits in. */
export const STAGE_OF_STATUS: Record<ApplicationStatus, WorkflowStage> = {
  DRAFT: 'REVIEW',
  SUBMITTED: 'REVIEW',
  MANAGER_REVIEW: 'REVIEW',
  QUERY_RAISED: 'REVIEW',
  QUERY_RESOLVED: 'REVIEW',
  READY_FOR_ASSIGNMENT: 'ASSIGNMENT',
  ASSIGNED: 'PROCESSING',
  IN_PROGRESS: 'PROCESSING',
  COMPLETED: 'CLOSED',
  REJECTED: 'CLOSED',
  CANCELLED: 'CLOSED',
}

/** Which statuses a staff member may move an application to next. */
export const NEXT_STATUSES: Record<ApplicationStatus, ApplicationStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['MANAGER_REVIEW', 'CANCELLED'],
  MANAGER_REVIEW: ['QUERY_RAISED', 'READY_FOR_ASSIGNMENT', 'REJECTED'],
  QUERY_RAISED: ['QUERY_RESOLVED', 'CANCELLED'],
  QUERY_RESOLVED: ['MANAGER_REVIEW', 'READY_FOR_ASSIGNMENT'],
  READY_FOR_ASSIGNMENT: ['ASSIGNED', 'QUERY_RAISED'],
  ASSIGNED: ['IN_PROGRESS', 'QUERY_RAISED', 'READY_FOR_ASSIGNMENT'],
  IN_PROGRESS: ['COMPLETED', 'QUERY_RAISED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
}

export const APPLICATION_FILTER_LABELS: Record<ApplicationFilter, string> = {
  ALL: 'All',
  GST: 'GST',
  ITR: 'ITR',
  LOANS: 'Loans',
  OVERDUE: 'Overdue',
  UNASSIGNED: 'Unassigned',
}
