import { Link, useNavigate, useParams } from 'react-router-dom';
import { routePaths } from '@core/config';
import { EmptyState, Loader } from '@shared/components';
import { useGstMonthlyFilingDetail } from '../../hooks/useGstMonthlyFilingDetail';
import { GSTDocuments } from '../../components/GSTDocuments/GSTDocuments';
import { GSTTimelineTab } from '../../components/GSTTimelineTab/GSTTimelineTab';
import { GSTPaymentsTab } from '../../components/GSTPaymentsTab/GSTPaymentsTab';
import './GSTDetails.css';
import { useState } from 'react';

export const GSTDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGstMonthlyFilingDetail(id);
  const [activeTab, setActiveTab] = useState('summary');

  if (isLoading) return <Loader label="Loading application details" />;
  if (!data) return <EmptyState title="Application not found" />;

  const handleOpenMessage = () => {
    navigate(
      `${routePaths.support}?appId=${encodeURIComponent(data.reference)}&executiveId=exec_rohit&executiveName=Rohit%20Kulkarni&serviceName=${encodeURIComponent(data.title)}`
    );
  };

  return (
    <div className="gst-details-page">
      <nav className="gst-details-page__breadcrumb">
        <Link to={routePaths.gst.root}>Applications</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="breadcrumb-arrow">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
        <span>{data.reference}</span>
      </nav>

      <div className="gst-details-header-card">
        <div className="gst-details-header-card__top">
          <div className="gst-details-header-card__info">
            <span className="gst-details-header-card__ref">{data.reference}</span>
            <h1 className="gst-details-header-card__title">{data.title}</h1>
            <p className="gst-details-header-card__meta">{data.details}</p>
          </div>
          <div className="gst-details-header-card__actions">
            <button
              type="button"
              className="gst-details-btn-message"
              onClick={handleOpenMessage}
              aria-label="Message assigned executive"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Message
            </button>
            <button
              type="button"
              className="gst-details-btn-track"
              onClick={() => navigate(routePaths.gst.track(id || data.id || '1'))}
              aria-label="Track application progress"
            >
              Track
            </button>
          </div>
        </div>
        <div className="gst-details-header-card__progress">
          <div className="gst-details-header-card__progress-bar">
            <div className="gst-details-header-card__progress-fill" style={{ width: `${data.progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="gst-details-tabs">
        <button className={`gst-details-tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
        <button className={`gst-details-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>Documents <span className="tab-badge">8</span></button>
        <button className={`gst-details-tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>Timeline</button>
        <button className={`gst-details-tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments <span className="tab-badge">1</span></button>
      </div>

      {activeTab === 'summary' && (
        <div className="gst-details-grid">
          <div className="gst-details-card">
            <h2 className="gst-details-card__title">Application</h2>
            <div className="gst-details-table">
              <div className="gst-details-row">
                <span className="gst-details-label">Application ID</span>
                <span className="gst-details-value">{data.application.appId}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Service</span>
                <span className="gst-details-value">{data.application.service}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Period</span>
                <span className="gst-details-value">{data.application.period}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">GSTIN</span>
                <span className="gst-details-value">{data.application.gstin}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Opened</span>
                <span className="gst-details-value">{data.application.opened}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Due</span>
                <span className="gst-details-value">{data.application.due}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Current stage</span>
                <span className="gst-details-value">{data.application.currentStage}</span>
              </div>
            </div>
          </div>

          <div className="gst-details-card">
            <h2 className="gst-details-card__title">Return figures</h2>
            <div className="gst-details-table">
              <div className="gst-details-row">
                <span className="gst-details-label">Taxable turnover</span>
                <span className="gst-details-value">{data.returnFigures.taxableTurnover}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Output tax</span>
                <span className="gst-details-value">{data.returnFigures.outputTax}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">Input tax credit</span>
                <span className="gst-details-value">{data.returnFigures.inputTaxCredit}</span>
              </div>
              <div className="gst-details-row">
                <span className="gst-details-label">ITC reversed</span>
                <span className="gst-details-value">{data.returnFigures.itcReversed}</span>
              </div>
              <div className="gst-details-row gst-details-row--total">
                <span className="gst-details-label-total">Net payable</span>
                <span className="gst-details-value-total">{data.returnFigures.netPayable}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <GSTDocuments documents={data.documents} />
      )}

      {activeTab === 'timeline' && (
        <GSTTimelineTab events={data.timeline} />
      )}

      {activeTab === 'payments' && (
        <GSTPaymentsTab payments={data.payments} />
      )}
    </div>
  );
};

export default GSTDetails;
