import type {
  ItrApplicationItem,
  ItrServiceCard,
  ItrStatCard,
  TdsEstimatorValues,
} from '../types/itr.types'

export const DEFAULT_ITR_STATS: ItrStatCard[] = [
  {
    id: 'stat_ay',
    label: 'Assessment year',
    value: '2026-27',
    subtext: 'Due 30 September 2026',
    icon: 'calendar',
  },
  {
    id: 'stat_last_filed',
    label: 'Last filed',
    value: 'AY 2025-26',
    subtext: 'ITR 3 · e-verified',
    icon: 'check',
  },
  {
    id: 'stat_refund',
    label: 'Refund received',
    value: '₹18,420',
    subtext: 'Credited 12 Aug 2025',
    icon: 'rupee',
  },
  {
    id: 'stat_notices',
    label: 'Open notices',
    value: '0',
    subtext: 'Nothing pending with the department',
    icon: 'notice',
  },
]

export const ITR_SERVICES_LIST: ItrServiceCard[] = [
  {
    id: 'service_itr_filing',
    title: 'ITR Filing',
    description: 'Income tax return for salaried, business and professional income.',
    pricing: '₹3,000 from',
    timeline: '3-5 working days',
    icon: 'bar',
    viewKey: 'itr-filing',
  },
  {
    id: 'service_tds_refund',
    title: 'TDS Refund',
    description: 'Claim excess TDS deducted, with a refund estimate up front.',
    pricing: '15% of refund',
    timeline: '20-45 days to credit',
    icon: 'rupee',
    viewKey: 'tds-refund',
  },
  {
    id: 'service_previous_year',
    title: 'Previous Year ITR',
    description: 'Belated or updated return for an earlier assessment year.',
    pricing: '₹3,500 per year',
    timeline: '5-7 working days',
    icon: 'clock',
    viewKey: 'previous-year-itr',
  },
  {
    id: 'service_revised_itr',
    title: 'Revised ITR',
    description: 'Correct a return already filed for this assessment year.',
    pricing: '₹2,500 per return',
    timeline: '3-5 working days',
    icon: 'document',
    viewKey: 'revised-itr',
  },
  {
    id: 'service_tax_notice',
    title: 'Tax Notice Assistance',
    description: 'Reply to a 143(1), 139(9) or scrutiny notice with a CA.',
    pricing: '₹5,500 from',
    timeline: 'Within notice deadline',
    icon: 'warning',
    viewKey: 'tax-notice-assistance',
  },
]

export const INITIAL_APPLICATIONS: ItrApplicationItem[] = [
  {
    id: 'app_itr_2026',
    title: 'ITR Filing — AY 2026-27',
    reference: 'ITR-2026-00074',
    entityType: 'Proprietorship',
    formType: 'ITR-3',
    caAssigned: 'Meera Iyer',
    statusLabel: 'Tax Calculation',
    statusTone: 'warning',
    progressPercentage: 46,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'app_tds_2025',
    title: 'TDS Refund — AY 2025-26',
    reference: 'ITR-2025-00611',
    entityType: 'Refund credited',
    formType: '₹18,420',
    caAssigned: 'Meera Iyer',
    statusLabel: 'Completed',
    statusTone: 'success',
    progressPercentage: 100,
    amountCredited: 18420,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
]

export const calculateTdsRefund = (totalTds: number): TdsEstimatorValues => {
  const safeTds = Number.isFinite(totalTds) && totalTds > 0 ? totalTds : 0
  const refundFactor = 0.5
  const feeRate = 0.15

  const estimatedRefund = Math.round(safeTds * refundFactor)
  const taxEdgeFee = Math.round(estimatedRefund * feeRate)

  return {
    totalTdsDeducted: safeTds,
    estimatedRefund,
    taxEdgeFee,
  }
}

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
