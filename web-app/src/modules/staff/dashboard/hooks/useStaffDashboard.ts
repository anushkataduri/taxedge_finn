import { useAsync } from '@shared/hooks'
import { useAuthStore } from '@store/index'

import type { StaffDashboardData } from '../../types/staff.types'
import { staffDashboardService } from '../services/staffDashboardService'

export const useStaffDashboard = () => {
  const user = useAuthStore((state) => state.user)

  return useAsync<StaffDashboardData>(
    () => {
      if (!user) throw new Error('Not signed in')
      return staffDashboardService.summary(user)
    },
    [user?.id],
    { immediate: Boolean(user) },
  )
}
