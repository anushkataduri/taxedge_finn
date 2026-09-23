import { Link } from 'react-router-dom';
import { routePaths } from '@core/config';
import type { GstAppRecord } from '../../hooks/useGstDashboardData';
import './GSTApplicationList.css';

interface GSTApplicationListProps {
  applications: GstAppRecord[];
}

export const GSTApplicationList = ({ applications }: GSTApplicationListProps) => {
  const getCountText = (count: number) => {
    if (count === 0) return 'No applications on record.';
    if (count === 1) return 'One on record.';
    if (count === 2) return 'Two on record.';
    return `${count} on record.`;
  };

  return (
    <div className="gst-app-list-container">
      <div className="gst-app-list-header">
        <h2>Your GST applications</h2>
        <p>{getCountText(applications.length)}</p>
      </div>

      <div className="gst-app-list">
        {applications.map((app, index) => {
          const isBlue = index % 2 === 0;
          const themeClass = isBlue ? 'theme-blue' : 'theme-orange';
          
          return (
            <Link to={routePaths.gst.detail(app.id)} key={app.id} className={`gst-app-item ${themeClass}`} style={{ textDecoration: 'none' }}>
              <div className="gst-app-item__icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              
              <div className="gst-app-item__content">
                <h3 className="gst-app-item__title">{app.title}</h3>
                <p className="gst-app-item__meta">
                  {app.reference} &middot; {app.details} &middot; {app.assignee}
                </p>
              </div>

              <div className="gst-app-item__status-area">
                <span className="gst-app-item__badge">
                  <span className="gst-app-item__badge-dot"></span>
                  {app.status}
                </span>
                <div className="gst-app-item__progress">
                  <div className="gst-app-item__progress-bar">
                    <div className="gst-app-item__progress-fill" style={{ width: `${app.progress}%` }}></div>
                  </div>
                  <span className="gst-app-item__progress-text">{app.progress}% complete</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
