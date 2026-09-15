import { env } from '@core/config'
import { AppError } from '@core/errors'

import { gstApi } from '../api/gstApi'
import type {
  GstAmendmentPayload,
  GstAmendmentRecord,
  GstApplication,
  GstCertificatePayload,
  GstCertificateRecord,
  GstListFilters,
  GstRegistrationPayload,
  GstReturn,
  GstReturnPayload,
} from '../types/gst.types'

/* ------------------------------------------------------------------ *
 * Development mocks - delete this block once the API is live.
 * ------------------------------------------------------------------ */
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 864e5).toISOString()

const mockApplications: GstApplication[] = [
  {
    id: 'gst_001',
    reference: 'TE-GST-24001',
    legalName: 'Tanvox Technologies',
    tradeName: 'Tanvox',
    businessType: 'private_limited',
    state: 'Telangana',
    pan: 'AABCT1234H',
    gstin: '36AABCT1234H1Z5',
    status: 'COMPLETED',
    createdAt: iso(40),
    updatedAt: iso(9),
    timeline: [
      { id: 't1', label: 'Application submitted', occurredAt: iso(40), isComplete: true },
      { id: 't2', label: 'Documents verified', occurredAt: iso(32), isComplete: true },
      { id: 't3', label: 'Officer review', note: 'Clarification answered', occurredAt: iso(18), isComplete: true },
      { id: 't4', label: 'GSTIN issued', occurredAt: iso(9), isComplete: true },
    ],
  },
  {
    id: 'gst_002',
    reference: 'TE-GST-24014',
    legalName: 'Vasavi Traders',
    businessType: 'proprietorship',
    state: 'Andhra Pradesh',
    pan: 'AXTPV9821K',
    status: 'QUERY_RAISED',
    createdAt: iso(12),
    updatedAt: iso(2),
    timeline: [
      { id: 't1', label: 'Application submitted', occurredAt: iso(12), isComplete: true },
      { id: 't2', label: 'Documents verified', occurredAt: iso(7), isComplete: true },
      { id: 't3', label: 'Clarification requested', note: 'Upload the rent agreement', occurredAt: iso(2), isComplete: false },
      { id: 't4', label: 'GSTIN issued', occurredAt: '', isComplete: false },
    ],
  },
  {
    id: 'gst_003',
    reference: 'TE-GST-24022',
    legalName: 'Nandi Foods LLP',
    businessType: 'llp',
    state: 'Karnataka',
    pan: 'AAFFN5533D',
    status: 'MANAGER_REVIEW',
    createdAt: iso(5),
    updatedAt: iso(1),
    timeline: [
      { id: 't1', label: 'Application submitted', occurredAt: iso(5), isComplete: true },
      { id: 't2', label: 'Documents verified', occurredAt: iso(1), isComplete: true },
      { id: 't3', label: 'Officer review', occurredAt: '', isComplete: false },
      { id: 't4', label: 'GSTIN issued', occurredAt: '', isComplete: false },
    ],
  },
]

const mockReturns: GstReturn[] = [
  { id: 'r1', gstin: '36AABCT1234H1Z5', returnType: 'GSTR-1', period: '2026-08', dueOn: '2026-09-11', taxPayable: 0, status: 'COMPLETED', createdAt: iso(20), updatedAt: iso(19) },
  { id: 'r2', gstin: '36AABCT1234H1Z5', returnType: 'GSTR-3B', period: '2026-08', dueOn: '2026-09-20', taxPayable: 84_500, status: 'MANAGER_REVIEW', createdAt: iso(6), updatedAt: iso(1) },
  { id: 'r3', gstin: '36AABCT1234H1Z5', returnType: 'GSTR-1', period: '2026-09', dueOn: '2026-10-11', taxPayable: 0, status: 'DRAFT', createdAt: iso(1), updatedAt: iso(1) },
]

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
/* ------------------------------------------------------------------ */

const matchesFilters = (application: GstApplication, filters?: GstListFilters): boolean => {
  if (filters?.status && application.status !== filters.status) return false
  if (filters?.search) {
    const needle = filters.search.toLowerCase()
    return (
      application.legalName.toLowerCase().includes(needle) ||
      application.reference.toLowerCase().includes(needle) ||
      (application.gstin?.toLowerCase().includes(needle) ?? false)
    )
  }
  return true
}

export const gstService = {
  async listApplications(filters?: GstListFilters): Promise<GstApplication[]> {
    if (env.enableMocks) {
      await delay()
      return mockApplications.filter((application) => matchesFilters(application, filters))
    }
    const response = await gstApi.listApplications(filters)
    return response.data
  },

  async getApplication(id: string): Promise<GstApplication> {
    if (env.enableMocks) {
      await delay(250)
      const found = mockApplications.find((application) => application.id === id)
      if (!found) throw new AppError('That GST application no longer exists.', { kind: 'notFound' })
      return found
    }
    return gstApi.getApplication(id)
  },

  async register(payload: GstRegistrationPayload): Promise<GstApplication> {
    if (env.enableMocks) {
      await delay(600)
      return {
        ...mockApplications[2],
        id: `gst_${Date.now()}`,
        reference: `TE-GST-${Math.floor(Math.random() * 90000 + 10000)}`,
        legalName: payload.legalName,
        tradeName: payload.tradeName,
        businessType: payload.businessType,
        state: payload.state,
        pan: payload.pan,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    return gstApi.register(payload)
  },

  async listReturns(): Promise<GstReturn[]> {
    if (env.enableMocks) {
      await delay()
      return mockReturns
    }
    const response = await gstApi.listReturns()
    return response.data
  },

  async fileReturn(payload: GstReturnPayload): Promise<GstReturn> {
    if (env.enableMocks) {
      await delay(600)
      return {
        id: `r_${Date.now()}`,
        gstin: payload.gstin,
        returnType: payload.returnType,
        period: payload.period,
        dueOn: new Date().toISOString(),
        taxPayable: payload.taxPayable,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    return gstApi.fileReturn(payload)
  },

  async submitAmendment(payload: GstAmendmentPayload): Promise<GstAmendmentRecord> {
    if (env.enableMocks) {
      await delay(600)
      return {
        id: `amend_${Date.now()}`,
        reference: `GST-AMD-${Math.floor(Math.random() * 90000 + 10000)}`,
        gstin: payload.gstin,
        fieldBeingChanged: payload.fieldBeingChanged,
        oldValue: payload.oldValue,
        newValue: payload.newValue,
        status: 'SUBMITTED',
        supportingDocument: payload.supportingDocumentName || 'document.pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    return {
      id: `amend_${Date.now()}`,
      reference: `GST-AMD-${Math.floor(Math.random() * 90000 + 10000)}`,
      gstin: payload.gstin,
      fieldBeingChanged: payload.fieldBeingChanged,
      oldValue: payload.oldValue,
      newValue: payload.newValue,
      status: 'SUBMITTED',
      supportingDocument: payload.supportingDocumentName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  async submitCertificateRequest(payload: GstCertificatePayload): Promise<GstCertificateRecord> {
    if (env.enableMocks) {
      await delay(500)
      return {
        id: `cert_${Date.now()}`,
        reference: `GST-CRT-${Math.floor(Math.random() * 90000 + 10000)}`,
        gstin: payload.gstin,
        registeredContact: payload.registeredContact,
        requestType: payload.requestType,
        status: 'COMPLETED',
        downloadUrl: '/sample-gst-certificate.pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    return {
      id: `cert_${Date.now()}`,
      reference: `GST-CRT-${Math.floor(Math.random() * 90000 + 10000)}`,
      gstin: payload.gstin,
      registeredContact: payload.registeredContact,
      requestType: payload.requestType,
      status: 'COMPLETED',
      downloadUrl: '/sample-gst-certificate.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
}
