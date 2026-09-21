import React from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import { GSTCancellationCard, type CancellationFormData } from '../../components/cancellation/GSTCancellationCard/GSTCancellationCard'
import './GSTCancellation.css'

export const GSTCancellation: React.FC = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)

  const handleSubmit = (data: CancellationFormData) => {
    pushToast(
      `Cancellation request for ${data.gstin} (${data.reason}) received.`,
      'success'
    )
  }

  const handleAllForms = () => {
    navigate(routePaths.gst.root)
  }

  return (
    <div className="gst-cancellation-page">
      <div className="gst-cancellation-container">
        <GSTCancellationCard
          onAllForms={handleAllForms}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default GSTCancellation
