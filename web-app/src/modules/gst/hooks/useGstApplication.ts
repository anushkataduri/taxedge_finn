import { useAsync } from '@shared/hooks'

import { gstService } from '../services/gstService'
import type { GstApplication } from '../types/gst.types'

export const useGstApplication = (id: string | undefined) =>
  useAsync<GstApplication>(
    () => {
      if (!id) throw new Error('No application selected')
      return gstService.getApplication(id)
    },
    [id],
    { immediate: Boolean(id) },
  )
