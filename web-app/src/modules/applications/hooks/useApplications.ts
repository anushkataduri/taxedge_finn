import { useAsync } from '@shared/hooks'

import { applicationsService } from '../services/applicationsService'
import type { ApplicationsItem } from '../types/applications.types'

export const useApplications = () => useAsync<ApplicationsItem[]>(() => applicationsService.list(), [])
