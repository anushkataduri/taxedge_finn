import { Link } from 'react-router-dom'

import type { DashboardDeadline } from '../../types/dashboard.types'
import './DeadlineBanner.css'

export interface DeadlineBannerProps {
  deadline: DashboardDeadline
}

export const DeadlineBanner = ({ deadline }: DeadlineBannerProps) => (
  <div className="deadline-banner">
    <span className="deadline-banner__icon" aria-hidden="true">
      🗓
    </span>

    <div className="deadline-banner__body">
      <p className="deadline-banner__title">{deadline.title}</p>
      <p className="deadline-banner__meta">{deadline.meta}</p>
    </div>

    <div className="deadline-banner__days">
      <span className="deadline-banner__days-value">{deadline.daysLeft}</span>
      <span className="deadline-banner__days-label">days left</span>
    </div>

    <Link className="deadline-banner__cta" to={deadline.ctaTo}>
      {deadline.ctaLabel}
    </Link>
  </div>
)
