import { useAsync } from '@shared/hooks'

import { profileService } from '../services/profileService'
import type { ProfileItem } from '../types/profile.types'

export const useProfile = () => useAsync<ProfileItem[]>(() => profileService.list(), [])
