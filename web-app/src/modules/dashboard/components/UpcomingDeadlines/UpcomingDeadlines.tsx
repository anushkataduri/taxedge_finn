import type { UpcomingDeadlineItem } from '../../types/dashboard.types'
import './UpcomingDeadlines.css'

export interface UpcomingDeadlinesProps {
  deadlines?: UpcomingDeadlineItem[]
}

const CalendarIcon = () => (
  <svg className="deadline-card__calendar-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export const UpcomingDeadlines = ({ deadlines = [] }: UpcomingDeadlinesProps) => {
  if (!deadlines.length) return null

  return (
    <section className="deadlines-section" aria-labelledby="deadlines-heading">
      <div className="deadlines-section__header">
        <h2 className="deadlines-section__title" id="deadlines-heading">Upcoming deadlines</h2>
        <p className="deadlines-section__subtitle">Statutory dates that apply to your profile.</p>
      </div>

      <div className="deadlines-section__list">
        {deadlines.map((d) => (
          <div className="deadline-card" key={d.id}>
            <div className="deadline-card__left">
              <span className="deadline-card__icon" aria-hidden="true">
                <CalendarIcon />
              </span>
              <div className="deadline-card__info">
                <h3 className="deadline-card__title">{d.title}</h3>
                <p className="deadline-card__meta">{d.dueLabel}</p>
              </div>
            </div>

            <div className="deadline-card__right">
              <span className={`deadline-card__badge deadline-card__badge--${d.daysTone}`}>
                <span className="deadline-card__badge-dot" aria-hidden="true">●</span>
                {d.daysText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
