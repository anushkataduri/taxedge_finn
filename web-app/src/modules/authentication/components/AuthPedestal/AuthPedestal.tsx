import './AuthPedestal.css'

export interface AuthPedestalProps {
  variant: 'getStarted' | 'signIn' | 'otp'
}

export const AuthPedestal = ({ variant }: AuthPedestalProps) => {
  return (
    <div className="auth-pedestal" aria-hidden="true">
      {/* Orbital paths & sparkling nodes */}
      <div className="auth-pedestal__orbitals">
        <div className="auth-pedestal__orbit-ring auth-pedestal__orbit-ring--1">
          <div className="auth-pedestal__node" style={{ top: '15%', left: '80%' }} />
          <div className="auth-pedestal__node auth-pedestal__node--blue" style={{ bottom: '20%', left: '15%' }} />
        </div>
        <div className="auth-pedestal__orbit-ring auth-pedestal__orbit-ring--2">
          <div className="auth-pedestal__node" style={{ top: '65%', right: '10%' }} />
        </div>
      </div>

      {/* 3D Visual Assets Composition */}
      <div className="auth-pedestal__visual-wrapper">
        {variant === 'getStarted' && (
          <>
            {/* Left 3D GST Document Sheet */}
            <div className="auth-pedestal__doc auth-pedestal__doc--gst">
              <span className="auth-pedestal__doc-header">GST</span>
              <div className="auth-pedestal__doc-lines">
                <div className="auth-pedestal__doc-line" />
                <div className="auth-pedestal__doc-line auth-pedestal__doc-line--short" />
              </div>
              <div className="auth-pedestal__doc-chart">
                <div className="auth-pedestal__chart-bar auth-pedestal__chart-bar--1" />
                <div className="auth-pedestal__chart-bar auth-pedestal__chart-bar--2" />
                <div className="auth-pedestal__chart-bar auth-pedestal__chart-bar--3" />
              </div>
            </div>

            {/* Right 3D ITR Document Sheet */}
            <div className="auth-pedestal__doc auth-pedestal__doc--itr">
              <span className="auth-pedestal__doc-header">ITR</span>
              <div className="auth-pedestal__doc-lines">
                <div className="auth-pedestal__doc-line" />
                <div className="auth-pedestal__doc-line auth-pedestal__doc-line--med" />
                <div className="auth-pedestal__doc-line auth-pedestal__doc-line--short" />
              </div>
            </div>

            {/* Center Front 3D Shield with Checkmark */}
            <div className="auth-pedestal__shield-badge auth-pedestal__shield-badge--center">
              <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 2L4 9.5V26C4 39.5 12.5 50.8 24 54C35.5 50.8 44 39.5 44 26V9.5L24 2Z"
                  fill="url(#shield_orange_grad)"
                  stroke="#FFAC4D"
                  strokeWidth="2"
                />
                <path
                  d="M16 27.5L21.5 33L32 22.5"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="shield_orange_grad" x1="4" y1="2" x2="44" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF851A" />
                    <stop offset="1" stopColor="#E64A00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Floating checkmark pill badge */}
            <div className="auth-pedestal__check-pill">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </>
        )}

        {variant === 'signIn' && (
          <>
            {/* 3D Smartphone on left */}
            <div className="auth-pedestal__phone auth-pedestal__phone--left">
              <div className="auth-pedestal__phone-notch" />
              <div className="auth-pedestal__phone-screen">
                <div className="auth-pedestal__phone-avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3D TAX Statement Sheet on right with 3D colorful bar charts */}
            <div className="auth-pedestal__doc auth-pedestal__doc--tax">
              <span className="auth-pedestal__doc-header">TAX</span>
              <div className="auth-pedestal__doc-lines">
                <div className="auth-pedestal__doc-line" />
                <div className="auth-pedestal__doc-line auth-pedestal__doc-line--short" />
              </div>
              <div className="auth-pedestal__tax-columns">
                <div className="auth-pedestal__tax-bar auth-pedestal__tax-bar--blue" />
                <div className="auth-pedestal__tax-bar auth-pedestal__tax-bar--amber" />
                <div className="auth-pedestal__tax-bar auth-pedestal__tax-bar--orange" />
              </div>
            </div>

            {/* Front 3D Shield with Lock Icon */}
            <div className="auth-pedestal__shield-badge auth-pedestal__shield-badge--front">
              <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 2L4 9.5V26C4 39.5 12.5 50.8 24 54C35.5 50.8 44 39.5 44 26V9.5L24 2Z"
                  fill="url(#shield_lock_grad)"
                  stroke="#FFB054"
                  strokeWidth="2"
                />
                {/* Padlock Icon */}
                <rect x="18" y="27" width="12" height="11" rx="2" fill="#FFFFFF" />
                <path d="M20 27V23C20 20.8 21.8 19 24 19C26.2 19 28 20.8 28 23V27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="32.5" r="1.5" fill="#E65100" />
                <defs>
                  <linearGradient id="shield_lock_grad" x1="4" y1="2" x2="44" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF8E24" />
                    <stop offset="1" stopColor="#E65100" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </>
        )}

        {variant === 'otp' && (
          <>
            {/* Center 3D Smartphone */}
            <div className="auth-pedestal__phone auth-pedestal__phone--center">
              <div className="auth-pedestal__phone-notch" />
              <div className="auth-pedestal__phone-screen">
                <div className="auth-pedestal__shield-badge--on-phone">
                  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M24 2L4 9.5V26C4 39.5 12.5 50.8 24 54C35.5 50.8 44 39.5 44 26V9.5L24 2Z"
                      fill="url(#shield_otp_grad)"
                      stroke="#FFB054"
                      strokeWidth="2"
                    />
                    <rect x="18" y="27" width="12" height="11" rx="2" fill="#FFFFFF" />
                    <path d="M20 27V23C20 20.8 21.8 19 24 19C26.2 19 28 20.8 28 23V27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="24" cy="32.5" r="1.5" fill="#E65100" />
                    <defs>
                      <linearGradient id="shield_otp_grad" x1="4" y1="2" x2="44" y2="54" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8E24" />
                        <stop offset="1" stopColor="#E65100" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* 3D Speech Bubble popup with OTP stars */}
            <div className="auth-pedestal__speech-bubble">
              <span className="auth-pedestal__otp-star">★</span>
              <span className="auth-pedestal__otp-star">★</span>
              <span className="auth-pedestal__otp-star">★</span>
              <span className="auth-pedestal__otp-star">★</span>
              <span className="auth-pedestal__otp-star">★</span>
            </div>
          </>
        )}
      </div>

      {/* Stage Bottom Glowing Concentric Pedestal */}
      <div className="auth-pedestal__stage">
        <div className="auth-pedestal__disc-bottom" />
        <div className="auth-pedestal__disc-ring-orange" />
        <div className="auth-pedestal__disc-ring-blue" />
        <div className="auth-pedestal__disc-top" />
      </div>
    </div>
  )
}
