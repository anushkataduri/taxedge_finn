import { useAsync } from '@shared/hooks'

import { insuranceService } from '../services/insuranceService'
import type { InsuranceItem } from '../types/insurance.types'

export const useInsurance = () => useAsync<InsuranceItem[]>(() => insuranceService.list(), [])
