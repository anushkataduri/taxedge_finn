import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import { GST_CERTIFICATE_META } from '../../../data/gstCertificateData'
import './GSTCertificateHeader.css'

interface GSTCertificateHeaderProps {
  onBackToAllForms?: () => void
}

export const GSTCertificateHeader = ({ onBackToAllForms }: GSTCertificateHeaderProps) => {
  return (
    <header className="gst-cert-header">
      {/* Top Breadcrumb & Metadata Row */}
      <div className="gst-cert-header__top">
        <nav className="gst-cert-header__breadcrumbs" aria-label="Breadcrumb">
          <Link
            to={routePaths.gst.root}
            onClick={onBackToAllForms}
            className="gst-cert-header__breadcrumb-link"
          >
            GST Form Screens
          </Link>
          <span className="gst-cert-header__breadcrumb-separator">→</span>
          <span className="gst-cert-header__breadcrumb-current">GST Certificate</span>
        </nav>
      </div>

      {/* Section Tag */}
      <div className="gst-cert-header__section-row">
        <span className="gst-cert-header__section-tag">{GST_CERTIFICATE_META.sectionTag}</span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="gst-cert-header__content">
        <h1 className="gst-cert-header__title">{GST_CERTIFICATE_META.title}</h1>
        <p className="gst-cert-header__description">{GST_CERTIFICATE_META.description}</p>
      </div>
    </header>
  )
}
