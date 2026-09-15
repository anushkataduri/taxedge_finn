import type { SupportExecutive } from '../../types/support.types'
import './ExecutiveList.css'

interface ExecutiveListProps {
  executives: SupportExecutive[]
  activeExecutiveId?: string
  onSelectExecutive: (executive: SupportExecutive) => void
}

export const ExecutiveList = ({
  executives,
  activeExecutiveId,
  onSelectExecutive,
}: ExecutiveListProps) => {
  return (
    <div className="executive-list-card">
      <h3 className="executive-list-card__title">Your executives</h3>

      <div className="executive-list-card__items">
        {executives.map((exec) => {
          const isActive = exec.id === activeExecutiveId
          const isOnline = exec.status === 'Online'

          return (
            <button
              key={exec.id}
              type="button"
              className={`executive-item ${isActive ? 'executive-item--active' : ''}`}
              onClick={() => onSelectExecutive(exec)}
            >
              <div
                className="executive-item__avatar"
                style={{ backgroundColor: exec.avatarColor || '#059669' }}
              >
                {exec.avatarInitials}
              </div>

              <div className="executive-item__details">
                <span className="executive-item__name">{exec.name}</span>
                <span className="executive-item__role">{exec.role}</span>
              </div>

              <div className="executive-item__status-wrapper">
                <span
                  className={`executive-item__badge ${
                    isOnline
                      ? 'executive-item__badge--online'
                      : 'executive-item__badge--away'
                  }`}
                >
                  {exec.status}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
