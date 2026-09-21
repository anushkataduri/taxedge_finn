import { useMemo, useState } from 'react'

import { useAsync, useDebounce } from '@shared/hooks'
import type { ApplicationStatus } from '@shared/types'

import { gstService } from '../services/gstService'
import type { GstApplication } from '../types/gst.types'

export const useGstApplications = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all')
  const debouncedSearch = useDebounce(search)

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, status: status === 'all' ? undefined : status }),
    [debouncedSearch, status],
  )

  const state = useAsync<GstApplication[]>(() => gstService.listApplications(filters), [filters])

  return { ...state, search, setSearch, status, setStatus }
}
