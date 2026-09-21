import { useCallback, useState } from 'react'

import { messageFor } from '@core/errors'
import type { ApplicationStatus } from '@shared/types'
import { useAsync } from '@shared/hooks'
import { useAppStore, useAuthStore } from '@store/index'

import type { StaffApplicationDetail } from '../../types/staff.types'
import { staffApplicationsService } from '../services/staffApplicationsService'

/** Detail state plus every action the staff screens can take on it. */
export const useStaffApplication = (id: string | undefined) => {
  const user = useAuthStore((state) => state.user)
  const pushToast = useAppStore((state) => state.pushToast)
  const [isSaving, setIsSaving] = useState(false)

  const state = useAsync<StaffApplicationDetail>(
    () => {
      if (!id) throw new Error('No application selected')
      return staffApplicationsService.detail(id)
    },
    [id],
    { immediate: Boolean(id) },
  )

  const { setData } = state

  const run = useCallback(
    async (action: () => Promise<StaffApplicationDetail>, successMessage: string) => {
      if (!user) return
      setIsSaving(true)
      try {
        setData(await action())
        pushToast(successMessage, 'success')
      } catch (error) {
        pushToast(messageFor(error), 'error')
      } finally {
        setIsSaving(false)
      }
    },
    [user, setData, pushToast],
  )

  const assign = useCallback(
    (staffId: string | null, note?: string) => {
      if (!id || !user) return
      return run(
        () => staffApplicationsService.assign(id, staffId, user, note),
        staffId ? 'Application assigned' : 'Application returned to the bucket',
      )
    },
    [id, user, run],
  )

  const changeStatus = useCallback(
    (status: ApplicationStatus, note?: string) => {
      if (!id || !user) return
      return run(() => staffApplicationsService.changeStatus(id, status, user, note), 'Stage updated')
    },
    [id, user, run],
  )

  const raiseQuery = useCallback(
    (message: string) => {
      if (!id || !user) return
      return run(() => staffApplicationsService.raiseQuery(id, message, user), 'Query raised')
    },
    [id, user, run],
  )

  const addNote = useCallback(
    (message: string) => {
      if (!id || !user) return
      return run(() => staffApplicationsService.addNote(id, message, user), 'Note added')
    },
    [id, user, run],
  )

  return { ...state, isSaving, assign, changeStatus, raiseQuery, addNote }
}
