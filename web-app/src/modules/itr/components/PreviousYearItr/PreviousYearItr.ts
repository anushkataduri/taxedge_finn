export interface PrevYearStepMeta {
  stepNumber: number
  title: string
  customerSees: string
  happensNext: string
  flowLabel: string
}

export interface AssessmentYearItem {
  ay: string
  subtitle: string
  status: 'Eligible' | 'Closed'
  isEligible: boolean
}

export interface PrevYearDocItem {
  id: string
  name: string
  formats: string
}

export const PREV_YEAR_STEPS_METADATA: PrevYearStepMeta[] = [
  {
    stepNumber: 1,
    title: 'Which year would you like to file for?',
    customerSees:
      '"Which year would you like to file for?" — a list of eligible past assessment years (the app only shows years that are still legally allowed to be filed).',
    happensNext: 'This narrows the request to years the department will actually accept.',
    flowLabel: 'Which year would you like to file for?',
  },
  {
    stepNumber: 2,
    title: 'Same questions, earlier year',
    customerSees:
      'The same income-type and information screens as ITR Filing (Screens 1–3 in Section 2), but clearly labelled "Belated Return for AY [year]".',
    happensNext: 'Keeps the experience consistent with regular ITR filing, just for an earlier year.',
    flowLabel: 'The same income-type and information screens as ITR...',
  },
  {
    stepNumber: 3,
    title: 'Since this is a late filing, a late fee and interest may apply',
    customerSees:
      'A clear notice: "Since this is a late filing, a late fee and interest may apply" with the estimated amount shown once staff calculate it.',
    happensNext:
      'Sets honest expectations — filing late usually comes with a government-charged penalty, separate from the service fee.',
    flowLabel: 'A clear notice: "Since this is a late filing, a late...',
  },
  {
    stepNumber: 4,
    title: 'Documents and submission',
    customerSees:
      'Same document checklist, submission confirmation, and status tracker as regular ITR Filing.',
    happensNext:
      'From here, the process (verification → preparation → customer approval → filing → e-verification) is identical to Section 2.',
    flowLabel: 'Same document checklist, submission confirmation, and...',
  },
]

export const ASSESSMENT_YEAR_OPTIONS: AssessmentYearItem[] = [
  {
    ay: 'AY 2025-26',
    subtitle: 'Belated filing window closed',
    status: 'Closed',
    isEligible: false,
  },
  {
    ay: 'AY 2024-25',
    subtitle: 'Updated return (ITR-U) allowed until 31 Mar 2027',
    status: 'Eligible',
    isEligible: true,
  },
  {
    ay: 'AY 2023-24',
    subtitle: 'Updated return (ITR-U) allowed until 31 Mar 2026',
    status: 'Eligible',
    isEligible: true,
  },
  {
    ay: 'AY 2022-23',
    subtitle: 'Window closed — no longer accepted',
    status: 'Closed',
    isEligible: false,
  },
]

export const PREV_YEAR_DOCUMENTS: PrevYearDocItem[] = [
  { id: 'pan', name: 'PAN', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'aadhaar', name: 'Aadhaar', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'form16', name: 'Form 16 / 16A for AY 2023-24', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'ais_tis', name: 'AIS and TIS', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'bank_statements', name: 'Bank statements', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'investment_proofs', name: 'Investment proofs', formats: 'PDF, JPG or PNG · up to 10 MB' },
]
