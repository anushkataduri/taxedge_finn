import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  GSTAmendmentHeader,
  GSTAmendmentForm,
  GSTAmendmentSubmitted,
} from '../../components'
import { gstService } from '../../services/gstService'
import type { GstAmendmentPayload, GstAmendmentRecord } from '../../types/gst.types'
import './GSTAmendment.css'

export const GSTAmendment = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRecord, setSubmittedRecord] = useState<GstAmendmentRecord | null>(null)

  const handleSubmit = async (payload: GstAmendmentPayload) => {
    try {
      setIsSubmitting(true)
      const record = await gstService.submitAmendment(payload)
      setSubmittedRecord(record)
      pushToast(
        `Amendment request for ${payload.fieldBeingChanged} submitted successfully (${record.reference})`,
        'success'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      pushToast('Failed to submit amendment application. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmittedRecord(null)
  }

  const handleBackToDashboard = () => {
    navigate(routePaths.gst.root)
  }

  if (submittedRecord) {
    return (
      <GSTAmendmentSubmitted
        applicationId={submittedRecord.reference || 'GST-2026-00134'}
        serviceName="GST Amendment"
        gstin={submittedRecord.gstin || '27AXTPD4419K1ZP'}
        fieldsCaptured={5}
        status="New Request"
        onBackToForm={handleReset}
        onAllForms={handleBackToDashboard}
      />
    )
  }

  return (
    <div className="gst-amendment-page">
      <GSTAmendmentHeader onBackToAllForms={handleBackToDashboard} />
      <main className="gst-amendment-main">
        <GSTAmendmentForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onAllFormsClick={handleBackToDashboard}
        />
      </main>
    </div>
  )
}

export default GSTAmendment
