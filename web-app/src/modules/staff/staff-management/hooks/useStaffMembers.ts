import { useCallback, useMemo, useState } from 'react'

import { messageFor } from '@core/errors'
import { useAsync } from '@shared/hooks'
import { useAppStore } from '@store/index'

import type { StaffMember, StaffMemberPayload } from '../../types/staff.types'
import { staffMembersService } from '../services/staffMembersService'

export const useStaffMembers = () => {
  const pushToast = useAppStore((state) => state.pushToast)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const state = useAsync<StaffMember[]>(() => staffMembersService.list(), [])
  const { refetch } = state

  const members = useMemo(() => {
    const rows = state.data ?? []
    if (!search.trim()) return rows
    const needle = search.toLowerCase()
    return rows.filter(
      (member) =>
        member.fullName.toLowerCase().includes(needle) ||
        member.email.toLowerCase().includes(needle) ||
        member.employeeCode.toLowerCase().includes(needle),
    )
  }, [state.data, search])

  const run = useCallback(
    async (action: () => Promise<unknown>, successMessage: string) => {
      setIsSaving(true)
      try {
        await action()
        await refetch()
        pushToast(successMessage, 'success')
        return true
      } catch (error) {
        pushToast(messageFor(error), 'error')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [refetch, pushToast],
  )

  const create = useCallback(
    (payload: StaffMemberPayload) => run(() => staffMembersService.create(payload), 'Staff member added'),
    [run],
  )

  const update = useCallback(
    (id: string, payload: Partial<StaffMemberPayload>) =>
      run(() => staffMembersService.update(id, payload), 'Staff member updated'),
    [run],
  )

  const setActive = useCallback(
    (id: string, isActive: boolean) =>
      run(
        () => staffMembersService.setActive(id, isActive),
        isActive ? 'Staff member activated' : 'Staff member deactivated',
      ),
    [run],
  )

  return { ...state, members, search, setSearch, isSaving, create, update, setActive }
}
