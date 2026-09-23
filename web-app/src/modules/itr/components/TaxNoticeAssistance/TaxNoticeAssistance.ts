export interface UploadedFileInfo {
  name: string
  size: string
  uploadedAt: string
}

export interface NoticeStepMeta {
  stepNumber: number
  title: string
  customerSees: string
  happensNext: string
  flowLabel: string
}

export interface NoticeUploadItem {
  id: string
  title: string
  formats: string
}

export const NOTICE_STEPS_METADATA: NoticeStepMeta[] = [
  {
    stepNumber: 1,
    title: 'Received a notice from the Income Tax Department?',
    customerSees:
      '"Received a notice from the Income Tax Department? Upload it here." — an upload button for a photo/PDF of the notice, plus a field for the Notice Number.',
    happensNext: 'Staff need the actual notice to understand what the department is asking for.',
    flowLabel: '"Received a notice from the Income Tax Department?...',
  },
  {
    stepNumber: 2,
    title: 'Here’s what this notice means',
    customerSees:
      'Once staff review it: "Here\'s what this notice means" — a short, plain-language explanation of the notice type and what response is needed, shown to the customer.',
    happensNext: 'Removes the fear/confusion customers usually feel when they receive a tax notice.',
    flowLabel: 'Once staff review it: "Here\'s what this notice means"...',
  },
  {
    stepNumber: 3,
    title: 'We need a few more details to respond',
    customerSees:
      '"We need a few more details/documents to respond" — a dynamic checklist based on what the specific notice requires.',
    happensNext: "Only asks for what's actually needed for this particular notice.",
    flowLabel: 'We need a few more details/documents to respond',
  },
  {
    stepNumber: 4,
    title: 'Please review our response before we submit it',
    customerSees:
      '"Please review our response before we submit it" — shows the drafted reply in simple terms, with Approve and Request Changes buttons.',
    happensNext: 'The customer always has final say before anything is sent to the department on their behalf.',
    flowLabel: 'Please review our response before we submit it',
  },
  {
    stepNumber: 5,
    title: 'Notice response status',
    customerSees:
      'A status tracker: Draft → Under Review → Response Submitted → Resolved, with a notification when the department closes the notice.',
    happensNext: 'Keeps the customer informed without needing to follow up manually.',
    flowLabel: 'A status tracker: Draft → Under Review → Response...',
  },
]

export const NOTICE_CHECKLIST_DOCS: NoticeUploadItem[] = [
  { id: 'bank_interest_cert', title: 'Bank interest certificate', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'ais_ay2526', title: 'AIS for AY 2025-26', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'form_26as', title: 'Form 26AS', formats: 'PDF, JPG or PNG · up to 10 MB' },
  { id: 'statement_in_question', title: 'Statement for the account in question', formats: 'PDF, JPG or PNG · up to 10 MB' },
]
