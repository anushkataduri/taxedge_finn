import { useLocation } from 'react-router-dom'
import { AuthBrandLogo } from '../../components/AuthBrandLogo/AuthBrandLogo'
import { AuthPedestal } from '../../components/AuthPedestal/AuthPedestal'
import { OtpVerificationCard } from '../../components/OtpVerificationCard/OtpVerificationCard'
import './OTP.css'

interface OtpRouterLocationState {
  mobile?: string
  countryCode?: string
}

export const OTP = () => {
  const location = useLocation()
  const locationState = location.state as OtpRouterLocationState | null
  const mobile = locationState?.mobile ?? '9867041255'
  const countryCode = locationState?.countryCode ?? '+91'

  return (
    <div className="otp-screen">
      {/* Left Stage */}
      <section className="otp-screen__left">
        <div className="otp-screen__brand">
          <AuthBrandLogo />
        </div>

        <div className="otp-screen__hero-text">
          <h1 className="otp-screen__headline">
            One code, <span className="otp-screen__headline-orange">and you are in</span>
          </h1>
          <p className="otp-screen__subtext">
            <span>OTP authentication protects every account. We never</span>
            <span>ask for your code over a call or WhatsApp.</span>
          </p>
        </div>

        {/* 3D Pedestal with Phone, Shield and 5-star OTP speech bubble */}
        <div className="otp-screen__visual-box">
          <AuthPedestal variant="otp" />
        </div>
      </section>

      {/* Center Dividing Vertical Line with Glowing Orange Ring Node */}
      <div className="otp-screen__center-divider" aria-hidden="true">
        <div className="otp-screen__divider-line" />
        <div className="otp-screen__divider-node" />
      </div>

      {/* Right Stage: White Card */}
      <aside className="otp-screen__right">
        <div className="otp-screen__card-box">
          <OtpVerificationCard mobile={mobile} countryCode={countryCode} />
        </div>
      </aside>
    </div>
  )
}

export default OTP
