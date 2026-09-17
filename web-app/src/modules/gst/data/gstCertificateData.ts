export interface CertificateRequestTypeOption {
  key: string
  label: string
}

export const GST_CERTIFICATE_CUSTOMER_RECORD = {
  gstin: '27AXTPD4419K1ZP',
  registeredContact: '+91 98670 41255 · anjali@shreedeshmukh.in',
  mobile: '+91 98670 41255',
  email: 'anjali@shreedeshmukh.in',
  businessName: 'Shree Deshmukh Enterprises',
} as const

export const GST_CERTIFICATE_REQUEST_TYPES: CertificateRequestTypeOption[] = [
  {
    key: 'download_existing',
    label: 'Download Existing Certificate',
  },
  {
    key: 'request_reprint',
    label: 'Request Reprint',
  },
]

export const GST_CERTIFICATE_META = {
  sectionTag: 'SECTION 6 · FORM 5 OF 5',
  title: 'GST Certificate',
  description: 'The lightest of the four — simply retrieving an already-issued certificate.',
  fieldNotes: {
    gstin: "Auto-filled from the customer's GST Registration",
    registeredContact: 'Used only to confirm identity before releasing the download',
    requestType: 'Download Existing Certificate or Request Reprint',
  },
} as const
