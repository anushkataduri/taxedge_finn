import { useAsync } from '@shared/hooks'

import { gstService } from '../services/gstService'
import type { GstReturn } from '../types/gst.types'

export const useGstReturns = () => useAsync<GstReturn[]>(() => gstService.listReturns(), [])
