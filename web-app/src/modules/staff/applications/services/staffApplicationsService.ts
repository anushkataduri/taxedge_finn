import type { AuthUser, StaffRole } from '@core/auth'
import { env } from '@core/config'
import { AppError } from '@core/errors'
import type { ApplicationStatus } from '@shared/types'

import { STAGE_OF_STATUS } from '../../constants/staff.constants'
import { buildDetail, mockApplications, mockStaff } from '../../services/mockData'
import type {
  StaffApplication,
  StaffApplicationDetail,
  StaffApplicationFilters,
} from '../../types/staff.types'
import { staffApplicationsApi } from '../api/staffApplicationsApi'

/* Development mocks - delete once the API is live. */
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const store = new Map<string, StaffApplicationDetail>(
  mockApplications.map((application) => [application.id, buildDetail(application)]),
)
const nextId = () => `tmp_${Date.now()}_${Math.round(Math.random() * 1000)}`

const matches = (application: StaffApplication, filters?: StaffApplicationFilters): boolean => {
  if (!filters) return true

  switch (filters.filter) {
    case 'GST':
      if (application.service !== 'GST') return false
      break
    case 'ITR':
      if (application.service !== 'ITR') return false
      break
    case 'LOANS':
      if (application.service !== 'LOAN') return false
      break
    case 'OVERDUE':
      if (!application.isOverdue) return false
      break
    case 'UNASSIGNED':
      if (application.assignedTo) return false
      break
    default:
      break
  }

  if (filters.status && application.status !== filters.status) return false

  if (filters.search) {
    const needle = filters.search.toLowerCase()
    return (
      application.applicationId.toLowerCase().includes(needle) ||
      application.customer.name.toLowerCase().includes(needle) ||
      (application.assignedTo?.name.toLowerCase().includes(needle) ?? false)
    )
  }

  return true
}

const touch = (detail: StaffApplicationDetail, status: ApplicationStatus): StaffApplicationDetail => ({
  ...detail,
  status,
  stage: STAGE_OF_STATUS[status],
  updatedAt: new Date().toISOString(),
})

export const staffApplicationsService = {
  async list(filters?: StaffApplicationFilters): Promise<StaffApplication[]> {
    if (env.enableMocks) {
      await delay()
      return [...store.values()]
        .filter((application) => matches(application, filters))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map(({ timeline: _t, assignmentHistory: _a, queries: _q, notes: _n, documents: _d, ...rest }) => rest)
    }
    const response = await staffApplicationsApi.list(filters)
    return response.data
  },

  async detail(id: string): Promise<StaffApplicationDetail> {
    if (env.enableMocks) {
      await delay(250)
      const found = store.get(id)
      if (!found) throw new AppError('That application no longer exists.', { kind: 'notFound' })
      return found
    }
    return staffApplicationsApi.detail(id)
  },

  async assign(id: string, staffId: string | null, actor: AuthUser, note?: string): Promise<StaffApplicationDetail> {
    if (env.enableMocks) {
      await delay(400)
      const current = store.get(id)
      if (!current) throw new AppError('That application no longer exists.', { kind: 'notFound' })

      const member = staffId ? mockStaff.find((m) => m.id === staffId) : undefined
      if (staffId && !member) throw new AppError('That staff member was not found.', { kind: 'notFound' })

      const wasAssigned = Boolean(current.assignedTo)
      const isSelfClaim = member?.id === actor.id
      const updated: StaffApplicationDetail = {
        ...touch(current, member ? 'ASSIGNED' : 'READY_FOR_ASSIGNMENT'),
        assignedTo: member ? { id: member.id, name: member.fullName, role: member.role } : null,
        assignmentHistory: [
          ...current.assignmentHistory,
          {
            id: nextId(),
            action: member ? (isSelfClaim ? 'CLAIMED' : wasAssigned ? 'REASSIGNED' : 'ASSIGNED') : 'UNASSIGNED',
            staffName: member?.fullName ?? current.assignedTo?.name ?? '—',
            staffRole: (member?.role ?? current.assignedTo?.role ?? 'MANAGER') as StaffRole,
            actedBy: actor.fullName,
            actedAt: new Date().toISOString(),
            note,
          },
        ],
      }
      store.set(id, updated)
      return updated
    }
    return staffApplicationsApi.assign(id, staffId, note)
  },

  async changeStatus(id: string, status: ApplicationStatus, actor: AuthUser, note?: string): Promise<StaffApplicationDetail> {
    if (env.enableMocks) {
      await delay(400)
      const current = store.get(id)
      if (!current) throw new AppError('That application no longer exists.', { kind: 'notFound' })

      const updated: StaffApplicationDetail = {
        ...touch(current, status),
        timeline: [
          ...current.timeline,
          { id: nextId(), status, actor: actor.fullName, occurredAt: new Date().toISOString(), note },
        ],
      }
      store.set(id, updated)
      return updated
    }
    return staffApplicationsApi.changeStatus(id, status, note)
  },

  async raiseQuery(id: string, message: string, actor: AuthUser): Promise<StaffApplicationDetail> {
    if (env.enableMocks) {
      await delay(400)
      const current = store.get(id)
      if (!current) throw new AppError('That application no longer exists.', { kind: 'notFound' })

      const updated: StaffApplicationDetail = {
        ...touch(current, 'QUERY_RAISED'),
        queries: [
          ...current.queries,
          {
            id: nextId(),
            message,
            raisedBy: actor.fullName,
            raisedByRole: actor.role,
            raisedAt: new Date().toISOString(),
            isResolved: false,
          },
        ],
      }
      store.set(id, updated)
      return updated
    }
    return staffApplicationsApi.raiseQuery(id, message)
  },

  async addNote(id: string, message: string, actor: AuthUser): Promise<StaffApplicationDetail> {
    if (env.enableMocks) {
      await delay(300)
      const current = store.get(id)
      if (!current) throw new AppError('That application no longer exists.', { kind: 'notFound' })

      const updated: StaffApplicationDetail = {
        ...current,
        updatedAt: new Date().toISOString(),
        notes: [
          ...current.notes,
          {
            id: nextId(),
            message,
            author: actor.fullName,
            authorRole: (actor.role === 'CUSTOMER' ? 'MANAGER' : actor.role) as StaffRole,
            createdAt: new Date().toISOString(),
          },
        ],
      }
      store.set(id, updated)
      return updated
    }
    return staffApplicationsApi.addNote(id, message)
  },
}
