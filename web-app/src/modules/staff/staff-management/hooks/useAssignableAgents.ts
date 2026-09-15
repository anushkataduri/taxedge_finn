import { useAsync } from '@shared/hooks'

import type { StaffMember } from '../../types/staff.types'
import { staffMembersService } from '../services/staffMembersService'

export const useAssignableAgents = () =>
  useAsync<StaffMember[]>(() => staffMembersService.assignableAgents(), [])
