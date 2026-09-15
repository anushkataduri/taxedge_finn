import { formatDate } from '@shared/utils'

import type { GstTimelineEvent } from '../../types/gst.types'
import './GSTTimeline.css'

export interface GSTTimelineProps {
  events: GstTimelineEvent[]
}

export const GSTTimeline = ({ events }: GSTTimelineProps) => (
  <ol className="gst-timeline">
    {events.map((event) => (
      <li className={`gst-timeline__item${event.isComplete ? ' is-complete' : ''}`} key={event.id}>
        <span className="gst-timeline__dot" aria-hidden="true" />
        <div>
          <p className="gst-timeline__label">{event.label}</p>
          {event.note && <p className="gst-timeline__note">{event.note}</p>}
          <p className="gst-timeline__date">{event.occurredAt ? formatDate(event.occurredAt) : 'Pending'}</p>
        </div>
      </li>
    ))}
  </ol>
)
