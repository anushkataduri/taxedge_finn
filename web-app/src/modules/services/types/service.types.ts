export type ServiceCategoryKey =
  | 'all'
  | 'gst'
  | 'itr-tds'
  | 'loans'
  | 'business-commercial'
  | 'insurance'
  | 'compliance'

export interface ServiceItem {
  id: string
  title: string
  category: ServiceCategoryKey
  categoryLabel: string
  description: string
  price: string
  pricingType: string
  turnaround: string
  iconType: string
  popular?: boolean
  badge?: string
  route?: string
}

export interface CategoryTab {
  id: ServiceCategoryKey
  label: string
  count?: number
}

export interface ServiceCategoryConfig {
  id: ServiceCategoryKey
  title: string
  description?: string
  badgeText?: string
}
