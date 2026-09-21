import { useState } from 'react'
import type { CustomerTypeId } from '../types/customerType.types'

export const useCustomerType = (defaultId: CustomerTypeId | null = null) => {
  const [selectedId, setSelectedId] = useState<CustomerTypeId | null>(defaultId)

  return {
    selectedId,
    setSelectedId,
  }
}
