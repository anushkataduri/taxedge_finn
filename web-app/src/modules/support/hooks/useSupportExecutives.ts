import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { messageFor } from '@core/errors'

import { supportService } from '../services/supportService'
import type { ExecutiveStatus, SupportExecutive } from '../types/support.types'

export const useSupportExecutives = () => {
  const [executives, setExecutives] = useState<SupportExecutive[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ExecutiveStatus | 'all'>('all')
  const mountedRef = useRef(true)

  const fetchExecutives = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await supportService.getExecutives()
      if (mountedRef.current) {
        setExecutives(data)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(messageFor(err))
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchExecutives()
    return () => {
      mountedRef.current = false
    }
  }, [fetchExecutives])

  // Pure functional filtering without loops
  const filteredExecutives = useMemo(() => {
    return executives.filter((exec) => {
      const matchesStatus =
        statusFilter === 'all' ? true : exec.status === statusFilter
      const matchesSearch =
        searchTerm.trim() === ''
          ? true
          : exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exec.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exec.department.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [executives, searchTerm, statusFilter])

  return {
    executives: filteredExecutives,
    allExecutives: executives,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refetch: fetchExecutives,
  }
}
