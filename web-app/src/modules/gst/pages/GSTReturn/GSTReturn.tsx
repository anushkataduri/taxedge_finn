import { Card, EmptyState, Loader } from '@shared/components'
import { formatCurrency, formatDate } from '@shared/utils'

import { GSTStatus } from '../../components/GSTStatus/GSTStatus'
import { useGstReturns } from '../../hooks/useGstReturns'
import './GSTReturn.css'

export const GSTReturn = () => {
  const { data, isLoading, error } = useGstReturns()

  if (isLoading) return <Loader label="Loading returns" />
  if (error) return <EmptyState title="Could not load returns" description={error} />
  if (!data || data.length === 0) {
    return <EmptyState title="No returns filed yet" description="Filed returns will appear here." />
  }

  return (
    <div className="gst-return">
      <header className="gst-return__header">
        <h1 className="gst-return__title">GST returns</h1>
        <p className="gst-return__subtitle">Every period you have filed or are due to file.</p>
      </header>

      <Card padded={false}>
        <div className="gst-return__table-wrap">
          <table className="gst-return__table">
            <thead>
              <tr>
                <th scope="col">Return</th>
                <th scope="col">Period</th>
                <th scope="col">GSTIN</th>
                <th scope="col">Due on</th>
                <th scope="col">Tax payable</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.returnType}</td>
                  <td>{item.period}</td>
                  <td className="gst-return__mono">{item.gstin}</td>
                  <td>{formatDate(item.dueOn)}</td>
                  <td>{formatCurrency(item.taxPayable)}</td>
                  <td>
                    <GSTStatus status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default GSTReturn
