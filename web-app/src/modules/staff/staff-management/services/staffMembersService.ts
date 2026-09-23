import { AGENT_ROLES, type StaffRole } from '@core/auth'
import { env } from '@core/config'
import { AppError } from '@core/errors'

import { mockStaff } from '../../services/mockData'
import type { Department, StaffMember, StaffMemberPayload } from '../../types/staff.types'
import { staffMembersApi } from '../api/staffMembersApi'

/* Development mocks - delete once the API is live. */
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const store = new Map<string, StaffMember>(mockStaff.map((member) => [member.id, member]))

const nextCode = (): string => `TE-${String(store.size + 1).padStart(3, '0')}`

export const staffMembersService = {
  async list(): Promise<StaffMember[]> {
    if (env.enableMocks) {
      await delay()
      return [...store.values()].sort((a, b) => a.fullName.localeCompare(b.fullName))
    }
    const response = await staffMembersApi.list()
    return response.data
  },

  /** Active agents only — who an application can actually be assigned to. */
  async assignableAgents(): Promise<StaffMember[]> {
    const members = await this.list()
    return members.filter(
      (member) => member.isActive && (AGENT_ROLES as readonly string[]).includes(member.role),
    )
  },

  async create(payload: StaffMemberPayload): Promise<StaffMember> {
    if (env.enableMocks) {
      await delay(450)
      if ([...store.values()].some((member) => member.email === payload.email)) {
        throw new AppError('A staff member with that email already exists.', { kind: 'validation' })
      }
      const now = new Date().toISOString()
      const member: StaffMember = {
        id: `stf_${Date.now()}`,
        employeeCode: nextCode(),
        fullName: payload.fullName,
        email: payload.email,
        mobile: payload.mobile,
        role: payload.role as StaffRole,
        department: payload.department as Department,
        isActive: payload.isActive,
        assignedApplications: 0,
        joinedOn: now,
        createdAt: now,
        updatedAt: now,
      }
      store.set(member.id, member)
      return member
    }
    return staffMembersApi.create(payload)
  },

  async update(id: string, payload: Partial<StaffMemberPayload>): Promise<StaffMember> {
    if (env.enableMocks) {
      await delay(400)
      const current = store.get(id)
      if (!current) throw new AppError('That staff member was not found.', { kind: 'notFound' })
      const updated: StaffMember = {
        ...current,
        ...payload,
        role: (payload.role ?? current.role) as StaffRole,
        department: (payload.department ?? current.department) as Department,
        updatedAt: new Date().toISOString(),
      }
      store.set(id, updated)
      return updated
    }
    return staffMembersApi.update(id, payload)
  },

  async setActive(id: string, isActive: boolean): Promise<StaffMember> {
    if (env.enableMocks) {
      await delay(300)
      const current = store.get(id)
      if (!current) throw new AppError('That staff member was not found.', { kind: 'notFound' })
      const updated = { ...current, isActive, updatedAt: new Date().toISOString() }
      store.set(id, updated)
      return updated
    }
    return staffMembersApi.setActive(id, isActive)
  },
}
