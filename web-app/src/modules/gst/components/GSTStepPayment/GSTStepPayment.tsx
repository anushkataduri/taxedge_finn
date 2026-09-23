import { useState, type FormEvent } from 'react'
import './GSTStepPayment.css'

interface GSTStepPaymentProps {
  amount?: number
  applicationRef?: string
  serviceTitle?: string
  onBack: () => void
  onSuccess: (paymentDetails: PaymentResult) => void
}

export interface PaymentResult {
  transactionId: string
  receiptNumber: string
  method: string
  dateText: string
  applicationRef: string
  amount: number
}

type PaymentMethodType = 'upi' | 'debit' | 'credit' | 'netbanking'

export const GSTStepPayment = ({
  amount = 5900,
  applicationRef = 'GST-2026-00118',
  serviceTitle = 'GST Registration',
  onBack,
  onSuccess,
}: GSTStepPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi')
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay')
  const [upiId, setUpiId] = useState<string>('anjali@okhdfcbank')
  const [promoCode, setPromoCode] = useState<string>('')
  const [discount, setDiscount] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const finalPayable = Math.max(0, amount - discount)

  const paymentMethods = [
    {
      id: 'upi' as PaymentMethodType,
      title: 'UPI',
      description: 'Google Pay, PhonePe, Paytm or any UPI app',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      id: 'debit' as PaymentMethodType,
      title: 'Debit card',
      description: 'Visa, Mastercard, RuPay',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      id: 'credit' as PaymentMethodType,
      title: 'Credit card',
      description: 'Visa, Mastercard, Amex · EMI available',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      id: 'netbanking' as PaymentMethodType,
      title: 'Net banking',
      description: 'All major Indian banks',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
        </svg>
      ),
    },
  ]

  const upiApps = [
    { id: 'gpay', name: 'GPay', color: '#4285F4', letter: 'G' },
    { id: 'phonepe', name: 'PhonePe', color: '#6739B7', letter: 'P' },
    { id: 'paytm', name: 'Paytm', color: '#00BAF2', letter: 'T' },
    { id: 'bhim', name: 'BHIM', color: '#008744', letter: 'B' },
  ]

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TAXEDGE10') {
      setDiscount(590)
    } else {
      setDiscount(0)
    }
  }

  const handlePay = (e: FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate immediate, reliable payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess({
        transactionId: `TXN26090211${Math.floor(100000 + Math.random() * 900000)}`,
        receiptNumber: 'TE/26-27/R-0912',
        method: `UPI · ${upiId}`,
        dateText: '2 Sep 2026, 10:42 AM',
        applicationRef,
        amount: finalPayable,
      })
    }, 600)
  }

  return (
    <div className="gst-step-payment">
      <div className="gst-step-payment__heading-block">
        <h1 className="gst-step-payment__title">Complete your payment</h1>
        <p className="gst-step-payment__subtitle">
          {serviceTitle} — application {applicationRef}
        </p>
      </div>

      <div className="gst-step-payment__layout">
        {/* Left Side: Payment Form */}
        <div className="gst-payment-main">
          <section className="gst-payment-card">
            <div className="gst-payment-card__header">
              <h2 className="gst-payment-card__title">Payment method</h2>
              <span className="gst-payment-secure-badge">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="gst-payment-secure-icon"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure
              </span>
            </div>

            <div className="gst-payment-methods-list">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id
                return (
                  <div
                    key={method.id}
                    className={`gst-payment-method-item ${
                      isSelected ? 'gst-payment-method-item--active' : ''
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="gst-payment-method-item__header">
                      <div className="gst-payment-method-item__icon-wrap">
                        {method.icon}
                      </div>

                      <div className="gst-payment-method-item__info">
                        <span className="gst-payment-method-item__title">
                          {method.title}
                        </span>
                        <span className="gst-payment-method-item__desc">
                          {method.description}
                        </span>
                      </div>

                      <div className="gst-payment-radio">
                        <div
                          className={`gst-payment-radio__circle ${
                            isSelected ? 'gst-payment-radio__circle--checked' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Sub-form when UPI is selected */}
                    {isSelected && method.id === 'upi' && (
                      <div
                        className="gst-upi-details-pane"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="gst-upi-label">Pay with</span>
                        <div className="gst-upi-apps-row">
                          {upiApps.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              className={`gst-upi-app-btn ${
                                selectedUpiApp === app.id
                                  ? 'gst-upi-app-btn--active'
                                  : ''
                              }`}
                              onClick={() => setSelectedUpiApp(app.id)}
                            >
                              <span
                                className="gst-upi-app-badge"
                                style={{ backgroundColor: app.color }}
                              >
                                {app.letter}
                              </span>
                              <span className="gst-upi-app-name">{app.name}</span>
                            </button>
                          ))}
                        </div>

                        <label className="gst-upi-label" htmlFor="upiIdInput">
                          Or enter your UPI ID
                        </label>
                        <input
                          id="upiIdInput"
                          type="text"
                          className="gst-form-input gst-upi-input"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@bank"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              className="gst-btn-pay-securely"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? (
                'Processing payment...'
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="gst-btn-pay-lock"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Pay ₹{finalPayable.toLocaleString('en-IN')} securely
                </>
              )}
            </button>

            <p className="gst-payment-gateway-note">
              Payments are processed by a PCI-DSS compliant gateway. TaxEdge never stores your
              card details.
            </p>
          </section>

          <div className="gst-step-actions">
            <button
              type="button"
              className="gst-btn-back"
              onClick={onBack}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="gst-btn-back-arrow"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to review
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary & What happens card */}
        <aside className="gst-payment-sidebar">
          <div className="gst-order-card">
            <h3 className="gst-order-card__title">Order summary</h3>

            <div className="gst-order-card__table">
              <div className="gst-order-card__row">
                <span className="gst-order-card__label">{serviceTitle}</span>
                <span className="gst-order-card__value">₹5,000</span>
              </div>

              <div className="gst-order-card__row">
                <span className="gst-order-card__label">GST @ 18%</span>
                <span className="gst-order-card__value">₹900</span>
              </div>

              {discount > 0 && (
                <div className="gst-order-card__row">
                  <span className="gst-order-card__label">Discount</span>
                  <span className="gst-order-card__value gst-order-card__value--verified">
                    -₹{discount}
                  </span>
                </div>
              )}

              <div className="gst-order-card__divider" />

              <div className="gst-order-card__row gst-order-card__row--total">
                <span className="gst-order-card__total-label">Total payable</span>
                <span className="gst-order-card__total-amount">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="gst-promo-row">
              <input
                type="text"
                className="gst-promo-input"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              />
              <button
                type="button"
                className="gst-btn-promo-apply"
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>
          </div>

          <div className="gst-order-callout gst-order-callout--security">
            <h4 className="gst-order-callout__title">What happens after payment</h4>
            <p className="gst-order-callout__body">
              A GST-compliant receipt is generated instantly and your application moves to
              active. Your executive is notified the same minute.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
