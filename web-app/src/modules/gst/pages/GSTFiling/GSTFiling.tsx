import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import {
  GSTFilingPeriod,
  GSTFilingDocuments,
  GSTFilingReview,
  GSTFilingPayment,
  GSTFilingSuccess,
  GSTFilingReceipt,
  type FilingPeriodData,
  type PaymentResult,
} from '../../components'
import './GSTFiling.css'

const DEFAULT_FILING_DATA: FilingPeriodData = {
  gstin: '27AXTPD4419K1ZP',
  businessName: 'Shree Deshmukh Traders',
  financialYear: 'FY 2026-27',
  frequency: 'Monthly',
  selectedMonth: '',
  returnType: '',
  baseFee: 0,
}

const DEFAULT_PAYMENT_RESULT: PaymentResult = {
  transactionId: 'TXN2609021184402',
  receiptNumber: 'TE/26-27/R-0884',
  method: 'UPI · anjali@okhdfcbank',
  dateText: '2 Sep 2026, 10:42 AM',
  applicationRef: 'GST-2026-00118',
  amount: 2950,
}

export const GSTFiling = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(() => {
    if (location.pathname === '/gst/file-upload') return 2
    if (location.pathname === '/gst/file-review') return 3
    if (location.pathname === '/gst/file-payment') return 4
    if (location.pathname === '/gst/file-success') return 5
    if (location.pathname === '/gst/file-receipt') return 6
    return 1
  })

  const [filingData, setFilingData] = useState<FilingPeriodData>(DEFAULT_FILING_DATA)
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(DEFAULT_PAYMENT_RESULT)

  useEffect(() => {
    if (location.pathname === '/gst/file-upload') setCurrentStep(2)
    else if (location.pathname === '/gst/file-review') setCurrentStep(3)
    else if (location.pathname === '/gst/file-payment') setCurrentStep(4)
    else if (location.pathname === '/gst/file-success') setCurrentStep(5)
    else if (location.pathname === '/gst/file-receipt') setCurrentStep(6)
    else if (location.pathname === '/gst/filing' || location.pathname === '/gst/file-period') setCurrentStep(1)
  }, [location.pathname])

  const handleStep1Continue = (data: FilingPeriodData) => {
    setFilingData(data)
    setCurrentStep(2)
    navigate('/gst/file-upload')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep2Next = () => {
    setCurrentStep(3)
    navigate('/gst/file-review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep3Approve = () => {
    setCurrentStep(4)
    navigate('/gst/file-payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep4Success = (res: PaymentResult) => {
    setPaymentResult(res)
    setCurrentStep(5)
    navigate('/gst/file-success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="gst-filing-page">
      {/* Step 1: Period Selection */}
      {currentStep === 1 && (
        <GSTFilingPeriod
          initialData={filingData}
          onContinue={handleStep1Continue}
          onCancel={() => navigate(routePaths.gst.root)}
        />
      )}

      {/* Step 2: Upload Documents & Checklist */}
      {currentStep === 2 && (
        <GSTFilingDocuments
          selectedMonth={filingData.selectedMonth}
          baseFee={filingData.baseFee}
          onBack={() => {
            setCurrentStep(1)
            navigate('/gst/file-period')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onNext={handleStep2Next}
        />
      )}

      {/* Step 3: Review & Tax Figures */}
      {currentStep === 3 && (
        <GSTFilingReview
          selectedMonth={filingData.selectedMonth}
          baseFee={filingData.baseFee}
          onBack={() => {
            setCurrentStep(2)
            navigate('/gst/file-upload')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onRequestChange={() => {
            setCurrentStep(2)
            navigate('/gst/file-upload')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onApprove={handleStep3Approve}
        />
      )}

      {/* Step 4: Payment */}
      {currentStep === 4 && (
        <GSTFilingPayment
          amount={filingData.baseFee + Math.round(filingData.baseFee * 0.18)}
          applicationRef="GST-2026-00118"
          serviceTitle={`GST Filing — ${filingData.selectedMonth}`}
          onBack={() => {
            setCurrentStep(3)
            navigate('/gst/file-review')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onSuccess={handleStep4Success}
        />
      )}

      {/* Step 5: Success Screen */}
      {currentStep === 5 && (
        <GSTFilingSuccess
          details={paymentResult}
          onViewReceipt={() => {
            setCurrentStep(6)
            navigate('/gst/file-receipt')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onTrackApplication={() => navigate(routePaths.gst.track('GST-2026-00118'))}
          onBackToDashboard={() => navigate(routePaths.gst.root)}
        />
      )}

      {/* Step 6: Receipt Screen */}
      {currentStep === 6 && (
        <GSTFilingReceipt
          details={paymentResult}
          onBack={() => {
            setCurrentStep(5)
            navigate('/gst/file-success')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}

export default GSTFiling
