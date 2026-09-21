export interface TrackingMilestone {
  stepNumber: number
  title: string
  description: string
  dateLabel: string
  status: 'completed' | 'in_progress' | 'pending'
}

export interface ReturnTrackDetails {
  ackNumber: string
  pan: string
  assessmentYear: string
  filingDate: string
  formType: string
  expectedRefund: number
  refundStatus: string
  bankAccountLast4: string
  caAssigned: string
  milestones: TrackingMilestone[]
}

export const MOCK_TRACK_RETURNS: Record<string, ReturnTrackDetails> = {
  'ITR-2026-00074': {
    ackNumber: 'ITR-2026-00074',
    pan: 'ABCDE1234F',
    assessmentYear: 'AY 2026-27',
    filingDate: '24 Aug 2026',
    formType: 'ITR-3 (Proprietorship)',
    expectedRefund: 23400,
    refundStatus: 'Tax Calculation in Progress',
    bankAccountLast4: '1920',
    caAssigned: 'Meera Iyer',
    milestones: [
      {
        stepNumber: 1,
        title: 'Documents & Books Received',
        description: 'Bank statements and GST returns uploaded.',
        dateLabel: '24 Aug 2026, 11:30 AM',
        status: 'completed',
      },
      {
        stepNumber: 2,
        title: 'AIS & Form 26AS Reconciled',
        description: 'TDS credit of ₹46,800 validated across ITD records.',
        dateLabel: '25 Aug 2026, 03:15 PM',
        status: 'completed',
      },
      {
        stepNumber: 3,
        title: 'Tax Calculation & Audit Verification',
        description: 'CA Meera Iyer computing final 44AB applicability and 80C deductions.',
        dateLabel: 'Currently in Progress (46%)',
        status: 'in_progress',
      },
      {
        stepNumber: 4,
        title: 'ITD E-Filing & Verification',
        description: 'Return ready for Aadhaar OTP e-verification.',
        dateLabel: 'Pending computation approval',
        status: 'pending',
      },
      {
        stepNumber: 5,
        title: 'CPC Processing & Refund Credit',
        description: 'Refund credit directly into HDFC A/c ending in 1920.',
        dateLabel: 'Estimated 20-30 days',
        status: 'pending',
      },
    ],
  },
  'ITR-2025-00611': {
    ackNumber: 'ITR-2025-00611',
    pan: 'ABCDE1234F',
    assessmentYear: 'AY 2025-26',
    filingDate: '15 Jul 2025',
    formType: 'ITR-3',
    expectedRefund: 18420,
    refundStatus: 'Refund Credited to Bank Account',
    bankAccountLast4: '1920',
    caAssigned: 'Meera Iyer',
    milestones: [
      {
        stepNumber: 1,
        title: 'Documents Reconciled',
        description: 'Form 16 and 26AS validated.',
        dateLabel: '15 Jul 2025',
        status: 'completed',
      },
      {
        stepNumber: 2,
        title: 'Return E-Filed & E-Verified',
        description: 'Verified via Aadhaar OTP.',
        dateLabel: '18 Jul 2025',
        status: 'completed',
      },
      {
        stepNumber: 3,
        title: 'CPC Bengaluru Processed',
        description: 'Intimation u/s 143(1) issued with zero demand.',
        dateLabel: '02 Aug 2025',
        status: 'completed',
      },
      {
        stepNumber: 4,
        title: 'Refund Dispatched by SBI NECS',
        description: 'Reference: SBIN0029384729.',
        dateLabel: '10 Aug 2025',
        status: 'completed',
      },
      {
        stepNumber: 5,
        title: 'Credited to Bank Account',
        description: '₹18,420 credited into HDFC A/c ending in 1920.',
        dateLabel: '12 Aug 2025',
        status: 'completed',
      },
    ],
  },
}
