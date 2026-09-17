export interface RevisedStepMeta {
  stepNumber: number
  title: string
  customerSees: string
  happensNext: string
  flowLabel: string
}

export interface CorrectionReasonItem {
  id: string
  title: string
  description: string
  icon: string
}

export interface RevisedComparisonRow {
  line: string
  original: string
  revised: string
  change: string
  isChangePositive?: boolean
}

export interface RevisedUploadItem {
  id: string
  title: string
  sub: string
}

export const REVISED_STEPS_METADATA: RevisedStepMeta[] = [
  {
    stepNumber: 1,
    title: "Let's find your original return",
    customerSees:
      '"Let\'s find your original return" — asks for the original ITR Acknowledgement Number and the Assessment Year it was filed for.',
    happensNext: 'Links the new revision to the exact original filing, which the department requires.',
    flowLabel: "Let's find your original return",
  },
  {
    stepNumber: 2,
    title: 'What needs to be corrected?',
    customerSees:
      '"What needs to be corrected?" — a simple list: Missed income, Wrong deduction claimed, Incorrect bank details, Other.',
    happensNext:
      'Helps the Tax Executive quickly understand what changed, without reading a long free-text explanation.',
    flowLabel: 'What needs to be corrected?',
  },
  {
    stepNumber: 3,
    title: 'Update only what changed',
    customerSees:
      "An editable version of the original return's details — the customer only needs to update the fields that changed.",
    happensNext: 'Saves the customer from re-entering everything from scratch.',
    flowLabel: "An editable version of the original return's details —...",
  },
  {
    stepNumber: 4,
    title: 'Upload anything supporting the correction',
    customerSees:
      'Document upload for anything supporting the correction (e.g. a corrected Form 16).',
    happensNext: 'Gives the Tax Executive proof for the change being made.',
    flowLabel: 'Document upload for anything supporting the correction...',
  },
  {
    stepNumber: 5,
    title: 'Please review your revised computation',
    customerSees:
      'Same review, approval, filing, and e-verification screens as ITR Filing, but labelled "Revised Return".',
    happensNext:
      'The revised return replaces the original one on record with the department once filed and e-verified.',
    flowLabel: 'Same review, approval, filing, and e-verification...',
  },
]

export const CORRECTION_REASONS: CorrectionReasonItem[] = [
  {
    id: 'missed_income',
    title: 'Missed income',
    description: 'Income you did not report in the original return',
    icon: '₹',
  },
  {
    id: 'wrong_deduction',
    title: 'Wrong deduction claimed',
    description: 'A deduction claimed in error, or one you missed',
    icon: '📄',
  },
  {
    id: 'bank_details',
    title: 'Incorrect bank details',
    description: 'Refund could not be credited to the account given',
    icon: '🏦',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Something else — tell us in your own words',
    icon: '✏️',
  },
]

export const REVISED_COMPARISON_DATA: RevisedComparisonRow[] = [
  {
    line: 'Gross total income',
    original: '₹8,12,400',
    revised: '₹8,68,900',
    change: '+₹56,500',
    isChangePositive: true,
  },
  {
    line: 'Total deductions',
    original: '₹3,20,000',
    revised: '₹3,20,000',
    change: '—',
  },
  {
    line: 'Taxable income',
    original: '₹4,92,400',
    revised: '₹5,48,900',
    change: '+₹56,500',
    isChangePositive: true,
  },
  {
    line: 'Tax + cess',
    original: '₹12,854',
    revised: '₹18,742',
    change: '+₹5,888',
    isChangePositive: true,
  },
  {
    line: 'Taxes paid',
    original: '₹31,200',
    revised: '₹31,200',
    change: '—',
  },
]

export const REVISED_UPLOAD_ITEMS: RevisedUploadItem[] = [
  { id: 'corrected_form16', title: 'Corrected Form 16', sub: 'Optional — upload whichever applies' },
  { id: 'revised_interest', title: 'Revised interest certificate', sub: 'Optional — upload whichever applies' },
  { id: 'proof_missed_income', title: 'Proof of missed income', sub: 'Optional — upload whichever applies' },
  { id: 'bank_account_proof', title: 'Bank account proof', sub: 'Optional — upload whichever applies' },
]
