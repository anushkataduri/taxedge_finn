import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { useInsurance } from '../../hooks/useInsurance'
import './Insurance.css'

export const Insurance = () => {
  const { data, isLoading, error } = useInsurance()

  return (
    <div className="insurance-page">
      <header className="insurance-page__header">
        <h1 className="insurance-page__title">Insurance</h1>
        <p className="insurance-page__subtitle">Policies, renewals and claims.</p>
      </header>

      {isLoading && <Loader label="Loading Insurance" />}
      {error && <EmptyState title="Could not load Insurance" description={error} />}

      {!isLoading && !error && (
        <Card title="Insurance" subtitle="Wire this module up to the real API in services/insuranceService.ts">
          <ul className="insurance-page__list">
            {(data ?? []).map((item) => (
              <li className="insurance-page__row" key={item.id}>
                <div>
                  <p className="insurance-page__row-title">{item.title}</p>
                  <p className="insurance-page__row-meta">
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

export default Insurance
