import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import {
  calculateTdsRefund,
  DEFAULT_ITR_STATS,
  INITIAL_APPLICATIONS,
  ITR_SERVICES_LIST,
} from '../../services/itrData'
import type { ItrApplicationItem, ItrViewKey } from '../../types/itr.types'
import {
  BarChartIcon,
  RupeeIcon,
  ClockIcon,
  FileTextIcon,
  ShieldAlertIcon,
  CalendarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '../../components/ItrIcons'
import './Itr.css'

export const Itr = () => {
  const navigate = useNavigate()
  const [applications] = useState<ItrApplicationItem[]>(INITIAL_APPLICATIONS)
  const [totalTdsInput, setTotalTdsInput] = useState<number>(46800)

  // Dynamic functional calculation
  const tdsCalculation = calculateTdsRefund(totalTdsInput)

  const viewRouteMap: Record<ItrViewKey, string> = {
    overview: routePaths.itr.root,
    'file-itr': routePaths.itr.fileItr,
    'track-my-return': routePaths.itr.trackMyReturn,
    'itr-filing': routePaths.itr.itrFiling,
    'tds-refund': routePaths.itr.tdsRefund,
    'previous-year-itr': routePaths.itr.previousYearItr,
    'revised-itr': routePaths.itr.revisedItr,
    'tax-notice-assistance': routePaths.itr.taxNoticeAssistance,
    'tds-refund-estimator': routePaths.itr.tdsRefundEstimator,
    'tax-computation': routePaths.itr.taxComputation,
  }

  const handleNavigateView = (viewKey: ItrViewKey) => {
    const targetRoute = viewRouteMap[viewKey] || routePaths.itr.root
    navigate(targetRoute)
  }

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'bar':
        return <BarChartIcon size={22} strokeWidth={2.2} />
      case 'rupee':
        return <RupeeIcon size={22} strokeWidth={2.2} />
      case 'clock':
        return <ClockIcon size={22} strokeWidth={2.2} />
      case 'document':
        return <FileTextIcon size={22} strokeWidth={2.2} />
      case 'warning':
        return <ShieldAlertIcon size={22} strokeWidth={2.2} />
      default:
        return <FileTextIcon size={22} strokeWidth={2.2} />
    }
  }

  const getStatIcon = (iconType: string) => {
    switch (iconType) {
      case 'calendar':
        return <CalendarIcon size={16} strokeWidth={2.2} />
      case 'check':
        return <CheckCircleIcon size={16} strokeWidth={2.2} />
      case 'rupee':
        return <RupeeIcon size={16} strokeWidth={2.2} />
      case 'notice':
        return <ShieldCheckIcon size={16} strokeWidth={2.2} />
      default:
        return <CheckCircleIcon size={16} strokeWidth={2.2} />
    }
  }

  return (
    <div className="itr-hub-page">
      {/* 1. Header Hero Banner */}
      <section className="itr-hero-banner">
        <h1 className="itr-hero-banner__title">Returns, refunds and notices</h1>
        <p className="itr-hero-banner__subtitle">
          Filed by a CA, not a form wizard. We pull your AIS and TIS, reconcile them against your
          books, and show you the computation before anything is submitted.
        </p>

        <div className="itr-hero-banner__actions">
          <button
            type="button"
            className="itr-hero-btn-accent"
            onClick={() => navigate(routePaths.itr.taxComputation)}
          >
            View Tax Computation →
          </button>
        </div>
      </section>

      {/* 2. Four Stats Cards Row */}
      <section className="itr-stats-grid">
        {DEFAULT_ITR_STATS.map((stat) => (
          <div key={stat.id} className="itr-stat-card">
            <div className="itr-stat-card__header">
              <span className="itr-stat-card__icon-box">{getStatIcon(stat.icon)}</span>
              <span className="itr-stat-card__label">{stat.label}</span>
            </div>
            <div className="itr-stat-card__value">{stat.value}</div>
            <div className="itr-stat-card__subtext">{stat.subtext}</div>
          </div>
        ))}
      </section>

      {/* 3. Five Service Cards Grid */}
      <section className="itr-services-grid">
        {ITR_SERVICES_LIST.map((service) => (
          <div key={service.id} className="itr-service-card">
            <div className="itr-service-card__icon-box">
              {getServiceIcon(service.icon)}
            </div>

            <h3 className="itr-service-card__title">{service.title}</h3>
            <p className="itr-service-card__desc">{service.description}</p>

            <hr className="itr-service-card__divider" />

            <div className="itr-service-card__footer">
              <div className="itr-service-card__price-box">
                <span className="itr-service-card__price">{service.pricing}</span>
                <span className="itr-service-card__timeline">
                  <ClockIcon size={13} strokeWidth={2.2} /> {service.timeline}
                </span>
              </div>

              <button
                type="button"
                className="itr-service-card__start-btn"
                onClick={() => handleNavigateView(service.viewKey)}
              >
                Start →
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 4. TDS Refund Estimator */}
      <section className="itr-estimator-section">
        <div className="itr-estimator-header">
          <div>
            <h2 className="itr-estimator-title">TDS refund estimator</h2>
            <p className="itr-estimator-subtitle">
              Our fee for a refund case is 15% of the refund recovered — nothing if there is no refund.
            </p>
          </div>
          <button
            type="button"
            className="itr-hero-btn-accent"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.15rem' }}
            onClick={() => navigate(routePaths.itr.tdsRefundEstimator)}
          >
            Open Interactive Calculator →
          </button>
        </div>

        <div className="itr-estimator-cards-row">
          <div className="itr-estimator-box">
            <span className="itr-estimator-box__label">Total TDS deducted</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <p className="itr-estimator-box__value">
                ₹{tdsCalculation.totalTdsDeducted.toLocaleString('en-IN')}
              </p>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f97316',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
                onClick={() =>
                  setTotalTdsInput((prev) => (prev === 46800 ? 68000 : 46800))
                }
              >
                (Toggle Demo)
              </button>
            </div>
          </div>

          <div className="itr-estimator-box">
            <span className="itr-estimator-box__label">Estimated refund</span>
            <p className="itr-estimator-box__value itr-estimator-box__value--refund">
              ₹{tdsCalculation.estimatedRefund.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="itr-estimator-box">
            <span className="itr-estimator-box__label">TaxEdge fee at 15%</span>
            <p className="itr-estimator-box__value">
              ₹{tdsCalculation.taxEdgeFee.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Your ITR Applications */}
      <section className="itr-apps-section">
        <h2 className="itr-apps-title">Your ITR applications</h2>

        {applications.map((app) => (
          <div
            key={app.id}
            className="itr-apps-card"
            onClick={() => navigate(routePaths.itr.trackMyReturn)}
          >
            <div className="itr-apps-info">
              <div className={`itr-apps-icon-box itr-apps-icon-box--${app.statusTone}`}>
                {app.statusTone === 'warning' ? (
                  <BarChartIcon size={22} strokeWidth={2.2} />
                ) : (
                  <RupeeIcon size={22} strokeWidth={2.2} />
                )}
              </div>
              <div className="itr-apps-details">
                <h4 className="itr-apps-name">{app.title}</h4>
                <p className="itr-apps-meta">
                  {app.reference} · {app.entityType} · {app.formType} · {app.caAssigned}
                </p>
              </div>
            </div>

            <div className="itr-apps-status-box">
              <span className={`itr-apps-badge itr-apps-badge--${app.statusTone}`}>
                • {app.statusLabel}
              </span>
              <div className="itr-apps-progress-bar">
                <div
                  className="itr-apps-progress-fill"
                  style={{
                    width: `${app.progressPercentage}%`,
                    background: app.statusTone === 'success' ? '#10b981' : '#f97316',
                  }}
                />
              </div>
              <span className="itr-apps-progress-text">{app.progressPercentage}% complete</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Itr
