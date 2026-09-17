import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { useApplications } from '../../hooks/useApplications'
import './Applications.css'

export const Applications = () => {
  const { data, isLoading, error } = useApplications()

  return (
    <div className="applications-page">
      <header className="applications-page__header">
        <h1 className="applications-page__title">Applications</h1>
        <p className="applications-page__subtitle">Every request you have raised, across modules.</p>
      </header>

      {isLoading && <Loader label="Loading Applications" />}
      {error && <EmptyState title="Could not load Applications" description={error} />}

      {!isLoading && !error && (
        <Card title="Applications" subtitle="Wire this module up to the real API in services/applicationsService.ts">
          <ul className="applications-page__list">
            {(data ?? []).map((item) => (
              <li className="applications-page__row" key={item.id}>
                <div>
                  <p className="applications-page__row-title">{item.title}</p>
                  <p className="applications-page__row-meta">
                    {item.reference} · {formatDate(item.updatedAt)}
                  </p>
                </div>
                <Badge tone={STATUS_TONES[item.status]}>{STATUS_LABELS[item.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

export default Applications
