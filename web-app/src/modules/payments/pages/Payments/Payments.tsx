import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { usePayments } from '../../hooks/usePayments'
import './Payments.css'

export const Payments = () => {
  const { data, isLoading, error } = usePayments()

  return (
    <div className="payments-page">
      <header className="payments-page__header">
        <h1 className="payments-page__title">Payments</h1>
        <p className="payments-page__subtitle">Invoices and receipts for TaxEdge services.</p>
      </header>

      {isLoading && <Loader label="Loading Payments" />}
      {error && <EmptyState title="Could not load Payments" description={error} />}

      {!isLoading && !error && (
        <Card title="Payments" subtitle="Wire this module up to the real API in services/paymentsService.ts">
          <ul className="payments-page__list">
            {(data ?? []).map((item) => (
              <li className="payments-page__row" key={item.id}>
                <div>
                  <p className="payments-page__row-title">{item.title}</p>
                  <p className="payments-page__row-meta">
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

export default Payments
