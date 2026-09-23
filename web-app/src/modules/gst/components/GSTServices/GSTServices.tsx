import { useNavigate } from 'react-router-dom';
import { routePaths } from '@core/config';
import type { GstService } from '../../hooks/useGstDashboardData';
import './GSTServices.css';

interface GSTServicesProps {
  services: GstService[];
}

const getServiceIcon = (type: GstService['iconType']) => {
  switch (type) {
    case 'registration':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'filing':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l2 2 4-4" />
        </svg>
      );
    case 'compliance':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'cancellation':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'amendment':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'certificate':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
  }
};

export const GSTServices = ({ services }: GSTServicesProps) => {
  const navigate = useNavigate();

  const handleStart = (service: GstService) => {
    if (service.iconType === 'registration' || service.id === '1') {
      navigate(routePaths.gst.registration);
    } else if (service.iconType === 'filing' || service.id === '2') {
      navigate(routePaths.gst.filing);
    } else if (service.iconType === 'compliance' || service.id === '3') {
      navigate(routePaths.gst.compliance);
    } else if (service.iconType === 'cancellation' || service.id === '4') {
      navigate(routePaths.gst.cancellation);
    } else if (service.iconType === 'amendment' || service.id === '5') {
      navigate(routePaths.gst.amendment);
    } else if (service.iconType === 'certificate' || service.id === '6') {
      navigate(routePaths.gst.certificate);
    } else {
      navigate(routePaths.gst.registration);
    }
  };

  return (
    <div className="gst-services-grid">
      {services.map((service, index) => (
        <div
          key={service.id}
          className="gst-service-card"
          onClick={() => handleStart(service)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStart(service);
            }
          }}
        >
          <div className={`gst-service-card__icon ${index % 2 === 0 ? 'icon-blue' : 'icon-orange'}`}>
            {getServiceIcon(service.iconType)}
          </div>
          <h3 className="gst-service-card__title">{service.title}</h3>
          <p className="gst-service-card__description">{service.description}</p>
          
          <div className="gst-service-card__footer">
            <div className="gst-service-card__price-wrapper">
              <span className="gst-service-card__price">{service.price}</span>
              <span className="gst-service-card__price-type">{service.priceType}</span>
            </div>
            <button
              type="button"
              className="gst-service-card__action"
              onClick={() => handleStart(service)}
              aria-label={`Start ${service.title}`}
            >
              Start
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-service-card__arrow">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
