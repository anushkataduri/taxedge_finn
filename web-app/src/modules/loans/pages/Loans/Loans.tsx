import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { useLoans } from '../../hooks/useLoans'
import './Loans.css'

export const Loans = () => {
  const { data, isLoading, error } = useLoans()

  return (
    <div className="loans-page">
      <header className="loans-page__header">
        <h1 className="loans-page__title">Loans</h1>
        <p className="loans-page__subtitle">Applications and offers across lenders.</p>
      </header>

      {isLoading && <Loader label="Loading Loans" />}
      {error && <EmptyState title="Could not load Loans" description={error} />}

      {!isLoading && !error && (
        <Card title="Loans" subtitle="Wire this module up to the real API in services/loansService.ts">
          <ul className="loans-page__list">
            {(data ?? []).map((item) => (
              <li className="loans-page__row" key={item.id}>
                <div>
                  <p className="loans-page__row-title">{item.title}</p>
                  <p className="loans-page__row-meta">
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

export default Loans
