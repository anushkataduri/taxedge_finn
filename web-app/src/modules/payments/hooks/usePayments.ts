import { useAsync } from '@shared/hooks'

import { paymentsService } from '../services/paymentsService'
import type { PaymentsItem } from '../types/payments.types'

export const usePayments = () => useAsync<PaymentsItem[]>(() => paymentsService.list(), [])
