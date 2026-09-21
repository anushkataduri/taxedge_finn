import { useAsync } from '@shared/hooks'

import { loansService } from '../services/loansService'
import type { LoansItem } from '../types/loans.types'

export const useLoans = () => useAsync<LoansItem[]>(() => loansService.list(), [])
