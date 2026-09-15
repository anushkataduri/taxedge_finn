import { useNavigate } from 'react-router-dom';
import { routePaths } from '@core/config';
import type { GstPayment } from '../../hooks/useGstMonthlyFilingDetail';
import './GSTPaymentsTab.css';

interface GSTPaymentsTabProps {
  payments: GstPayment[];
}

export const GSTPaymentsTab = ({ payments }: GSTPaymentsTabProps) => {
  const navigate = useNavigate();
  return (
    <div className="gst-payments-container">
      <div className="gst-payments-card">
        <div className="gst-payments-table">
          <div className="gst-payments-table__header">
            <div className="gst-payments-cell gst-payments-cell--receipt">RECEIPT</div>
            <div className="gst-payments-cell gst-payments-cell--desc">DESCRIPTION</div>
            <div className="gst-payments-cell gst-payments-cell--amount">AMOUNT</div>
            <div className="gst-payments-cell gst-payments-cell--method">METHOD</div>
            <div className="gst-payments-cell gst-payments-cell--date">DATE</div>
            <div className="gst-payments-cell gst-payments-cell--status">STATUS</div>
          </div>
          
          <div className="gst-payments-table__body">
            {payments.map((payment) => (
              <div key={payment.id} className="gst-payments-row">
                <div className="gst-payments-cell gst-payments-cell--receipt">
                  <span className="gst-payments-receipt-number">{payment.receiptNumber}</span>
                </div>
                <div className="gst-payments-cell gst-payments-cell--desc">
                  {payment.description}
                </div>
                <div className="gst-payments-cell gst-payments-cell--amount">
                  {payment.amount}
                </div>
                <div className="gst-payments-cell gst-payments-cell--method">
                  {payment.method}
                </div>
                <div className="gst-payments-cell gst-payments-cell--date">
                  {payment.date}
                </div>
                <div className="gst-payments-cell gst-payments-cell--status">
                  <span className={`gst-payments-badge gst-payments-badge--${payment.status}`}>
                    <span className="gst-payments-badge-dot"></span>
                    <span className="gst-payments-badge-text">
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Download receipt button navigating to tax invoice receipt */}
      <button
        type="button"
        className="gst-payments-download-btn"
        onClick={() => navigate(`${routePaths.paymentReceiptDirect}?id=GST-2026-00118`)}
        aria-label="Download receipt"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="download-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download receipt
      </button>
    </div>
  );
};
