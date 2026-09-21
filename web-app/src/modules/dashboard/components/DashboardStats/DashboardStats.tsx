import type { DashboardStat } from '../../types/dashboard.types'
import './DashboardStats.css'

export interface DashboardStatsProps {
  stats: DashboardStat[]
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="dashboard-stats">
    {stats.map((stat) => (
      <article className="stat" key={stat.id}>
        <div className="stat__top">
          <span className={`stat__icon stat__icon--${stat.tone}`} aria-hidden="true">
            {stat.icon}
          </span>
          <p className="stat__label">{stat.label}</p>
        </div>

        <p className="stat__value">{stat.value}</p>

        {(stat.hint || stat.hintFlag) && (
          <p className="stat__hint">
            {stat.hintFlag && <span className="stat__hint-flag">{stat.hintFlag}</span>} {stat.hint}
          </p>
        )}
      </article>
    ))}
  </div>
)
