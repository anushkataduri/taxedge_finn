import { AuthBrandLogo } from '../../components/AuthBrandLogo/AuthBrandLogo'
import { AuthMetricCards } from '../../components/AuthMetricCards/AuthMetricCards'
import { AuthPedestal } from '../../components/AuthPedestal/AuthPedestal'
import { AuthTrustBadges } from '../../components/AuthTrustBadges/AuthTrustBadges'
import { SignInCard } from '../../components/SignInCard/SignInCard'
import './Login.css'

export const Login = () => {
  return (
    <div className="login-screen">
      {/* Left Stage */}
      <section className="login-screen__left">
        <div className="login-screen__brand">
          <AuthBrandLogo />
        </div>

        <div className="login-screen__hero-text">
          <h1 className="login-screen__headline">
            Welcome back to <span className="login-screen__headline-orange">TaxEdge</span>
          </h1>
          <p className="login-screen__subtext">
            <span>Sign in to track your applications, upload documents and</span>
            <span>talk to your executive.</span>
          </p>
        </div>

        {/* 3D Pedestal with Phone, Tax sheet & Shield */}
        <div className="login-screen__visual-box">
          <AuthPedestal variant="signIn" />
        </div>

        {/* 3 Stat Counter Cards */}
        <AuthMetricCards />

        {/* Bottom Trust Badges */}
        <AuthTrustBadges />
      </section>

      {/* Center Dividing Vertical Line with Glowing Orange Ring Node */}
      <div className="login-screen__center-divider" aria-hidden="true">
        <div className="login-screen__divider-line" />
        <div className="login-screen__divider-node" />
      </div>

      {/* Right Stage: White Card */}
      <aside className="login-screen__right">
        <div className="login-screen__card-box">
          <SignInCard />
        </div>
      </aside>
    </div>
  )
}

export default Login
