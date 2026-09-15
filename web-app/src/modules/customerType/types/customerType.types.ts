import type { ReactNode } from 'react'

export type CustomerTypeId =
  | 'individual'
  | 'salaried'
  | 'business'
  | 'proprietorship'
  | 'partnership'
  | 'llp'
  | 'private_limited'
  | 'company'
  | 'freelancer'

export interface CustomerTypeOption {
  id: CustomerTypeId
  title: string
  description: string
  icon: ReactNode
}

export interface CustomerTypeState {
  selectedId: CustomerTypeId
  setSelectedId: (id: CustomerTypeId) => void
}
