import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'

import {
  GSTRegistrationStepper,
  GSTOrderSummary,
  GSTStepBusiness,
  GSTStepAddressBank,
  GSTStepDocuments,
  GSTStepReview,
  GSTStepPayment,
  GSTPaymentSuccess,
} from '../../components'
import type { BusinessFormData } from '../../components/GSTStepBusiness/GSTStepBusiness'
import type { AddressBankFormData } from '../../components/GSTStepAddressBank/GSTStepAddressBank'
import type { PaymentResult } from '../../components/GSTStepPayment/GSTStepPayment'
import './GSTRegistration.css'

const INITIAL_BUSINESS_DATA: BusinessFormData = {
  legalName: 'Shree Deshmukh Traders',
  tradeName: 'Deshmukh Traders',
  pan: 'AXTPD4419K',
  aadhaar: '8910 2345 6789',
  mobile: '+91 98670 41255',
  email: 'anjali@shreedeshmukh.in',
  constitution: 'Proprietorship',
  natureOfBusiness: 'Trading',
  principalActivity:
    'Wholesale and retail trading of packaged food products and household consumables.',
  turnover: '₹40 lakh – ₹1 crore',
  compositionScheme: 'No — regular scheme',
}

const INITIAL_ADDRESS_BANK_DATA: AddressBankFormData = {
  address: 'Shop 14, Laxmi Complex, FC Road, Shivajinagar',
  city: 'Pune',
  pinCode: '411004',
  state: 'Maharashtra',
  possessionNature: 'Rented',
  accountHolderName: 'Shree Deshmukh Traders',
  accountNumber: '918273645012',
  ifscCode: 'HDFC0000412',
  accountType: 'Current',
  additionalPlaces: [],
}

const DEFAULT_PAYMENT_RESULT: PaymentResult = {
  transactionId: 'TXN2609021184402',
  receiptNumber: 'TE/26-27/R-0912',
  method: 'UPI · anjali@okhdfcbank',
  dateText: '2 Sep 2026, 10:42 AM',
  applicationRef: 'GST-2026-00118',
  amount: 5900,
}

export const GSTRegistration = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [businessData, setBusinessData] = useState<BusinessFormData>(INITIAL_BUSINESS_DATA)
  const [addressBankData, setAddressBankData] =
    useState<AddressBankFormData>(INITIAL_ADDRESS_BANK_DATA)
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(DEFAULT_PAYMENT_RESULT)

  const handleBusinessChange = (field: keyof BusinessFormData, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressBankChange = (
    field: keyof AddressBankFormData,
    value: string | string[]
  ) => {
    setAddressBankData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    navigate(routePaths.gst.root)
  }

  const handleStep1Next = () => {
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep2Next = () => {
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep3Back = () => {
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep3Next = () => {
    setCurrentStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep4Back = () => {
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep4Proceed = () => {
    setCurrentStep(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep5Back = () => {
    setCurrentStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentResult(result)
    setCurrentStep(6)
    pushToast('Payment of ₹5,900 successful', 'success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStepBreadcrumb = () => {
    if (currentStep === 1) return 'Business details'
    if (currentStep === 2) return 'Address & bank'
    if (currentStep === 3) return 'Upload'
    if (currentStep === 4) return 'Review'
    if (currentStep === 5) return 'Payment'
    return 'Confirmation'
  }

  return (
    <div className="gst-reg-page">
      {/* Top Breadcrumbs */}
      <nav className="gst-reg-breadcrumb" aria-label="Breadcrumb">
        <span
          className="gst-reg-breadcrumb__item gst-reg-breadcrumb__item--link"
          onClick={() => navigate(routePaths.gst.root)}
        >
          GST
        </span>
        <span className="gst-reg-breadcrumb__separator">→</span>
        <span className="gst-reg-breadcrumb__item">Registration</span>
        <span className="gst-reg-breadcrumb__separator">→</span>
        <span className="gst-reg-breadcrumb__item gst-reg-breadcrumb__item--active">
          {getStepBreadcrumb()}
        </span>
      </nav>

      {/* Stepper (Steps 1 to 5) */}
      {currentStep <= 5 && (
        <div className="gst-reg-stepper-container">
          <GSTRegistrationStepper
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </div>
      )}

      {/* Steps 1 to 4: Standard 2-column layout */}
      {currentStep <= 4 && (
        <div className="gst-reg-content-grid">
          <main className="gst-reg-main-content">
            {currentStep === 1 && (
              <GSTStepBusiness
                data={businessData}
                onChange={handleBusinessChange}
                onNext={handleStep1Next}
                onCancel={handleCancel}
              />
            )}

            {currentStep === 2 && (
              <GSTStepAddressBank
                data={addressBankData}
                onChange={handleAddressBankChange}
                onNext={handleStep2Next}
                onBack={handleStep2Back}
              />
            )}

            {currentStep === 3 && (
              <GSTStepDocuments
                onBack={handleStep3Back}
                onNext={handleStep3Next}
              />
            )}

            {currentStep === 4 && (
              <GSTStepReview
                businessData={businessData}
                addressBankData={addressBankData}
                onEdit={() => setCurrentStep(1)}
                onBack={handleStep4Back}
                onProceed={handleStep4Proceed}
              />
            )}
          </main>

          <aside className="gst-reg-sidebar">
            <GSTOrderSummary step={currentStep} />
          </aside>
        </div>
      )}

      {/* Step 5: Complete Your Payment */}
      {currentStep === 5 && (
        <GSTStepPayment
          amount={5900}
          applicationRef="GST-2026-00118"
          serviceTitle="GST Registration"
          onBack={handleStep5Back}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Step 6: Payment Successful Confirmation Screen */}
      {currentStep === 6 && (
        <GSTPaymentSuccess
          details={paymentResult}
          onBackToDashboard={() => navigate(routePaths.gst.root)}
        />
      )}
    </div>
  )
}

export default GSTRegistration
