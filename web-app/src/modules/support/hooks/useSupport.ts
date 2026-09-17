import { useAsync } from '@shared/hooks'

import { supportService } from '../services/supportService'
import type { SupportItem } from '../types/support.types'

export const useSupport = () => useAsync<SupportItem[]>(() => supportService.list(), [])
