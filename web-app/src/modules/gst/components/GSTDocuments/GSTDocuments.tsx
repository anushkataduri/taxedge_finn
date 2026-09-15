import type { GstDocument } from '../../hooks/useGstMonthlyFilingDetail';
import './GSTDocuments.css';

interface GSTDocumentsProps {
  documents: GstDocument[];
}

export const GSTDocuments = ({ documents }: GSTDocumentsProps) => {
  const getIconForStatus = (status: GstDocument['status']) => {
    switch (status) {
      case 'verified':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'uploading':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 12 15 15" />
          </svg>
        );
      case 'pending':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'rejected':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
    }
  };

  return (
    <div className="gst-documents-list">
      {documents.map((doc) => (
        <div key={doc.id} className={`gst-document-item gst-document-item--${doc.status}`}>
          <div className="gst-document-item__icon-wrapper">
            {getIconForStatus(doc.status)}
          </div>
          
          <div className="gst-document-item__content">
            <h3 className="gst-document-item__title">{doc.title}</h3>
            <p className="gst-document-item__subtitle">{doc.subtitle}</p>
            
            {doc.status === 'uploading' && doc.progress !== undefined && (
              <div className="gst-document-item__progress-bar">
                <div 
                  className="gst-document-item__progress-fill" 
                  style={{ width: `${doc.progress}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="gst-document-item__actions">
            <span className="gst-document-item__status-badge">
              <span className="gst-document-item__status-dot"></span>
              <span className="gst-document-item__status-text">
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </span>
            
            {doc.status === 'verified' ? (
              <button className="gst-document-btn gst-document-btn--view">View</button>
            ) : (
              <button className="gst-document-btn gst-document-btn--upload">Upload</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
