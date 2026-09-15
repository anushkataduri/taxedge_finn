import { Badge } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import type { ApplicationStatus } from '@shared/types'

export interface GSTStatusProps {
  status: ApplicationStatus
}

export const GSTStatus = ({ status }: GSTStatusProps) => (
  <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
)
