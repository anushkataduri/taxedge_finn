import type { TaxReceipt } from '../../types/payments.types'
import './ReceiptCard.css'

interface ReceiptCardProps {
  receipt: TaxReceipt
}

export const ReceiptCard = ({ receipt }: ReceiptCardProps) => {
  const {
    receiptNumber,
    companyName,
    companyGstin,
    billedTo,
    invoiceDetails,
    lineItems,
    taxBreakdown,
    paymentDetails,
    amountInWords,
  } = receipt

  return (
    <article className="tax-receipt-card" id="printable-tax-receipt">
      {/* Green Header */}
      <header className="tax-receipt-card__header">
        <div className="tax-receipt-card__brand">
          <div className="tax-receipt-card__logo">TE</div>
          <div className="tax-receipt-card__company">
            <h2 className="tax-receipt-card__company-name">{companyName}</h2>
            <p className="tax-receipt-card__company-gstin">{companyGstin}</p>
          </div>
        </div>

        <div className="tax-receipt-card__invoice-meta">
          <span className="tax-receipt-card__invoice-tag">TAX INVOICE</span>
          <span className="tax-receipt-card__invoice-number">{receiptNumber}</span>
        </div>
      </header>

      {/* Body Section */}
      <div className="tax-receipt-card__body">
        {/* Parties & Invoice Details Grid */}
        <div className="tax-receipt-card__parties-grid">
          <div className="tax-receipt-card__billed-to">
            <span className="tax-receipt-card__section-label">BILLED TO</span>
            <h3 className="tax-receipt-card__client-name">{billedTo.name}</h3>
            {billedTo.tradeName && (
              <p className="tax-receipt-card__client-trade">{billedTo.tradeName}</p>
            )}
            {billedTo.addressLines.map((line, idx) => (
              <p key={idx} className="tax-receipt-card__client-address">
                {line}
              </p>
            ))}
            {billedTo.gstin && (
              <p className="tax-receipt-card__client-gstin">{billedTo.gstin}</p>
            )}
          </div>

          <div className="tax-receipt-card__invoice-details">
            <span className="tax-receipt-card__section-label">INVOICE DETAILS</span>
            <div className="tax-receipt-card__details-row">
              <span className="tax-receipt-card__detail-key">Date</span>
              <span className="tax-receipt-card__detail-val">{invoiceDetails.date}</span>
            </div>
            <div className="tax-receipt-card__details-row">
              <span className="tax-receipt-card__detail-key">Customer ID</span>
              <span className="tax-receipt-card__detail-val">{invoiceDetails.customerId}</span>
            </div>
            <div className="tax-receipt-card__details-row">
              <span className="tax-receipt-card__detail-key">Application</span>
              <span className="tax-receipt-card__detail-val">{invoiceDetails.applicationId}</span>
            </div>
            <div className="tax-receipt-card__details-row">
              <span className="tax-receipt-card__detail-key">Place of supply</span>
              <span className="tax-receipt-card__detail-val">{invoiceDetails.placeOfSupply}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider 1 */}
        <div className="tax-receipt-card__perforation">
          <div className="tax-receipt-card__perforation-cutout tax-receipt-card__perforation-cutout--left" />
          <div className="tax-receipt-card__perforation-line" />
          <div className="tax-receipt-card__perforation-cutout tax-receipt-card__perforation-cutout--right" />
        </div>

        {/* Line Items Table */}
        <div className="tax-receipt-card__table-wrapper">
          <table className="tax-receipt-card__table">
            <thead>
              <tr>
                <th className="tax-receipt-card__th tax-receipt-card__th--desc">DESCRIPTION</th>
                <th className="tax-receipt-card__th tax-receipt-card__th--sac">SAC</th>
                <th className="tax-receipt-card__th tax-receipt-card__th--amount">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="tax-receipt-card__tr">
                  <td className="tax-receipt-card__td tax-receipt-card__td--desc">
                    <strong className="tax-receipt-card__item-title">{item.title}</strong>
                    <span className="tax-receipt-card__item-sub">{item.subtitle}</span>
                  </td>
                  <td className="tax-receipt-card__td tax-receipt-card__td--sac">{item.sac}</td>
                  <td className="tax-receipt-card__td tax-receipt-card__td--amount">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax Breakdown */}
          <div className="tax-receipt-card__breakdown">
            <div className="tax-receipt-card__breakdown-row">
              <span className="tax-receipt-card__breakdown-label">Taxable value</span>
              <span className="tax-receipt-card__breakdown-value">{taxBreakdown.taxableValue}</span>
            </div>
            <div className="tax-receipt-card__breakdown-row">
              <span className="tax-receipt-card__breakdown-label">{taxBreakdown.cgstRate}</span>
              <span className="tax-receipt-card__breakdown-value">{taxBreakdown.cgstAmount}</span>
            </div>
            <div className="tax-receipt-card__breakdown-row">
              <span className="tax-receipt-card__breakdown-label">{taxBreakdown.sgstRate}</span>
              <span className="tax-receipt-card__breakdown-value">{taxBreakdown.sgstAmount}</span>
            </div>
            <div className="tax-receipt-card__breakdown-divider" />
            <div className="tax-receipt-card__breakdown-row tax-receipt-card__breakdown-row--total">
              <span className="tax-receipt-card__total-label">Total paid</span>
              <span className="tax-receipt-card__total-value">{taxBreakdown.totalPaid}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider 2 */}
        <div className="tax-receipt-card__perforation">
          <div className="tax-receipt-card__perforation-cutout tax-receipt-card__perforation-cutout--left" />
          <div className="tax-receipt-card__perforation-line" />
          <div className="tax-receipt-card__perforation-cutout tax-receipt-card__perforation-cutout--right" />
        </div>

        {/* Payment Details */}
        <div className="tax-receipt-card__payment-row">
          <div className="tax-receipt-card__payment-meta">
            <span className="tax-receipt-card__section-label">PAYMENT</span>
            <span className="tax-receipt-card__payment-method">{paymentDetails.method}</span>
            <span className="tax-receipt-card__payment-txn">{paymentDetails.transactionId}</span>
          </div>

          <div className="tax-receipt-card__payment-badge-col">
            <span className="tax-receipt-card__paid-badge">
              <span className="tax-receipt-card__paid-dot" />
              {paymentDetails.status}
            </span>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <footer className="tax-receipt-card__footer">
          <p className="tax-receipt-card__footer-disclaimer">
            This is a computer-generated invoice and does not require a signature.
          </p>
          <p className="tax-receipt-card__footer-words">
            Amount in words: {amountInWords}
          </p>
        </footer>
      </div>
    </article>
  )
}
