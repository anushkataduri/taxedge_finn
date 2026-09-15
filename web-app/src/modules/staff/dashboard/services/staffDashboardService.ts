import { isAgentRole } from '@core/auth'
import type { AuthUser } from '@core/auth'
import { env } from '@core/config'
import { formatCompactINR } from '@shared/utils'

import { mockApplications } from '../../services/mockData'
import type { StaffDashboardData, WorkflowStage } from '../../types/staff.types'
import { staffDashboardApi } from '../api/staffDashboardApi'

/* Development mocks - delete once the API is live. */
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

const buildMockDashboard = (user: AuthUser): StaffDashboardData => {
  const isAgent = isAgentRole(user.role)
  const scoped = isAgent
    ? mockApplications.filter((application) => application.assignedTo?.id === user.id)
    : mockApplications

  const rows = scoped.length > 0 ? scoped : mockApplications
  const completed = rows.filter((row) => row.status === 'COMPLETED')
  const overdue = rows.filter((row) => row.isOverdue)
  const unassigned = rows.filter((row) => !row.assignedTo)
  const paid = rows.filter((row) => row.paymentStatus === 'PAID')
  const pendingPayment = rows.filter((row) => row.paymentStatus !== 'PAID')
  const collected = paid.reduce((total, row) => total + row.fee, 0)
  const outstanding = pendingPayment.reduce((total, row) => total + row.fee, 0)
  const collectionRate = rows.length === 0 ? 0 : Math.round((paid.length / rows.length) * 100)

  const countByService = (service: string) => rows.filter((row) => row.service === service).length
  const countByStage = (stage: WorkflowStage) => rows.filter((row) => row.stage === stage).length

  return {
    work: [
      { id: 'open', label: isAgent ? 'My open applications' : 'Open applications', value: String(rows.length - completed.length) },
      { id: 'gst', label: 'GST applications', value: String(countByService('GST')) },
      { id: 'itr', label: 'ITR applications', value: String(countByService('ITR')) },
      { id: 'loans', label: 'Loan leads', value: String(countByService('LOAN')) },
      { id: 'unassigned', label: 'In the agent bucket', value: String(unassigned.length), hint: 'Waiting to be claimed' },
      { id: 'overdue', label: 'Overdue', value: String(overdue.length), hint: 'Past the promised date' },
      { id: 'documents', label: 'Documents to verify', value: '11' },
      { id: 'completed', label: 'Completed', value: String(completed.length), hint: 'This financial year' },
    ],
    revenue: [
      { id: 'today', label: "Today's revenue", value: `₹${formatCompactINR(18_400)}` },
      { id: 'month', label: 'This month', value: `₹${formatCompactINR(collected)}` },
      { id: 'pending', label: 'Pending payments', value: `₹${formatCompactINR(outstanding)}`, hint: `${pendingPayment.length} applications` },
      { id: 'collection', label: 'Collection rate', value: `${collectionRate}%` },
      { id: 'newCustomers', label: 'New customers', value: '9', hint: 'Last 30 days' },
      { id: 'conversion', label: 'Lead conversion', value: '38%', hint: 'Enquiry to paid' },
    ],
    revenueByService: [
      { service: 'GST', amount: 74_970 },
      { service: 'ITR', amount: 41_960 },
      { service: 'LOAN', amount: 39_992 },
      { service: 'INSURANCE', amount: 8_991 },
      { service: 'REGISTRATION', amount: 29_995 },
      { service: 'ACCOUNTS', amount: 23_997 },
    ],
    pipeline: [
      { stage: 'REVIEW', count: countByStage('REVIEW') },
      { stage: 'ASSIGNMENT', count: countByStage('ASSIGNMENT') },
      { stage: 'PROCESSING', count: countByStage('PROCESSING') },
      { stage: 'CLOSED', count: countByStage('CLOSED') },
    ],
    needsAttention: [...overdue, ...unassigned]
      .filter((row, index, all) => all.findIndex((other) => other.id === row.id) === index)
      .slice(0, 6),
  }
}

export const staffDashboardService = {
  async summary(user: AuthUser): Promise<StaffDashboardData> {
    if (env.enableMocks) {
      await delay()
      return buildMockDashboard(user)
    }
    return staffDashboardApi.summary(user.role)
  },
}
