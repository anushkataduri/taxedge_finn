import type { CategoryTab, ServiceCategoryKey } from '../../types/service.types'
import './ServiceTabs.css'

export interface ServiceTabsProps {
  tabs: CategoryTab[]
  activeCategory: ServiceCategoryKey
  onSelectCategory: (category: ServiceCategoryKey) => void
}

export const ServiceTabs = ({
  tabs,
  activeCategory,
  onSelectCategory,
}: ServiceTabsProps) => {
  return (
    <div className="service-tabs-container" role="tablist" aria-label="Service category tabs">
      <div className="service-tabs">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`service-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`service-section-${tab.id}`}
              className={`service-tab${isActive ? ' service-tab--active' : ''}`}
              onClick={() => onSelectCategory(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
