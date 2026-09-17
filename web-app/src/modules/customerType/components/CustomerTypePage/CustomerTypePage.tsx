import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@core/auth'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'

import { BrandPanel } from '../BrandPanel/BrandPanel'
import { BackButton } from '../BackButton/BackButton'
import { CustomerTypeList } from '../CustomerTypeList/CustomerTypeList'
import { CreateAccountButton } from '../CreateAccountButton/CreateAccountButton'
import { CUSTOMER_TYPE_OPTIONS } from '../../data/customerTypeOptions'
import { useCustomerType } from '../../hooks/useCustomerType'
import { authFlowService } from '@modules/authentication/services/authFlowService'
import './CustomerTypePage.css'

export const CustomerTypePage = () => {
  const navigate = useNavigate()
  const { selectedId, setSelectedId } = useCustomerType(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const handleBack = () => {
    navigate(-1)
  }

  const handleCreateAccount = async () => {
    if (!selectedId) return

    setIsSubmitting(true)
    try {
      const currentUser = user || authService.getUser()
      const userMobile = currentUser?.mobile || ''

      if (userMobile) {
        await authFlowService.completeRegistration(userMobile)
      }

      if (currentUser) {
        const completedUser = {
          ...currentUser,
          isProfileComplete: true,
        }
        setUser(completedUser)
        authService.startSession({
          user: completedUser,
          tokens: {
            accessToken: authService.getAccessToken() || 'mock.access.token',
            refreshToken: authService.getRefreshToken() || 'mock.refresh.token',
          },
        })
      }

      // Complete registration and enter dashboard
      navigate(routePaths.dashboard, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="customer-type-page">
      {/* 1. Left Fixed Brand Panel (Desktop & Tablet) */}
      <BrandPanel />

      {/* 2. Right Vertically Scrollable Content Panel */}
      <main className="customer-type-page__content-panel">
        <div className="customer-type-page__scroll-container">
          {/* Top Navigation */}
          <div className="customer-type-page__top-nav">
            <BackButton onClick={handleBack} />
          </div>

          {/* Heading & Subtitle */}
          <header className="customer-type-page__header">
            <h1 className="customer-type-page__title">What describes you best?</h1>
            <p className="customer-type-page__subtitle">Step 2 of 2 — customer type.</p>
          </header>

          {/* Customer Type Selection Cards List */}
          <section className="customer-type-page__list-section" aria-label="Customer Type Selection">
            <CustomerTypeList
              options={CUSTOMER_TYPE_OPTIONS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

          {/* Bottom Action CTA */}
          <footer className="customer-type-page__footer">
            <CreateAccountButton
              onClick={handleCreateAccount}
              isLoading={isSubmitting}
              disabled={!selectedId}
            />
          </footer>
        </div>
      </main>
    </div>
  )
}

export default CustomerTypePage
