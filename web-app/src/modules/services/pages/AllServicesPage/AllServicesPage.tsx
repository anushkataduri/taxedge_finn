import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceTabs } from '../../components/ServiceTabs/ServiceTabs'
import { ServiceSection } from '../../components/ServiceSection/ServiceSection'
import { ALL_SERVICES } from '../../data/servicesData'
import { CATEGORY_METADATA, SERVICE_CATEGORIES } from '../../config/serviceCategories'
import type { ServiceCategoryKey, ServiceItem } from '../../types/service.types'
import './AllServicesPage.css'

export const AllServicesPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryKey>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter services dynamically by active category and search query
  const filteredServices = useMemo(() => {
    let list = ALL_SERVICES

    // 1. Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category === selectedCategory)
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q) ||
          s.turnaround.toLowerCase().includes(q) ||
          s.price.toLowerCase().includes(q),
      )
    }

    return list
  }, [selectedCategory, searchQuery])

  // Group filtered services by category
  const groupedSections = useMemo(() => {
    const categoriesToRender =
      selectedCategory === 'all'
        ? (Object.keys(CATEGORY_METADATA) as Array<Exclude<ServiceCategoryKey, 'all'>>)
        : [selectedCategory as Exclude<ServiceCategoryKey, 'all'>]

    return categoriesToRender
      .map((catKey) => {
        const config = CATEGORY_METADATA[catKey]
        const services = filteredServices.filter((s) => s.category === catKey)
        return { config, services }
      })
      .filter((group) => group.services.length > 0)
  }, [selectedCategory, filteredServices])

  const handleStartService = (service: ServiceItem) => {
    if (service.route) {
      navigate(service.route)
    }
  }

  return (
    <div className="all-services-page">
      {/* Hero Section */}
      <header className="all-services-page__hero">
        <h1 className="all-services-page__title">All services</h1>
        <p className="all-services-page__subtitle">
          Every service TaxEdge offers, with the price and turnaround up front. Admin can add new services without an app update.
        </p>
      </header>

      {/* Filter Tabs Bar */}
      <div className="all-services-page__filters">
        <ServiceTabs
          tabs={SERVICE_CATEGORIES}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Service Sections Grid */}
      {groupedSections.length > 0 ? (
        groupedSections.map(({ config, services }) => (
          <ServiceSection
            key={config.id}
            config={config}
            services={services}
            onStartService={handleStartService}
          />
        ))
      ) : (
        /* Empty State */
        <div className="all-services-page__empty">
          <div className="all-services-page__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="all-services-page__empty-title">No services found</h3>
          <p className="all-services-page__empty-desc">
            We couldn&apos;t find any services matching &ldquo;{searchQuery}&rdquo;. Try another keyword or browse by category.
          </p>
          <button
            type="button"
            className="all-services-page__empty-btn"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default AllServicesPage
