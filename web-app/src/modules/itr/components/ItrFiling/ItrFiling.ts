export interface IncomeTypeOption {
  id: string
  label: string
  description: string
  formType: string
  icon: string
}

export interface DocumentChecklistItem {
  id: string
  name: string
  formats: string
  required: boolean
}

export interface StepMeta {
  stepNumber: number
  title: string
  customerSees: string
  happensNext: string
  flowLabel: string
}

export const INCOME_TYPE_OPTIONS: IncomeTypeOption[] = [
  {
    id: 'salaried',
    label: 'Salaried',
    description: 'You draw a salary from one or more employers',
    formType: 'ITR-1',
    icon: '👤',
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Trading, manufacturing or retail establishment',
    formType: 'ITR-3',
    icon: '🏢',
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Doctor, lawyer, architect, chartered accountant',
    formType: 'ITR-4',
    icon: '🛡️',
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    description: 'Contract, consulting or gig income',
    formType: 'ITR-4',
    icon: '📄',
  },
  {
    id: 'trader',
    label: 'Trader / Investor',
    description: 'Equity, F&O, mutual funds or crypto',
    formType: 'ITR-2',
    icon: '📊',
  },
  {
    id: 'rental',
    label: 'Rental Income',
    description: 'House or commercial property let out',
    formType: 'ITR-1',
    icon: '🏠',
  },
  {
    id: 'capital_gains',
    label: 'Capital Gains',
    description: 'Sale of property, shares or other assets',
    formType: 'ITR-2',
    icon: '₹',
  },
  {
    id: 'multiple',
    label: 'Multiple Income Sources',
    description: 'Any combination of the above',
    formType: 'ITR-2 / ITR-3',
    icon: '🔲',
  },
]

export const STEPS_METADATA: StepMeta[] = [
  {
    stepNumber: 1,
    title: 'What describes your income?',
    customerSees:
      '"What describes your income?" — a simple list: Salaried, Business, Professional, Freelancer, Trader/Investor, Rental Income, Capital Gains, Multiple Income Sources.',
    happensNext:
      'The customer\'s choice decides which ITR form (ITR-1 to ITR-7) applies and which questions appear next.',
    flowLabel: 'What describes your income?',
  },
  {
    stepNumber: 2,
    title: 'A few details about your income',
    customerSees:
      'A form asking for PAN, Aadhaar, and — depending on the income type chosen — Form 16, Form 16A, AIS, TIS, bank statements, salary details, business/professional income, rental income, or capital gains.',
    happensNext:
      'Only the fields relevant to the selected income type are shown, so the form never feels overwhelming.',
    flowLabel: 'A form asking for PAN, Aadhaar, and — depending on the...',
  },
  {
    stepNumber: 3,
    title: 'Deductions',
    customerSees:
      'A section for deductions: investment details (like 80C), insurance, home loan interest, education loan interest, and any other deductions. Also asks: "Do you have a previous ITR or any tax notice to reference?"',
    happensNext:
      'This information is used to reduce the customer\'s taxable income correctly.',
    flowLabel: 'A section for deductions: investment details (like...',
  },
  {
    stepNumber: 4,
    title: 'Your document checklist',
    customerSees:
      'An auto-generated document checklist — only the documents actually needed for this customer\'s situation, each with an upload button and a ✓ once uploaded.',
    happensNext:
      'The customer uploads documents directly from their phone/computer; nothing is filed until all required documents are in.',
    flowLabel: 'An auto-generated document checklist — only the...',
  },
  {
    stepNumber: 5,
    title: 'Your application has been received',
    customerSees:
      'A confirmation screen: "Your ITR application has been received" with an Application ID (e.g. ITR-2026-00042) and a status tracker.',
    happensNext:
      'The application enters the ITR queue for a Tax Executive to pick up and verify.',
    flowLabel: 'A confirmation screen: "Your ITR application has been...',
  },
  {
    stepNumber: 6,
    title: 'Please review your tax computation',
    customerSees:
      'Once the Tax Executive has prepared the return, the customer sees: "Please review your tax computation" — tax payable or refund amount, clearly shown.',
    happensNext:
      'The customer must tap Approve before anything is filed — nothing is submitted to the department without their sign-off.',
    flowLabel: 'Once the Tax Executive has prepared the return, the...',
  },
  {
    stepNumber: 7,
    title: 'Your ITR has been filed',
    customerSees:
      'After filing: "Your ITR has been filed. Please e-verify to complete the process" with a button to e-verify via Aadhaar OTP or net banking.',
    happensNext:
      'Once e-verified, the return moves into department processing; the customer is notified of the final outcome (refund or tax payable).',
    flowLabel: 'After filing: "Your ITR has been filed. Please...',
  },
]

export const DEFAULT_CHECKLIST_DOCUMENTS: DocumentChecklistItem[] = [
  { id: 'pan', name: 'PAN', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
  { id: 'aadhaar', name: 'Aadhaar', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
  { id: 'form16', name: 'Form 16', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
  { id: 'salary_details', name: 'Salary details', formats: 'PDF, JPG or PNG · up to 10 MB', required: false },
  { id: 'bank_statements', name: 'Bank statements', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
  { id: 'ais', name: 'AIS', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
  { id: 'tis', name: 'TIS', formats: 'PDF, JPG or PNG · up to 10 MB', required: true },
]
