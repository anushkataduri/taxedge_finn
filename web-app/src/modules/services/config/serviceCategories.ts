import type { CategoryTab, ServiceCategoryConfig, ServiceCategoryKey } from '../types/service.types'

export const SERVICE_CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All' },
  { id: 'gst', label: 'GST' },
  { id: 'itr-tds', label: 'ITR & TDS' },
  { id: 'loans', label: 'Loans' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'business-commercial', label: 'Business' },
  { id: 'insurance', label: 'Insurance' },
]

export const CATEGORY_METADATA: Record<Exclude<ServiceCategoryKey, 'all'>, ServiceCategoryConfig> = {
  gst: {
    id: 'gst',
    title: 'GST',
    description: 'Registration, monthly/quarterly filings, reconciliation & department compliance.',
    badgeText: '6 services',
  },
  'itr-tds': {
    id: 'itr-tds',
    title: 'ITR',
    description: 'Income tax returns, tax planning, TDS deductions & Form 16 support.',
    badgeText: '5 services',
  },
  loans: {
    id: 'loans',
    title: 'Loans',
    description: 'Personal, business, mortgage & asset-backed loans with fast approval.',
    badgeText: '8 services',
  },
  compliance: {
    id: 'compliance',
    title: 'Compliance',
    description: 'Annual ROC filings, secretarial audits, trademark & statutory governance.',
    badgeText: '4 services',
  },
  'business-commercial': {
    id: 'business-commercial',
    title: 'Business & Commercial',
    description: 'Entity registration, MSME Udyam, partnerships & regulatory paperwork.',
    badgeText: '4 services',
  },
  insurance: {
    id: 'insurance',
    title: 'Insurance',
    description: 'Comprehensive health, life, commercial & auto protection plans.',
    badgeText: '4 services',
  },
}
