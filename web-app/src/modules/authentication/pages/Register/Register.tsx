import { AuthBrandLogo } from '../../components/AuthBrandLogo/AuthBrandLogo'
import { AuthOverviewCard } from '../../components/AuthOverviewCard/AuthOverviewCard'
import { AuthPedestal } from '../../components/AuthPedestal/AuthPedestal'
import { AuthStatsBar } from '../../components/AuthStatsBar/AuthStatsBar'
import { GetStartedCard } from '../../components/GetStartedCard/GetStartedCard'
import { GET_STARTED_SERVICES } from '../../constants/authData.constants'
import type { ServicePill } from '../../constants/authData.constants'
import './Register.css'

export const Register = () => {
  const renderServiceIcon = (type: ServicePill['iconType']) => {
    switch (type) {
      case 'gst':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'itr':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        )
      case 'loan':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
        )
      case 'compliance':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        )
      case 'tds':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="register-screen">
      {/* Left 50% Stage */}
      <section className="register-screen__left">
        <div className="register-screen__brand">
          <AuthBrandLogo />
        </div>

        <div className="register-screen__hero-text">
          <h1 className="register-screen__headline">
            Your financial services, <span className="register-screen__headline-orange">simplified.</span>
          </h1>
          <p className="register-screen__subtext">
            GST, ITR, loans and documentation — manage everything digitally with expert assistance from
            certified professionals. No repeat visits to the office.
          </p>
        </div>

        {/* 5 Service Badges in 2 Rows */}
        <div className="register-screen__services-grid">
          {GET_STARTED_SERVICES.map((service) => (
            <div key={service.id} className="register-screen__service-pill">
              <span className="register-screen__service-icon">{renderServiceIcon(service.iconType)}</span>
              <span>{service.label}</span>
            </div>
          ))}
        </div>

        {/* Side-by-Side: Overview Card + 3D Pedestal Visual with zero overlap */}
        <div className="register-screen__visual-row">
          <AuthOverviewCard />
          <AuthPedestal variant="getStarted" />
        </div>

        {/* Bottom Key Stats Bar */}
        <AuthStatsBar />
      </section>

      {/* Center Dividing Vertical Line with Glowing Orange Ring Node */}
      <div className="register-screen__center-divider" aria-hidden="true">
        <div className="register-screen__divider-line" />
        <div className="register-screen__divider-node" />
      </div>

      {/* Right 50% Stage: White Card */}
      <aside className="register-screen__right">
        <div className="register-screen__card-box">
          <GetStartedCard />
        </div>
      </aside>
    </div>
  )
}

export default Register
