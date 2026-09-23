import { useCallback, useMemo, useState } from 'react'

import { DEFAULT_PAGE_SIZE } from '@core/config'
import type { PageQuery } from '../types/pagination.types'

export interface UsePaginationResult {
  query: PageQuery
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  setTotal: (total: number) => void
  next: () => void
  previous: () => void
  reset: () => void
}

export const usePagination = (pageSize = DEFAULT_PAGE_SIZE): UsePaginationResult => {
  const [query, setQuery] = useState<PageQuery>({ page: 1, pageSize })
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(
    () => (query.pageSize > 0 ? Math.max(1, Math.ceil(total / query.pageSize)) : 1),
    [total, query.pageSize],
  )

  const setPage = useCallback((page: number) => setQuery((q) => ({ ...q, page })), [])
  const setPageSize = useCallback((size: number) => setQuery((q) => ({ ...q, pageSize: size, page: 1 })), [])
  const setSearch = useCallback((search: string) => setQuery((q) => ({ ...q, search, page: 1 })), [])
  const next = useCallback(() => setQuery((q) => ({ ...q, page: q.page + 1 })), [])
  const previous = useCallback(() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) })), [])
  const reset = useCallback(() => setQuery({ page: 1, pageSize }), [pageSize])

  return { query, totalPages, setPage, setPageSize, setSearch, setTotal, next, previous, reset }
}
