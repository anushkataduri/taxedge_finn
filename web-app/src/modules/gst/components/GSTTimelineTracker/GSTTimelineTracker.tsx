import type { GstTimelineEvent } from '../../hooks/useGstMonthlyFilingDetail'
import './GSTTimelineTracker.css'

interface GSTTimelineTrackerProps {
  events: GstTimelineEvent[]
}

export const GSTTimelineTracker = ({ events }: GSTTimelineTrackerProps) => {
  return (
    <div className="gst-tracker-card">
      <h2 className="gst-tracker-card__title">Application timeline</h2>

      <div className="gst-tracker-list">
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          const isCompleted = event.status === 'completed'
          const isCurrent = event.status === 'current'

          return (
            <div
              key={event.id}
              className={`gst-tracker-item gst-tracker-item--${event.status}`}
            >
              <div className="gst-tracker-item__indicator">
                <div
                  className={`gst-tracker-item__dot ${
                    isCompleted
                      ? 'gst-tracker-item__dot--completed'
                      : isCurrent
                        ? 'gst-tracker-item__dot--current'
                        : 'gst-tracker-item__dot--pending'
                  }`}
                >
                  {isCurrent && <span className="gst-tracker-item__dot-inner" />}
                </div>
                {!isLast && (
                  <div
                    className={`gst-tracker-item__line ${
                      isCompleted
                        ? 'gst-tracker-item__line--active'
                        : 'gst-tracker-item__line--inactive'
                    }`}
                  />
                )}
              </div>

              <div className="gst-tracker-item__content">
                <div className="gst-tracker-item__header">
                  <h3 className="gst-tracker-item__title">{event.title}</h3>
                </div>

                {event.description && (
                  <p className="gst-tracker-item__description">{event.description}</p>
                )}

                <span className="gst-tracker-item__date">{event.date}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
