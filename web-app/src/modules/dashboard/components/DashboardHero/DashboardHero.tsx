import { Link } from 'react-router-dom'

import { routePaths } from '@core/config'

import type { DashboardBrief } from '../../types/dashboard.types'
import './DashboardHero.css'

export interface DashboardHeroProps {
  userName: string
  brief: DashboardBrief
}

const greeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const DashboardHero = ({ userName, brief }: DashboardHeroProps) => (
  <section className="dashboard-hero">
    <div className="dashboard-hero__body">
      <p className="dashboard-hero__date">{brief.dateLabel}</p>
      <h1 className="dashboard-hero__greeting">
        {greeting()}, {userName.split(' ')[0]}
      </h1>
      <p className="dashboard-hero__message">{brief.message}</p>

      <div className="dashboard-hero__actions">
        <Link className="dashboard-hero__btn dashboard-hero__btn--solid" to={routePaths.gst.returns}>
          File GST return
        </Link>
        <a className="dashboard-hero__btn dashboard-hero__btn--outline" href="#quick-services">
          Browse services
        </a>
      </div>
    </div>

    <div className="dashboard-hero__figures">
      <div className="dashboard-hero__figure">
        <p className="dashboard-hero__figure-value">{brief.activeApplications}</p>
        <p className="dashboard-hero__figure-label">Active applications</p>
      </div>
      <div className="dashboard-hero__figure">
        <p className="dashboard-hero__figure-value">{brief.paymentDue}</p>
        <p className="dashboard-hero__figure-label">Payment due</p>
      </div>
    </div>
  </section>
)
