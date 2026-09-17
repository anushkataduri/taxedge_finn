import type { GstTimelineEvent } from '../../hooks/useGstMonthlyFilingDetail'
import { GSTTimelineTracker } from '../GSTTimelineTracker/GSTTimelineTracker'

interface GSTTimelineTabProps {
  events: GstTimelineEvent[]
}

export const GSTTimelineTab = ({ events }: GSTTimelineTabProps) => {
  return <GSTTimelineTracker events={events} />
}
