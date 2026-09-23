import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@core/auth'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'

import { ProfileForm } from '../../components/ProfileForm/ProfileForm'
import { SecurityFeatures } from '../../components/SecurityFeatures/SecurityFeatures'
import { profileService } from '../../services/profileService'
import { authFlowService } from '@modules/authentication/services/authFlowService'
import type { ProfileFormValues } from '../../validation/profileSchema'
import './CreateProfilePage.css'

export const CreateProfilePage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      try {
        await profileService.createProfile(values)
      } catch (err) {
        console.warn('Profile service in dev mode:', err)
      }

      const userMobile = (values.mobile || user?.mobile || '').replace(/\D/g, '')

      const updatedUser = {
        id: user?.id || `usr_${Date.now().toString(36)}`,
        fullName: values.fullName,
        email: values.email,
        mobile: userMobile,
        role: user?.role || 'CUSTOMER',
        permissions: user?.permissions || [],
        isProfileComplete: false,
      }

      // Save registration step 1 state and user's 6-digit passcode
      await authFlowService.saveRegistrationStep1({
        mobile: userMobile,
        passcode: values.passcode,
        user: updatedUser,
      })

      setUser(updatedUser)

      authService.startSession({
        user: updatedUser,
        tokens: {
          accessToken: authService.getAccessToken() || 'mock.access.token',
          refreshToken: authService.getRefreshToken() || 'mock.refresh.token',
        },
      })

      navigate(routePaths.customerType)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-profile-page">
      {/* Left Information Panel (50% Dark Navy) */}
      <aside className="create-profile-page__left-panel">
        {/* Bottom Left Corner Orange Wave Accent */}
        <div className="create-profile-page__wave-bottom-left" aria-hidden="true" />

        {/* 1. Top Brand Header */}
        <div className="create-profile-page__brand-header">
          <div className="create-profile-page__logo-tile">
            <img src="/logo-dark.png" alt="TaxEdge" className="create-profile-page__logo-img" />
          </div>
          <div className="create-profile-page__brand-text">
            <span className="create-profile-page__brand-title">
              Tax<span className="create-profile-page__brand-title-accent">Edge</span>
            </span>
            <span className="create-profile-page__brand-subtitle">FIN SOLUTIONS</span>
          </div>
        </div>

        {/* 2. Middle Row: Heading & Text on Left, Cards Graphic on Right */}
        <div className="create-profile-page__middle-grid">
          <div className="create-profile-page__text-col">
            <h1 className="create-profile-page__heading">
              Tell us who we <br />
              <span className="create-profile-page__heading-orange">are filing for</span>
            </h1>
            <p className="create-profile-page__desc">
              Your PAN and Aadhaar let us pre-fill returns and pull your AIS and TIS data. They are
              stored encrypted and shown only to the executive assigned to you.
            </p>
          </div>

          <div className="create-profile-page__graphic-col" aria-hidden="true">
            <div className="create-profile-page__graphic">
              {/* Aadhaar Card (Back Right) */}
              <div className="security-card security-card--aadhaar">
                <div className="security-card__aadhaar-top">
                  <div className="security-card__aadhaar-emblem">
                    <svg viewBox="0 0 32 32" fill="none" className="aadhaar-sun">
                      <circle cx="16" cy="16" r="6" fill="#F97316" />
                      <path
                        d="M16 2v4M16 26v4M2 16h4M26 16h4M6.1 6.1l2.8 2.8M23.1 23.1l2.8 2.8M6.1 25.9l2.8-2.8M23.1 8.9l2.8-2.8"
                        stroke="#F97316"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="security-card__aadhaar-tag">AADHAAR</span>
                  </div>
                </div>
                <div className="security-card__lines">
                  <div className="security-card__line security-card__line--short" />
                  <div className="security-card__line security-card__line--long" />
                  <div className="security-card__line security-card__line--medium" />
                </div>
              </div>

              {/* PAN Card (Front Left) */}
              <div className="security-card security-card--pan">
                <div className="security-card__pan-header">
                  <div className="security-card__pan-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="pan-user-icon">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="security-card__pan-info">
                    <span className="security-card__pan-label">PAN</span>
                    <div className="security-card__line security-card__line--sm" />
                  </div>
                </div>
                <div className="security-card__pan-body">
                  <div className="security-card__pan-strip" />
                  <div className="security-card__pan-strip" />
                </div>
              </div>

              {/* Orange Shield */}
              <div className="security-card__shield">
                <svg viewBox="0 0 24 24" fill="currentColor" className="shield-svg">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <div className="security-card__shield-lock">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="10" width="12" height="11" rx="2" fill="#ffffff" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Security Feature Rows */}
        <div className="create-profile-page__security-bottom">
          <SecurityFeatures />
        </div>
      </aside>

      {/* Right Form Card (50% White / Light Surface) */}
      <main className="create-profile-page__right-section">
        <div className="create-profile-page__card">
          <header className="create-profile-page__form-header">
            <h2 className="create-profile-page__title">Create your profile</h2>
            <p className="create-profile-page__subtitle">Step 1 of 2 — your details.</p>
          </header>

          <ProfileForm
            initialValues={{
              fullName: user?.fullName || '',
              email: user?.email || '',
              mobile: user?.mobile || '',
            }}
            onSubmit={handleProfileSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </main>
    </div>
  )
}

export default CreateProfilePage
