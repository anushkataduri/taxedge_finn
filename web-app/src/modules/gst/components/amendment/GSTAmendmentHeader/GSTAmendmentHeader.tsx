import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import './GSTAmendmentHeader.css'

interface GSTAmendmentHeaderProps {
  onBackToAllForms?: () => void
}

export const GSTAmendmentHeader = ({ onBackToAllForms }: GSTAmendmentHeaderProps) => {
  return (
    <header className="gst-amend-header">
      {/* Top Breadcrumb & Metadata Row */}
      <div className="gst-amend-header__top">
        <nav className="gst-amend-header__breadcrumbs" aria-label="Breadcrumb">
          <Link
            to={routePaths.gst.root}
            onClick={onBackToAllForms}
            className="gst-amend-header__breadcrumb-link"
          >
            GST Form Screens
          </Link>
          <span className="gst-amend-header__breadcrumb-separator">→</span>
          <span className="gst-amend-header__breadcrumb-current">GST Amendment</span>
        </nav>
      </div>

      {/* Section & Status Tag */}
      <div className="gst-amend-header__section-row">
        <span className="gst-amend-header__section-tag">SECTION 5 · FORM 4 OF 5</span>
        <span className="gst-amend-header__new-badge">
          <span className="gst-amend-header__new-dot" />
          New — defined in this document
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="gst-amend-header__content">
        <h1 className="gst-amend-header__title">GST Amendment</h1>
        <p className="gst-amend-header__description">
          For a customer updating a detail on their existing GST registration — for example, a new
          address or business name.
        </p>
      </div>
    </header>
  )
}
