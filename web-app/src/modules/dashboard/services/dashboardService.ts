import { env, routePaths } from '@core/config'
import { formatCurrency } from '@shared/utils'

import { dashboardApi } from '../api/dashboardApi'
import type { DashboardSummary, QuickService } from '../types/dashboard.types'

/* Development mock - delete once the API is live. */
const mockSummary: DashboardSummary = {
  brief: {
    dateLabel: new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date()),
    message:
      'Your GSTR-3B for August is due in 18 days and two documents are still pending on your ITR. Everything else is moving.',
    activeApplications: 3,
    paymentDue: formatCurrency(3000),
  },
  deadline: {
    id: 'gstr3b-aug',
    title: 'GSTR-3B · August 2026',
    meta: 'Due 20 September 2026 · GSTIN 27AXTPD4419K1ZP',
    daysLeft: 18,
    ctaLabel: 'Start filing',
    ctaTo: routePaths.gst.returns,
  },
  stats: [
    { id: 'active', label: 'Active applications', value: '3', hint: '2 GST · 1 loan', tone: 'success', icon: '🗎' },
    {
      id: 'pending-docs',
      label: 'Pending documents',
      value: '2',
      hint: 'on ITR-2026-00074',
      hintFlag: 'Action needed',
      tone: 'warning',
      icon: '⚠',
    },
    {
      id: 'payment-due',
      label: 'Payment due',
      value: formatCurrency(3000),
      hint: 'ITR filing fee · not yet paid',
      tone: 'danger',
      icon: '₹',
    },
    { id: 'completed', label: 'Completed services', value: '2', hint: 'Since Jan 2024', tone: 'info', icon: '✓' },
  ],
  recentApplications: [
    {
      id: 'app-gst-1',
      code: 'GST-2026-00118',
      title: 'GST Monthly Filing',
      meta: 'August 2026 · GSTR-1 & GSTR-3B · Rohit Kulkarni',
      statusLabel: 'ARN Generated',
      statusTone: 'info',
      progress: 58,
      icon: '📄',
      to: routePaths.gst.returns,
    },
    {
      id: 'app-itr-1',
      code: 'ITR-2026-00074',
      title: 'ITR Filing — AY 2026-27',
      meta: 'Proprietorship · ITR-3 · Meera Iyer',
      statusLabel: 'Tax Calculation',
      statusTone: 'warning',
      progress: 46,
      icon: '📊',
      to: routePaths.itr.root,
    },
    {
      id: 'app-loan-1',
      code: 'LOAN-2026-00231',
      title: 'Business Loan — ₹12,00,000',
      meta: 'HDFC Bank · 60 months · Sameer Joshi',
      statusLabel: 'Under Credit Review',
      statusTone: 'info',
      progress: 53,
      icon: '$',
      to: routePaths.loans,
    },
  ],
  pendingTasks: [
    {
      id: 'pt-1',
      title: 'Bank statement — Apr to Mar',
      meta: 'Rejected · file is password protected',
      statusLabel: 'Rejected',
      statusTone: 'danger',
      actionLabel: 'Upload',
      actionTo: routePaths.documents,
      icon: '⚠',
      iconTone: 'danger',
    },
    {
      id: 'pt-2',
      title: 'Form 16A — Q1 FY 2026-27',
      meta: 'Required for ITR-2026-00074',
      statusLabel: 'Pending',
      statusTone: 'muted',
      actionLabel: 'Upload',
      actionTo: routePaths.documents,
      icon: '📄',
      iconTone: 'muted',
    },
    {
      id: 'pt-3',
      title: 'Sales invoices — August 2026',
      meta: '42 files · verified 29 Aug 2026',
      statusLabel: 'Verified',
      statusTone: 'success',
      actionLabel: 'View',
      actionTo: routePaths.documents,
      icon: '✓',
      iconTone: 'success',
    },
  ],
  upcomingDeadlinesList: [
    {
      id: 'ud-1',
      title: 'GSTR-1 · August 2026',
      dueLabel: 'Due 11 Sep 2026',
      daysText: '9 days',
      daysTone: 'warning',
    },
    {
      id: 'ud-2',
      title: 'GSTR-3B · August 2026',
      dueLabel: 'Due 20 Sep 2026',
      daysText: '18 days',
      daysTone: 'info',
    },
    {
      id: 'ud-3',
      title: 'ITR filing · AY 2026-27',
      dueLabel: 'Due 30 Sep 2026',
      daysText: '28 days',
      daysTone: 'info',
    },
    {
      id: 'ud-4',
      title: 'Advance tax · Q2 instalment',
      dueLabel: 'Due 15 Sep 2026',
      daysText: '13 days',
      daysTone: 'info',
    },
  ],
  recentActivity: [
    { id: 'a1', title: 'GSTR-3B — August', module: 'GST', status: 'MANAGER_REVIEW', updatedAt: new Date().toISOString() },
    { id: 'a2', title: 'ITR-4 filing FY 2025-26', module: 'Income tax', status: 'QUERY_RAISED', updatedAt: new Date(Date.now() - 864e5).toISOString() },
    { id: 'a3', title: 'Business loan — HDFC', module: 'Loans', status: 'SUBMITTED', updatedAt: new Date(Date.now() - 3 * 864e5).toISOString() },
    { id: 'a4', title: 'GST registration — Telangana', module: 'GST', status: 'COMPLETED', updatedAt: new Date(Date.now() - 9 * 864e5).toISOString() },
  ],
  upcomingDeadlines: [
    { id: 'd1', label: 'GSTR-1 for September', dueOn: '2026-10-11' },
    { id: 'd2', label: 'GSTR-3B for September', dueOn: '2026-10-20' },
    { id: 'd3', label: 'Advance tax — Q2 instalment', dueOn: '2026-09-15' },
  ],
}

export const quickServices: QuickService[] = [
  {
    id: 'gst',
    label: 'GST',
    description: 'Registration, monthly and quarterly filing, amendments, compliance and certificates.',
    to: routePaths.gst.root,
    icon: '📄',
    price: '₹2,500',
    priceUnit: 'per period',
  },
  {
    id: 'itr',
    label: 'ITR & TDS',
    description: 'Income tax returns for every profile, TDS refunds, revised returns and notice replies.',
    to: routePaths.itr.root,
    icon: '📊',
    price: '₹3,000',
    priceUnit: 'from',
  },
  {
    id: 'loans',
    label: 'Loans',
    description: 'Business, personal, home, property and vehicle finance with a live EMI calculator.',
    to: routePaths.loans,
    icon: '$',
    price: '1%',
    priceUnit: 'processing',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Health, life, motor and commercial coverage tailored to your business and family.',
    to: routePaths.insurance,
    icon: '☂',
    price: 'Custom',
    priceUnit: 'quotes',
  },
  {
    id: 'company',
    label: 'Company',
    description: 'Private limited, LLP, OPC incorporation, MSME Udyam, trademark and compliance.',
    to: routePaths.services,
    icon: '🏢',
    price: '₹4,999',
    priceUnit: 'from',
  },
]

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockSummary
    }
    return dashboardApi.getSummary()
  },
}
