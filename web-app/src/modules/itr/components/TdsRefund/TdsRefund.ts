export interface TdsStepMeta {
  stepNumber: number
  title: string
  customerSees: string
  happensNext: string
  flowLabel: string
}

export interface TdsDocumentItem {
  id: string
  name: string
  formats: string
}

export interface TdsPaymentMethod {
  id: string
  name: string
  subtitle?: string
  icon: string
}

export const TDS_STEPS_METADATA: TdsStepMeta[] = [
  {
    stepNumber: 1,
    title: "We'll estimate your TDS refund",
    customerSees:
      'A short intro screen: "We\'ll estimate your TDS refund. Our fee is 15% of the refund amount — you only pay if you proceed."',
    happensNext: 'Sets expectations upfront before any documents are collected.',
    flowLabel: 'A short intro screen: "We\'ll estimate your TDS refund....',
  },
  {
    stepNumber: 2,
    title: 'Your document checklist',
    customerSees:
      'A document checklist: PAN, Form 16, Form 16A, AIS, TIS, bank details, previous ITR, and TDS details — each with an upload button.',
    happensNext: 'These documents are what staff use to calculate the refund estimate.',
    flowLabel: 'A document checklist: PAN, Form 16, Form 16A, AIS....',
  },
  {
    stepNumber: 3,
    title: 'Here is your estimate',
    customerSees:
      '"Your estimated refund: ₹X. Our fee (15%): ₹Y. Proceed?" with Confirm and Cancel buttons.',
    happensNext: 'The customer sees the exact numbers before committing to anything.',
    flowLabel: 'Your estimated refund: ₹X. Our fee (15%): ₹Y. Proceed?',
  },
  {
    stepNumber: 4,
    title: 'Pay the 15% fee',
    customerSees:
      'Payment screen for the 15% fee, followed by a confirmation with an Application ID and status tracker.',
    happensNext: 'The application enters the TDS queue for a Tax Executive to verify and file.',
    flowLabel: 'Payment screen for the 15% fee, followed by a...',
  },
  {
    stepNumber: 5,
    title: 'Your refund status',
    customerSees:
      'A simple status view: "Filed → Processing → Refund Credited", with a notification sent when the refund actually reaches the customer\'s bank account.',
    happensNext: "The customer doesn't need to check manually — they're notified automatically at each stage.",
    flowLabel: 'A simple status view: "Filed → Processing → Refund...',
  },
]

export const TDS_DOCUMENTS_CHECKLIST: TdsDocumentItem[] = [
  { id: 'pan', name: 'PAN', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'form16', name: 'Form 16', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'form16a', name: 'Form 16A', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'ais', name: 'AIS', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'tis', name: 'TIS', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'bank_details', name: 'Bank details', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'previous_itr', name: 'Previous ITR', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'tds_details', name: 'TDS details', formats: 'PDF, JPG or PNG · up to 10 MB' },
]

export const TDS_PAYMENT_METHODS: TdsPaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm or any UPI app',
    icon: 'upi',
  },
  {
    id: 'debit_card',
    name: 'Debit card',
    icon: 'card',
  },
  {
    id: 'credit_card',
    name: 'Credit card',
    icon: 'card',
  },
  {
    id: 'net_banking',
    name: 'Net banking',
    icon: 'bank',
  },
]
