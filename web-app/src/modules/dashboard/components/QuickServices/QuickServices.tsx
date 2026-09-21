import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { QuickService } from '../../types/dashboard.types'
import './QuickServices.css'

export interface QuickServicesProps {
  services: QuickService[]
}

const QUICK_SERVICE_ICONS: Record<string, ReactNode> = {
  gst: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </>
  ),
  itr: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  loans: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  insurance: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  company: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="22" x2="9" y2="2" />
      <line x1="8" y1="6" x2="6" y2="6" />
      <line x1="16" y1="6" x2="14" y2="6" />
      <line x1="16" y1="10" x2="14" y2="10" />
      <line x1="16" y1="14" x2="14" y2="14" />
    </>
  ),
}

export const QuickServices = ({ services }: QuickServicesProps) => (
  <section className="quick-services" id="quick-services">
    <div className="quick-services__grid">
      {services.map((service) => (
        <Link className="quick-service" key={service.id} to={service.to}>
          <div className="quick-service__icon-wrap">
            <span className="quick-service__icon" aria-hidden="true">
              {QUICK_SERVICE_ICONS[service.id] ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="quick-service__icon-svg"
                  aria-hidden="true"
                >
                  {QUICK_SERVICE_ICONS[service.id]}
                </svg>
              ) : (
                service.icon
              )}
            </span>
          </div>

          <h3 className="quick-service__label">{service.label}</h3>
          <p className="quick-service__description">{service.description}</p>

          <div className="quick-service__footer">
            <div className="quick-service__price-wrap">
              <span className="quick-service__price">{service.price}</span>
              {service.priceUnit && (
                <span className="quick-service__price-unit">{service.priceUnit}</span>
              )}
            </div>
            <span className="quick-service__action">
              Open <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
)

