import React from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import { GSTComplianceCard, type ComplianceFormData } from '../../components/compliance/GSTComplianceCard/GSTComplianceCard'
import './GSTCompliance.css'

export const GSTCompliance: React.FC = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)

  const handleSubmit = (data: ComplianceFormData) => {
    pushToast(
      `Compliance request for ${data.gstin} (${data.requestType}) received.`,
      'success'
    )
  }

  const handleAllForms = () => {
    navigate(routePaths.gst.root)
  }

  return (
    <div className="gst-compliance-page">
      <div className="gst-compliance-container">
        <GSTComplianceCard
          onAllForms={handleAllForms}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default GSTCompliance
