import { Link } from 'react-router-dom'

import { routePaths } from '@core/config'
import { formatDate, titleCase } from '@shared/utils'

import { GSTStatus } from '../GSTStatus/GSTStatus'
import type { GstApplication } from '../../types/gst.types'
import './GSTCard.css'

export interface GSTCardProps {
  application: GstApplication
}

export const GSTCard = ({ application }: GSTCardProps) => (
  <Link className="gst-card" to={routePaths.gst.detail(application.id)}>
    <header className="gst-card__header">
      <div>
        <h3 className="gst-card__name">{application.legalName}</h3>
        <p className="gst-card__reference">{application.reference}</p>
      </div>
      <GSTStatus status={application.status} />
    </header>

    <dl className="gst-card__meta">
      <div>
        <dt>Business type</dt>
        <dd>{titleCase(application.businessType)}</dd>
      </div>
      <div>
        <dt>State</dt>
        <dd>{application.state}</dd>
      </div>
      <div>
        <dt>GSTIN</dt>
        <dd>{application.gstin ?? 'Not issued yet'}</dd>
      </div>
      <div>
        <dt>Updated</dt>
        <dd>{formatDate(application.updatedAt)}</dd>
      </div>
    </dl>
  </Link>
)
