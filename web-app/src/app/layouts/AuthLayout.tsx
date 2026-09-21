import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

export const AuthLayout = () => {
  return (
    <div className="auth-layout-stage">
      {/* Decorative ambient background glow */}
      <div className="auth-layout-stage__swoop-glow" aria-hidden="true" />

      <main className="auth-layout-stage__content">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
