import { useMemo, useState } from 'react'

import { useAsync, useDebounce } from '@shared/hooks'

import type { ApplicationFilter, StaffApplication } from '../../types/staff.types'
import { staffApplicationsService } from '../services/staffApplicationsService'

export const useStaffApplications = () => {
  const [filter, setFilter] = useState<ApplicationFilter>('ALL')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const filters = useMemo(
    () => ({ filter, search: debouncedSearch || undefined }),
    [filter, debouncedSearch],
  )

  const state = useAsync<StaffApplication[]>(() => staffApplicationsService.list(filters), [filters])

  return { ...state, filter, setFilter, search, setSearch }
}
