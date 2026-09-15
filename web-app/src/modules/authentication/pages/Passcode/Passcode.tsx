import { useLocation } from 'react-router-dom'
import { AuthBrandLogo } from '../../components/AuthBrandLogo/AuthBrandLogo'
import { AuthPedestal } from '../../components/AuthPedestal/AuthPedestal'
import { PasscodeCard } from '../../components/PasscodeCard/PasscodeCard'
import './Passcode.css'

interface PasscodeRouterLocationState {
  mobile?: string
  countryCode?: string
}

export const Passcode = () => {
  const location = useLocation()
  const locationState = location.state as PasscodeRouterLocationState | null
  const mobile = locationState?.mobile ?? '9867041255'
  const countryCode = locationState?.countryCode ?? '+91'

  return (
    <div className="passcode-screen">
      {/* Left Stage */}
      <section className="passcode-screen__left">
        <div className="passcode-screen__brand">
          <AuthBrandLogo />
        </div>

        <div className="passcode-screen__hero-text">
          <h1 className="passcode-screen__headline">
            Welcome back to <span className="passcode-screen__headline-orange">TaxEdge</span>
          </h1>
          <p className="passcode-screen__subtext">
            <span>Enter your 6-digit passcode to sign in quickly</span>
            <span>and access your filings securely.</span>
          </p>
        </div>

        {/* 3D Pedestal with Phone, Shield and Lock visual */}
        <div className="passcode-screen__visual-box">
          <AuthPedestal variant="signIn" />
        </div>
      </section>

      {/* Center Dividing Vertical Line with Glowing Orange Ring Node */}
      <div className="passcode-screen__center-divider" aria-hidden="true">
        <div className="passcode-screen__divider-line" />
        <div className="passcode-screen__divider-node" />
      </div>

      {/* Right Stage: White Card */}
      <aside className="passcode-screen__right">
        <div className="passcode-screen__card-box">
          <PasscodeCard mobile={mobile} countryCode={countryCode} />
        </div>
      </aside>
    </div>
  )
}

export default Passcode
