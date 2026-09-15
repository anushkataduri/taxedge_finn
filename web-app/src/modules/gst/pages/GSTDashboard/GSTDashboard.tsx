import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import { GSTStats } from '../../components/GSTStats/GSTStats'
import { GSTServices } from '../../components/GSTServices/GSTServices'
import { GSTApplicationList } from '../../components/GSTApplicationList/GSTApplicationList'
import { useGstDashboardData } from '../../hooks/useGstDashboardData'
import './GSTDashboard.css'

export const GSTDashboard = () => {
  const dashboardData = useGstDashboardData()

  return (
    <div className="gst-dashboard">
      {/* Green Hero Banner matching TaxEdge Reference */}
      <section className="gst-hero-banner" aria-labelledby="gst-hero-title">
        <span className="gst-hero-banner__badge">GST</span>
        <h1 id="gst-hero-title" className="gst-hero-banner__title">Goods &amp; Services Tax</h1>
        <p className="gst-hero-banner__description">
          Registration through to annual compliance, handled by a dedicated GST executive. Your GSTIN 27AXTPD4419K1ZP is active and filings are current through July 2026.
        </p>
        <div className="gst-hero-banner__actions">
          <Link to={routePaths.gst.filing} className="gst-hero-banner__btn gst-hero-banner__btn--primary">
            File a return
          </Link>
          <Link to={routePaths.gst.registration} className="gst-hero-banner__btn gst-hero-banner__btn--secondary">
            New registration
          </Link>
        </div>
      </section>

      {!dashboardData.isLoading && (
        <div className="gst-dashboard__overview">
          <GSTStats stats={dashboardData.stats} />
          <GSTServices services={dashboardData.services} />
          <GSTApplicationList applications={dashboardData.applications} />
        </div>
      )}
    </div>
  )
}

export default GSTDashboard
